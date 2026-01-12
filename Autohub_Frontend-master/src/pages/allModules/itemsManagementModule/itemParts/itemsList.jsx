import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { CheckCircle, ChevronDown, Download, Plus, Printer, Search, Trash2, Edit } from 'lucide-react';

import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Page from '../../../../layout/Page/Page';
import apiClient from '../../../../baseURL/apiClient';
import PartsModuleNav from '../../../../components/parts/PartsModuleNav';
import { cn } from '../../../../lib/utils';
import { itemsManagementModule } from '../../../../menu';

function toText(v) {
	if (v === null || v === undefined) return '';
	return String(v);
}

function mapRowToItem(row) {
	return {
		id: row?.id,
		masterPartNo: row?.machine_part_oem_part?.oem_part_number?.number1 ?? '',
		partNo: row?.machine_part_oem_part?.oem_part_number?.number2 ?? '',
		brand: row?.brand?.name ?? '',
		description: row?.name ?? row?.machine_part_oem_part?.machine_part?.name ?? '',
		category: row?.machine_part_oem_part?.machine_part?.subcategories?.categories?.name ?? '',
		subCategory: row?.machine_part_oem_part?.machine_part?.subcategories?.name ?? '',
		application: row?.machine_part_oem_part?.machine_part?.type?.name ?? '',
		status: row?.status ?? 'Active',
		_raw: row,
	};
}

function toSelectOptions(values) {
	return values.map((v) => ({ value: v, label: v }));
}

