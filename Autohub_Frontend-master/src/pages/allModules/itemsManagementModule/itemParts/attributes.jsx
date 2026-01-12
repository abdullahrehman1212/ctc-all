import React, { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { ChevronDown, Plus } from 'lucide-react';

import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Page from '../../../../layout/Page/Page';
import apiClient from '../../../../baseURL/apiClient';
import PartsModuleNav from '../../../../components/parts/PartsModuleNav';
import { cn } from '../../../../lib/utils';

function toOptions(list) {
	return Array.isArray(list) ? list.map((x) => ({ value: x.id, label: x.name, raw: x })) : [];
}

function safeLower(v) {
	return String(v ?? '').toLowerCase();
}

function ModalShell({ open, title, children, onClose }) {
	if (!open) return null;
	return (
		<div className='fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4'>
			<div className='bg-card border border-border rounded-lg w-full max-w-lg shadow-xl overflow-hidden'>
				<div className='p-4 border-b border-border flex items-center justify-between'>
					<div className='text-sm font-semibold text-foreground'>{title}</div>
					<button
						type='button'
						onClick={onClose}
						className='h-7 px-2 rounded-md border border-border hover:bg-muted text-xs'>
						Close
					</button>
				</div>
				<div className='p-4'>{children}</div>
			</div>
		</div>
	);
}

function ConfirmDialog({ open, title, description, busy, onCancel, onConfirm }) {
	if (!open) return null;
	return (
		<div className='fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4'>
			<div className='bg-card border border-border rounded-lg w-full max-w-md shadow-xl overflow-hidden'>
				<div className='p-4 border-b border-border'>
					<div className='text-sm font-semibold text-foreground'>{title}</div>
					<div className='text-xs text-muted-foreground mt-1'>{description}</div>
				</div>
				<div className='p-4 flex items-center justify-end gap-2'>
					<button
						type='button'
						className='h-8 px-3 rounded-md border border-border hover:bg-muted text-xs'
						disabled={busy}
						onClick={onCancel}>
						Cancel
					</button>
					<button
						type='button'
						className={cn(
							'h-8 px-3 rounded-md text-xs text-white',
							busy ? 'bg-red-500/60' : 'bg-red-500 hover:bg-red-500/90',
						)}
						disabled={busy}
						onClick={onConfirm}>
						{busy ? 'Deleting…' : 'Delete'}
					</button>
				</div>
			</div>
		</div>
	);
}

function StatusPill({ value = 'Active' }) {
	return (
		<span className='inline-flex items-center gap-1 px-2 py-1 rounded-full border border-emerald-500 text-emerald-600 bg-emerald-500/10 text-[10px] font-medium'>
			{value}
			<ChevronDown className='w-3 h-3' />
		</span>
	);
}

export default function AttributesPage() {
	const [loading, setLoading] = useState(true);
	const [cats, setCats] = useState([]);
	const [subs, setSubs] = useState([]);
	const [brands, setBrands] = useState([]);

	// Filters
	const [catFilter, setCatFilter] = useState(null);
	const [catSearch, setCatSearch] = useState('');
	const [subFilterCat, setSubFilterCat] = useState(null);
	const [subSearch, setSubSearch] = useState('');
	const [brandFilter, setBrandFilter] = useState(null);
	const [brandSearch, setBrandSearch] = useState('');

	// Modals
	const [catModal, setCatModal] = useState({ open: false, editing: null, name: '' });
	const [subModal, setSubModal] = useState({ open: false, editing: null, name: '', category: null });
	const [brandModal, setBrandModal] = useState({ open: false, editing: null, name: '' });
	const [deleteDialog, setDeleteDialog] = useState({ open: false, type: null, item: null, busy: false });

	const selectStyles = useMemo(
		() => ({
			option: (provided) => ({ ...provided, color: 'black' }),
			singleValue: (provided) => ({ ...provided, color: 'black' }),
		}),
		[],
	);

	const categoryOptions = useMemo(() => toOptions(cats), [cats]);
	const brandOptions = useMemo(() => toOptions(brands), [brands]);

	const subcategoryCounts = useMemo(() => {
		const counts = new Map();
		subs.forEach((s) => {
			const key = s.category_id;
			counts.set(key, (counts.get(key) || 0) + 1);
		});
		return counts;
	}, [subs]);

	const refreshAll = () => {
		setLoading(true);
		Promise.all([
			apiClient.get('/getCategories?records=200&pageNo=1&colName=id&sort=desc'),
			apiClient.get('/getSubCategories?records=500&pageNo=1&colName=id&sort=desc'),
			apiClient.get('/getCompanies?records=500&pageNo=1&colName=id&sort=asc'),
		])
			.then(([cRes, sRes, bRes]) => {
				setCats(cRes.data?.categories?.data ?? []);
				setSubs(sRes.data?.subcategory?.data ?? []);
				setBrands(bRes.data?.companies?.data ?? []);
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		refreshAll();
	}, []);

	const filteredCats = useMemo(() => {
		const q = safeLower(catSearch);
		return cats.filter((c) => {
			const matchesQ = !q || safeLower(c.name).includes(q);
			const matchesFilter = !catFilter?.value || c.id === catFilter.value;
			return matchesQ && matchesFilter;
		});
	}, [catFilter, catSearch, cats]);

	const subCatOptions = useMemo(() => {
		// for dropdowns, show categories as options
		return categoryOptions;
	}, [categoryOptions]);

	const filteredSubs = useMemo(() => {
		const q = safeLower(subSearch);
		return subs.filter((s) => {
			const matchesQ = !q || safeLower(s.name).includes(q);
			const matchesCat = !subFilterCat?.value || s.category_id === subFilterCat.value;
			return matchesQ && matchesCat;
		});
	}, [subFilterCat, subSearch, subs]);

	const filteredBrands = useMemo(() => {
		const q = safeLower(brandSearch);
		return brands.filter((b) => {
			const matchesQ = !q || safeLower(b.name).includes(q);
			const matchesFilter = !brandFilter?.value || b.id === brandFilter.value;
			return matchesQ && matchesFilter;
		});
	}, [brandFilter, brandSearch, brands]);

	const openEditCategory = async (cat) => {
		const res = await apiClient.get(`/editCategory?id=${cat.id}`);
		const editing = res.data?.Category ?? cat;
		setCatModal({ open: true, editing, name: editing?.name ?? '' });
	};

	const openEditSubcategory = async (sub) => {
		const res = await apiClient.get(`/editSubCategories?id=${sub.id}`);
		const editing = res.data?.subcategory ?? sub;
		const catOpt = categoryOptions.find((o) => o.value === editing?.category_id) ?? null;
		setSubModal({ open: true, editing, name: editing?.name ?? '', category: catOpt });
	};

	const openEditBrand = async (b) => {
		const res = await apiClient.get(`/editCompany?id=${b.id}`);
		const editing = res.data?.company ?? b;
		setBrandModal({ open: true, editing, name: editing?.name ?? '' });
	};

	const saveCategory = async () => {
		const name = catModal.name.trim();
		if (!name) return;
		if (catModal.editing?.id) {
			await apiClient.post('/updateCategory', { ...catModal.editing, name });
		} else {
			await apiClient.post('/addCategory', { name });
		}
		setCatModal({ open: false, editing: null, name: '' });
		refreshAll();
	};

	const saveSubcategory = async () => {
		const name = subModal.name.trim();
		const category_id = subModal.category?.value;
		if (!name || !category_id) return;
		if (subModal.editing?.id) {
			await apiClient.post('/updateSubCategories', { ...subModal.editing, name, category_id });
		} else {
			await apiClient.post('/addSubCategories', { name, category_id });
		}
		setSubModal({ open: false, editing: null, name: '', category: null });
		refreshAll();
	};

	const saveBrand = async () => {
		const name = brandModal.name.trim();
		if (!name) return;
		if (brandModal.editing?.id) {
			await apiClient.post('/updateCompany', { ...brandModal.editing, name });
		} else {
			await apiClient.post('/addCompany', { name });
		}
		setBrandModal({ open: false, editing: null, name: '' });
		refreshAll();
	};

	const requestDelete = (type, item) => {
		setDeleteDialog({ open: true, type, item, busy: false });
	};

	const confirmDelete = async () => {
		const { type, item } = deleteDialog;
		if (!type || !item?.id) return;
		setDeleteDialog((p) => ({ ...p, busy: true }));
		try {
			if (type === 'category') await apiClient.delete(`/deleteCategory?id=${item.id}`);
			if (type === 'subcategory') await apiClient.delete(`/deleteSubCategories?id=${item.id}`);
			if (type === 'brand') await apiClient.delete(`/deleteCompany?id=${item.id}`);
			setDeleteDialog({ open: false, type: null, item: null, busy: false });
			refreshAll();
		} catch (e) {
			setDeleteDialog((p) => ({ ...p, busy: false }));
			// keep it simple; backend sends message via status/error
			// eslint-disable-next-line no-alert
			alert('Delete failed. This record may be in use.');
		}
	};

	return (
		<PageWrapper title='Attributes'>
			<PartsModuleNav />
			<Page container='fluid'>
				<div className='mt-4 mb-4'>
					<h1 className='text-xl font-bold text-foreground'>Attributes</h1>
					<p className='text-xs text-muted-foreground'>
						Manage categories, subcategories, and brands for inventory organization
					</p>
				</div>

				{loading ? (
					<div className='p-6 text-sm text-muted-foreground'>Loading attributes…</div>
				) : (
					<div className='grid grid-cols-1 xl:grid-cols-12 gap-4'>
						{/* Categories */}
						<div className='xl:col-span-4 bg-card rounded-lg border border-border overflow-hidden'>
							<div className='p-4 flex items-center justify-between'>
								<div>
									<div className='text-sm font-semibold text-foreground'>Categories List</div>
									<div className='text-xs text-muted-foreground'>Manage main categories</div>
								</div>
								<button
									type='button'
									onClick={() => setCatModal({ open: true, editing: null, name: '' })}
									className='h-8 px-3 rounded-md bg-orange-500 hover:bg-orange-500/90 text-white text-xs font-medium flex items-center gap-2'>
									<Plus className='w-4 h-4' /> Add New
								</button>
							</div>

							<div className='px-4 pb-4'>
								<div className='grid grid-cols-12 gap-2'>
									<div className='col-span-4'>
										<Select
											styles={selectStyles}
											isClearable
											options={categoryOptions}
											value={catFilter}
											onChange={setCatFilter}
											placeholder='All Categories'
										/>
									</div>
									<div className='col-span-8'>
										<input
											value={catSearch}
											onChange={(e) => setCatSearch(e.target.value)}
											placeholder='Search categories...'
											className='w-full h-9 rounded-md border border-border bg-background px-3 text-xs'
										/>
									</div>
								</div>
							</div>

							<div className='px-4 py-2 text-xs text-muted-foreground border-t border-border'>
								All Categories ({cats.length})
							</div>

							<div className='max-h-[70vh] overflow-auto p-4 space-y-3'>
								{filteredCats.map((c) => (
									<div key={c.id} className='border border-border rounded-lg p-3 bg-background'>
										<div className='flex items-center justify-between gap-2'>
											<div className='min-w-0'>
												<div className='text-sm font-semibold text-foreground truncate'>{c.name}</div>
												<div className='flex items-center gap-2 mt-1 text-xs text-muted-foreground'>
													<StatusPill value='Active' />
													<span>{subcategoryCounts.get(c.id) || 0} subcategory</span>
												</div>
											</div>
											<div className='flex gap-2'>
												<button
													type='button'
													onClick={() => openEditCategory(c)}
													className='h-7 px-3 rounded-md border border-border hover:bg-muted text-xs'>
													Edit
												</button>
												<button
													type='button'
													onClick={() => requestDelete('category', c)}
													className='h-7 px-3 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-xs'>
													Delete
												</button>
											</div>
										</div>
									</div>
								))}
								{filteredCats.length === 0 ? (
									<div className='text-sm text-muted-foreground text-center py-8'>No categories found</div>
								) : null}
							</div>
						</div>

						{/* Sub Categories */}
						<div className='xl:col-span-4 bg-card rounded-lg border border-border overflow-hidden'>
							<div className='p-4 flex items-center justify-between'>
								<div>
									<div className='text-sm font-semibold text-foreground'>Sub Category List</div>
									<div className='text-xs text-muted-foreground'>Manage sub categories</div>
								</div>
								<button
									type='button'
									onClick={() => setSubModal({ open: true, editing: null, name: '', category: null })}
									className='h-8 px-3 rounded-md bg-orange-500 hover:bg-orange-500/90 text-white text-xs font-medium flex items-center gap-2'>
									<Plus className='w-4 h-4' /> Add New
								</button>
							</div>

							<div className='px-4 pb-4'>
								<div className='grid grid-cols-12 gap-2'>
									<div className='col-span-4'>
										<Select
											styles={selectStyles}
											isClearable
											options={subCatOptions}
											value={subFilterCat}
											onChange={setSubFilterCat}
											placeholder='All Categories'
										/>
									</div>
									<div className='col-span-8'>
										<input
											value={subSearch}
											onChange={(e) => setSubSearch(e.target.value)}
											placeholder='Search sub categories...'
											className='w-full h-9 rounded-md border border-border bg-background px-3 text-xs'
										/>
									</div>
								</div>
							</div>

							<div className='px-4 py-2 text-xs text-muted-foreground border-t border-border'>
								All Sub Categories ({subs.length})
							</div>

							<div className='max-h-[70vh] overflow-auto p-4 space-y-3'>
								{filteredSubs.map((s) => {
									const catName = cats.find((c) => c.id === s.category_id)?.name || '—';
									return (
										<div key={s.id} className='border border-border rounded-lg p-3 bg-background'>
											<div className='flex items-center justify-between gap-2'>
												<div className='min-w-0'>
													<div className='text-sm font-semibold text-foreground truncate'>
														{s.name}{' '}
														<span className='text-xs font-normal text-muted-foreground'>
															(under {catName})
														</span>
													</div>
													<div className='flex items-center gap-2 mt-1 text-xs text-muted-foreground'>
														<StatusPill value='Active' />
													</div>
												</div>
												<div className='flex gap-2'>
													<button
														type='button'
														onClick={() => openEditSubcategory(s)}
														className='h-7 px-3 rounded-md border border-border hover:bg-muted text-xs'>
														Edit
													</button>
													<button
														type='button'
														onClick={() => requestDelete('subcategory', s)}
														className='h-7 px-3 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-xs'>
														Delete
													</button>
												</div>
											</div>
										</div>
									);
								})}
								{filteredSubs.length === 0 ? (
									<div className='text-sm text-muted-foreground text-center py-8'>
										No sub categories found
									</div>
								) : null}
							</div>
						</div>

						{/* Brands */}
						<div className='xl:col-span-4 bg-card rounded-lg border border-border overflow-hidden'>
							<div className='p-4 flex items-center justify-between'>
								<div>
									<div className='text-sm font-semibold text-foreground'>Brands List</div>
									<div className='text-xs text-muted-foreground'>Manage product brands</div>
								</div>
								<button
									type='button'
									onClick={() => setBrandModal({ open: true, editing: null, name: '' })}
									className='h-8 px-3 rounded-md bg-orange-500 hover:bg-orange-500/90 text-white text-xs font-medium flex items-center gap-2'>
									<Plus className='w-4 h-4' /> Add New
								</button>
							</div>

							<div className='px-4 pb-4'>
								<div className='grid grid-cols-12 gap-2'>
									<div className='col-span-4'>
										<Select
											styles={selectStyles}
											isClearable
											options={brandOptions}
											value={brandFilter}
											onChange={setBrandFilter}
											placeholder='All Brands'
										/>
									</div>
									<div className='col-span-8'>
										<input
											value={brandSearch}
											onChange={(e) => setBrandSearch(e.target.value)}
											placeholder='Search brands...'
											className='w-full h-9 rounded-md border border-border bg-background px-3 text-xs'
										/>
									</div>
								</div>
							</div>

							<div className='px-4 py-2 text-xs text-muted-foreground border-t border-border'>
								All Brands ({brands.length})
							</div>

							<div className='max-h-[70vh] overflow-auto p-4 space-y-3'>
								{filteredBrands.map((b) => (
									<div key={b.id} className='border border-border rounded-lg p-3 bg-background'>
										<div className='flex items-center justify-between gap-2'>
											<div className='min-w-0'>
												<div className='text-sm font-semibold text-foreground truncate'>{b.name}</div>
												<div className='flex items-center gap-2 mt-1 text-xs text-muted-foreground'>
													<StatusPill value='Active' />
												</div>
											</div>
											<div className='flex gap-2'>
												<button
													type='button'
													onClick={() => openEditBrand(b)}
													className='h-7 px-3 rounded-md border border-border hover:bg-muted text-xs'>
													Edit
												</button>
												<button
													type='button'
													onClick={() => requestDelete('brand', b)}
													className='h-7 px-3 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-xs'>
													Delete
												</button>
											</div>
										</div>
									</div>
								))}
								{filteredBrands.length === 0 ? (
									<div className='text-sm text-muted-foreground text-center py-8'>No brands found</div>
								) : null}
							</div>
						</div>
					</div>
				)}

				{/* Modals */}
				<ModalShell
					open={catModal.open}
					title={catModal.editing?.id ? 'Edit Category' : 'Add Category'}
					onClose={() => setCatModal({ open: false, editing: null, name: '' })}>
					<div className='space-y-3'>
						<div>
							<label className='block text-xs font-medium text-muted-foreground mb-1'>Name</label>
							<input
								value={catModal.name}
								onChange={(e) => setCatModal((p) => ({ ...p, name: e.target.value }))}
								className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm'
								placeholder='Enter category name'
							/>
						</div>
						<div className='flex justify-end gap-2'>
							<button
								type='button'
								className='h-8 px-3 rounded-md border border-border hover:bg-muted text-xs'
								onClick={() => setCatModal({ open: false, editing: null, name: '' })}>
								Cancel
							</button>
							<button
								type='button'
								className='h-8 px-3 rounded-md bg-orange-500 hover:bg-orange-500/90 text-white text-xs'
								onClick={saveCategory}>
								Save
							</button>
						</div>
					</div>
				</ModalShell>

				<ModalShell
					open={subModal.open}
					title={subModal.editing?.id ? 'Edit Sub Category' : 'Add Sub Category'}
					onClose={() => setSubModal({ open: false, editing: null, name: '', category: null })}>
					<div className='space-y-3'>
						<div>
							<label className='block text-xs font-medium text-muted-foreground mb-1'>Category</label>
							<Select
								styles={selectStyles}
								options={categoryOptions}
								value={subModal.category}
								onChange={(val) => setSubModal((p) => ({ ...p, category: val }))}
								placeholder='Select category'
							/>
						</div>
						<div>
							<label className='block text-xs font-medium text-muted-foreground mb-1'>Name</label>
							<input
								value={subModal.name}
								onChange={(e) => setSubModal((p) => ({ ...p, name: e.target.value }))}
								className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm'
								placeholder='Enter sub category name'
							/>
						</div>
						<div className='flex justify-end gap-2'>
							<button
								type='button'
								className='h-8 px-3 rounded-md border border-border hover:bg-muted text-xs'
								onClick={() => setSubModal({ open: false, editing: null, name: '', category: null })}>
								Cancel
							</button>
							<button
								type='button'
								className='h-8 px-3 rounded-md bg-orange-500 hover:bg-orange-500/90 text-white text-xs'
								onClick={saveSubcategory}>
								Save
							</button>
						</div>
					</div>
				</ModalShell>

				<ModalShell
					open={brandModal.open}
					title={brandModal.editing?.id ? 'Edit Brand' : 'Add Brand'}
					onClose={() => setBrandModal({ open: false, editing: null, name: '' })}>
					<div className='space-y-3'>
						<div>
							<label className='block text-xs font-medium text-muted-foreground mb-1'>Name</label>
							<input
								value={brandModal.name}
								onChange={(e) => setBrandModal((p) => ({ ...p, name: e.target.value }))}
								className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm'
								placeholder='Enter brand name'
							/>
						</div>
						<div className='flex justify-end gap-2'>
							<button
								type='button'
								className='h-8 px-3 rounded-md border border-border hover:bg-muted text-xs'
								onClick={() => setBrandModal({ open: false, editing: null, name: '' })}>
								Cancel
							</button>
							<button
								type='button'
								className='h-8 px-3 rounded-md bg-orange-500 hover:bg-orange-500/90 text-white text-xs'
								onClick={saveBrand}>
								Save
							</button>
						</div>
					</div>
				</ModalShell>

				<ConfirmDialog
					open={deleteDialog.open}
					busy={deleteDialog.busy}
					title='Deletion Confirmation'
					description='Are you sure you want to delete this record?'
					onCancel={() => setDeleteDialog({ open: false, type: null, item: null, busy: false })}
					onConfirm={confirmDelete}
				/>
			</Page>
		</PageWrapper>
	);
}