export default function PartsItemsListPage() {
	const navigate = useNavigate();

	const [listTab, setListTab] = useState('parts-list'); // parts-list | kits-list
	const [loading, setLoading] = useState(true);
	const [pageNo, setPageNo] = useState(1);
	const [perPage] = useState(20);

	const [data, setData] = useState({ rows: [], meta: { from: 1, to: 1, total: 0 } });

	// Filters
	const [searchQuery, setSearchQuery] = useState('');
	const [masterPartNoFilter, setMasterPartNoFilter] = useState('');
	const [partNoFilter, setPartNoFilter] = useState('');
	const [brandFilter, setBrandFilter] = useState('');
	const [descriptionFilter, setDescriptionFilter] = useState('');
	const [categoryFilter, setCategoryFilter] = useState(null);
	const [subCategoryFilter, setSubCategoryFilter] = useState(null);
	const [applicationFilter, setApplicationFilter] = useState(null);

	const [selectedIds, setSelectedIds] = useState([]);

	const [exportOpen, setExportOpen] = useState(false);
	const [deleteConfirm, setDeleteConfirm] = useState({ open: false, item: null, busy: false });

	const selectStyles = useMemo(
		() => ({
			option: (provided) => ({ ...provided, color: 'black' }),
			singleValue: (provided) => ({ ...provided, color: 'black' }),
		}),
		[],
	);

	const refresh = () => {
		setLoading(true);
		apiClient
			.get(`/getModelItemOem?records=${perPage}&pageNo=${pageNo}&colName=id&sort=desc`)
			.then((res) => {
				const payload = res.data?.data;
				const rows = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
				setData({
					rows: rows.map(mapRowToItem),
					meta: {
						from: payload?.from ?? 1,
						to: payload?.to ?? rows.length,
						total: payload?.total ?? rows.length,
					},
				});
				setSelectedIds([]);
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		refresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pageNo]);

	const categories = useMemo(() => {
		const s = new Set(data.rows.map((r) => r.category).filter(Boolean));
		return [...s].sort();
	}, [data.rows]);
	const subCategories = useMemo(() => {
		const s = new Set(data.rows.map((r) => r.subCategory).filter(Boolean));
		return [...s].sort();
	}, [data.rows]);
	const applications = useMemo(() => {
		const s = new Set(data.rows.map((r) => r.application).filter(Boolean));
		return [...s].sort();
	}, [data.rows]);

	const filteredItems = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		return data.rows.filter((item) => {
			const matchesSearch =
				!q ||
				[
					item.masterPartNo,
					item.partNo,
					item.brand,
					item.description,
					item.category,
					item.subCategory,
					item.application,
					item.status,
				]
					.map((x) => toText(x).toLowerCase())
					.some((x) => x.includes(q));

			const matchesMaster =
				!masterPartNoFilter ||
				toText(item.masterPartNo).toLowerCase().includes(masterPartNoFilter.toLowerCase());
			const matchesPart =
				!partNoFilter || toText(item.partNo).toLowerCase().includes(partNoFilter.toLowerCase());
			const matchesBrand =
				!brandFilter || toText(item.brand).toLowerCase().includes(brandFilter.toLowerCase());
			const matchesDesc =
				!descriptionFilter ||
				toText(item.description).toLowerCase().includes(descriptionFilter.toLowerCase());
			const matchesCat = !categoryFilter?.value || item.category === categoryFilter.value;
			const matchesSub = !subCategoryFilter?.value || item.subCategory === subCategoryFilter.value;
			const matchesApp = !applicationFilter?.value || item.application === applicationFilter.value;

			return (
				matchesSearch &&
				matchesMaster &&
				matchesPart &&
				matchesBrand &&
				matchesDesc &&
				matchesCat &&
				matchesSub &&
				matchesApp
			);
		});
	}, [
		applicationFilter,
		brandFilter,
		categoryFilter,
		data.rows,
		descriptionFilter,
		masterPartNoFilter,
		partNoFilter,
		searchQuery,
		subCategoryFilter,
	]);

	const allSelectedOnPage =
		filteredItems.length > 0 && selectedIds.length === filteredItems.map((x) => x.id).length;

	const toggleSelectAll = () => {
		if (allSelectedOnPage) setSelectedIds([]);
		else setSelectedIds(filteredItems.map((x) => x.id));
	};

	const toggleOne = (id) => {
		setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
	};

	const downloadCsv = (rows) => {
		const headers = [
			'Master Part No',
			'Part No',
			'Brand',
			'Description',
			'Category',
			'Sub Category',
			'Application',
			'Status',
		];
		const csvData = rows.map((r) => [
			r.masterPartNo,
			r.partNo,
			r.brand,
			r.description,
			r.category,
			r.subCategory,
			r.application,
			r.status,
		]);
		const csvContent = [headers.join(','), ...csvData.map((row) => row.map((c) => `"${toText(c).replace(/"/g, '""')}"`).join(','))].join('\n');
		const blob = new Blob([csvContent], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'parts-list.csv';
		a.click();
		URL.revokeObjectURL(url);
	};

	const handleDelete = async () => {
		if (!deleteConfirm.item?.id) return;
		setDeleteConfirm((p) => ({ ...p, busy: true }));
		try {
			await apiClient.delete(`/deleteModelItemOem?id=${deleteConfirm.item.id}`);
			setDeleteConfirm({ open: false, item: null, busy: false });
			refresh();
		} catch {
			setDeleteConfirm((p) => ({ ...p, busy: false }));
		}
	};

	return (
		<PageWrapper title='Parts & Kits List'>
			<PartsModuleNav />
			<Page container='fluid'>
				<div className='flex items-start justify-between mt-4 mb-4'>
					<div className='flex items-start gap-2'>
						<div className='w-1 h-12 bg-orange-500 rounded-full' />
						<div>
							<h1 className='text-xl font-bold text-foreground'>Parts &amp; Kits List</h1>
							<p className='text-xs text-muted-foreground'>
								Search, filter, and manage all inventory parts and kits
							</p>
						</div>
					</div>

					<div className='flex items-center gap-2'>
						<div className='relative'>
							<button
								type='button'
								onClick={() => setExportOpen((v) => !v)}
								className='h-9 px-3 rounded-md border border-border bg-card hover:bg-muted flex items-center gap-2 text-xs font-medium'>
								<Download className='w-4 h-4' />
								Export
								<ChevronDown className='w-4 h-4' />
							</button>
							{exportOpen ? (
								<div className='absolute right-0 mt-2 w-44 bg-card border border-border rounded-md shadow-lg z-50 overflow-hidden'>
									<button
										type='button'
										onClick={() => {
											setExportOpen(false);
											downloadCsv(filteredItems);
										}}
										className='w-full px-3 py-2 text-left text-xs hover:bg-muted'>
										Download CSV
									</button>
									<button
										type='button'
										onClick={() => {
											setExportOpen(false);
											window.print();
										}}
										className='w-full px-3 py-2 text-left text-xs hover:bg-muted flex items-center gap-2'>
										<Printer className='w-4 h-4' /> Print
									</button>
								</div>
							) : null}
						</div>

						<button
							type='button'
							onClick={() => navigate(`/${itemsManagementModule.itemsManagement.subMenu.itemParts.path}`)}
							className='h-9 px-3 rounded-md bg-orange-500 hover:bg-orange-500/90 text-white text-xs font-medium flex items-center gap-2'>
							<Plus className='w-4 h-4' />
							New Part
						</button>
					</div>
				</div>

				<div className='flex border-b border-border mb-4'>
					<button
						type='button'
						onClick={() => setListTab('parts-list')}
						className={cn(
							'flex-1 py-2.5 text-xs font-medium transition-all relative text-center',
							listTab === 'parts-list'
								? 'text-orange-500'
								: 'text-muted-foreground hover:text-foreground',
						)}>
						Parts List
						{listTab === 'parts-list' ? (
							<div className='absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500' />
						) : null}
					</button>
					<button
						type='button'
						onClick={() => setListTab('kits-list')}
						className={cn(
							'flex-1 py-2.5 text-xs font-medium transition-all relative text-center',
							listTab === 'kits-list'
								? 'text-orange-500'
								: 'text-muted-foreground hover:text-foreground',
						)}>
						Kits List
						{listTab === 'kits-list' ? (
							<div className='absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500' />
						) : null}
					</button>
				</div>

				{listTab === 'parts-list' ? (
					<div className='space-y-4'>
						<div className='bg-card rounded-lg border border-border'>
							<div className='p-4 flex items-center justify-between'>
								<div className='text-sm font-semibold text-foreground'>Search &amp; Filters</div>
								<button
									type='button'
									onClick={toggleSelectAll}
									className='h-8 px-3 rounded-md border border-border hover:bg-muted text-xs font-medium flex items-center gap-2'>
									<CheckCircle className='w-4 h-4' />
									{allSelectedOnPage ? 'Deselect All' : 'Select All'}
								</button>
							</div>

							<div className='px-4 pb-4 space-y-3'>
								<div className='relative'>
									<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
									<input
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										placeholder='Quick search across all fields...'
										className='w-full h-9 pl-9 pr-3 rounded-md border border-border bg-background text-xs'
									/>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-4 xl:grid-cols-8 gap-3'>
									<div className='space-y-1'>
										<label className='text-xs font-medium text-muted-foreground'>Master Part No</label>
										<input
											value={masterPartNoFilter}
											onChange={(e) => setMasterPartNoFilter(e.target.value)}
											placeholder='Type to search or enter new'
											className='w-full h-9 rounded-md border border-border bg-background px-3 text-xs'
										/>
									</div>
									<div className='space-y-1'>
										<label className='text-xs font-medium text-muted-foreground'>Part No</label>
										<input
											value={partNoFilter}
											onChange={(e) => setPartNoFilter(e.target.value)}
											placeholder='Type to search or enter new'
											className='w-full h-9 rounded-md border border-border bg-background px-3 text-xs'
										/>
									</div>
									<div className='space-y-1'>
										<label className='text-xs font-medium text-muted-foreground'>Brand</label>
										<input
											value={brandFilter}
											onChange={(e) => setBrandFilter(e.target.value)}
											placeholder='Type to search or enter new'
											className='w-full h-9 rounded-md border border-border bg-background px-3 text-xs'
										/>
									</div>
									<div className='space-y-1'>
										<label className='text-xs font-medium text-muted-foreground'>Description</label>
										<input
											value={descriptionFilter}
											onChange={(e) => setDescriptionFilter(e.target.value)}
											placeholder='Filter by Description...'
											className='w-full h-9 rounded-md border border-border bg-background px-3 text-xs'
										/>
									</div>

									<div className='space-y-1'>
										<label className='text-xs font-medium text-muted-foreground'>Category</label>
										<Select
											isClearable
											styles={selectStyles}
											options={toSelectOptions(categories)}
											value={categoryFilter}
											onChange={setCategoryFilter}
											placeholder='All Categories'
										/>
									</div>
									<div className='space-y-1'>
										<label className='text-xs font-medium text-muted-foreground'>Sub Category</label>
										<Select
											isClearable
											styles={selectStyles}
											options={toSelectOptions(subCategories)}
											value={subCategoryFilter}
											onChange={setSubCategoryFilter}
											placeholder='All Sub Categories'
										/>
									</div>
									<div className='space-y-1'>
										<label className='text-xs font-medium text-muted-foreground'>Application</label>
										<Select
											isClearable
											styles={selectStyles}
											options={toSelectOptions(applications)}
											value={applicationFilter}
											onChange={setApplicationFilter}
											placeholder='All Applications'
										/>
									</div>
								</div>
							</div>
						</div>

						<div className='bg-card rounded-lg border border-border overflow-hidden'>
							<div className='p-4'>
								<div className='text-sm font-semibold text-foreground'>Parts List</div>
								<div className='text-xs text-muted-foreground'>
									{data.meta.total} parts found
								</div>
							</div>

							<div className='overflow-auto'>
								<table className='w-full text-xs'>
									<thead className='bg-muted/30'>
										<tr>
											<th className='px-4 py-3 w-10' />
											<th className='px-4 py-3 text-left font-medium'>Master Part No</th>
											<th className='px-4 py-3 text-left font-medium'>Part No</th>
											<th className='px-4 py-3 text-left font-medium'>Brand</th>
											<th className='px-4 py-3 text-left font-medium'>Description</th>
											<th className='px-4 py-3 text-left font-medium'>Category</th>
											<th className='px-4 py-3 text-left font-medium'>Sub Category</th>
											<th className='px-4 py-3 text-left font-medium'>Application</th>
											<th className='px-4 py-3 text-left font-medium'>Status</th>
											<th className='px-4 py-3 text-left font-medium'>Images</th>
											<th className='px-4 py-3 text-left font-medium'>Actions</th>
										</tr>
									</thead>

									<tbody>
										{loading ? (
											<tr>
												<td colSpan={11} className='px-4 py-10 text-center text-muted-foreground'>
													Loading...
												</td>
											</tr>
										) : filteredItems.length === 0 ? (
											<tr>
												<td colSpan={11} className='px-4 py-10 text-center text-muted-foreground'>
													No parts found matching your filters.
												</td>
											</tr>
										) : (
											filteredItems.map((item) => (
												<tr key={item.id} className='border-t border-border hover:bg-muted/20'>
													<td className='px-4 py-3'>
														<button
															type='button'
															onClick={() => toggleOne(item.id)}
															className={cn(
																'w-4 h-4 rounded-full border flex items-center justify-center',
																selectedIds.includes(item.id)
																	? 'border-orange-500 bg-orange-500'
																	: 'border-orange-500/60 bg-transparent',
															)}>
															{selectedIds.includes(item.id) ? (
																<div className='w-1.5 h-1.5 rounded-full bg-white' />
															) : null}
														</button>
													</td>
													<td className='px-4 py-3 font-medium text-foreground'>{item.masterPartNo || '-'}</td>
													<td className='px-4 py-3 font-semibold text-foreground'>{item.partNo || '-'}</td>
													<td className='px-4 py-3 text-muted-foreground'>{item.brand || '-'}</td>
													<td className='px-4 py-3 text-muted-foreground max-w-[220px] truncate'>{item.description || '-'}</td>
													<td className='px-4 py-3'>{item.category || '-'}</td>
													<td className='px-4 py-3'>{item.subCategory || '-'}</td>
													<td className='px-4 py-3'>{item.application || '-'}</td>
													<td className='px-4 py-3'>
														<span className='inline-flex items-center gap-1 px-2 py-1 rounded-full border border-emerald-500 text-emerald-600 bg-emerald-500/10 text-[10px] font-medium'>
															{toText(item.status) || 'Active'}
															<ChevronDown className='w-3 h-3' />
														</span>
													</td>
													<td className='px-4 py-3 text-muted-foreground'>-</td>
													<td className='px-4 py-3'>
														<div className='flex items-center gap-2'>
															<button
																type='button'
																title='Edit'
																className='h-7 w-7 rounded-md border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white flex items-center justify-center'
																onClick={() => {
																	// UI-only for now (keeps backend untouched). If you want full edit, we’ll wire the existing edit modal next.
																}}>
																<Edit className='w-4 h-4' />
															</button>
															<button
																type='button'
																title='Delete'
																className='h-7 w-7 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center'
																onClick={() => setDeleteConfirm({ open: true, item, busy: false })}>
																<Trash2 className='w-4 h-4' />
															</button>
														</div>
													</td>
												</tr>
											))
										)}
									</tbody>
								</table>
							</div>

							<div className='p-3 border-t border-border flex items-center justify-between'>
								<span className='text-xs text-muted-foreground'>
									Showing {data.meta.from} to {data.meta.to} of {data.meta.total} parts
								</span>
								<div className='flex gap-2'>
									<button
										type='button'
										className='h-8 px-3 rounded-md border border-border hover:bg-muted text-xs'
										disabled={pageNo <= 1}
										onClick={() => setPageNo((p) => Math.max(1, p - 1))}>
										Previous
									</button>
									<button
										type='button'
										className='h-8 px-3 rounded-md border border-border hover:bg-muted text-xs'
										disabled={data.meta.to >= data.meta.total}
										onClick={() => setPageNo((p) => p + 1)}>
										Next
									</button>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className='bg-card rounded-lg border border-border p-6 text-sm text-muted-foreground'>
						Kits list UI will be added here next (no backend changes).
					</div>
				)}

				{deleteConfirm.open ? (
					<div className='fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4'>
						<div className='bg-card border border-border rounded-lg w-full max-w-md shadow-xl'>
							<div className='p-4 border-b border-border'>
								<div className='text-sm font-semibold text-foreground'>Delete Part</div>
								<div className='text-xs text-muted-foreground'>
									Are you sure you want to delete{' '}
									<span className='font-semibold text-foreground'>
										{deleteConfirm.item?.partNo || deleteConfirm.item?.masterPartNo || 'this part'}
									</span>
									? This action cannot be undone.
								</div>
							</div>
							<div className='p-4 flex items-center justify-end gap-2'>
								<button
									type='button'
									className='h-8 px-3 rounded-md border border-border hover:bg-muted text-xs'
									disabled={deleteConfirm.busy}
									onClick={() => setDeleteConfirm({ open: false, item: null, busy: false })}>
									Cancel
								</button>
								<button
									type='button'
									className={cn(
										'h-8 px-3 rounded-md text-xs text-white',
										deleteConfirm.busy ? 'bg-red-500/60' : 'bg-red-500 hover:bg-red-500/90',
									)}
									disabled={deleteConfirm.busy}
									onClick={handleDelete}>
									{deleteConfirm.busy ? 'Deleting…' : 'Delete'}
								</button>
							</div>
						</div>
					</div>
				) : null}
			</Page>
		</PageWrapper>
	);
}

