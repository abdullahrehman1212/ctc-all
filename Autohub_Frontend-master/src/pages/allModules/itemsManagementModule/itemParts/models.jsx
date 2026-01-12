import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, RefreshCw, Search, Trash2 } from 'lucide-react';

import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Page from '../../../../layout/Page/Page';
import apiClient from '../../../../baseURL/apiClient';
import PartsModuleNav from '../../../../components/parts/PartsModuleNav';
import { cn } from '../../../../lib/utils';
import { itemsManagementModule } from '../../../../menu';

function getPartNoFromRow(row) {
	return row?.machine_part_oem_part?.oem_part_number?.number2 ?? '';
}
function getOemNoFromRow(row) {
	return row?.machine_part_oem_part?.oem_part_number?.number1 ?? '';
}
function getPartTitleFromRow(row) {
	return row?.name ?? row?.machine_part_oem_part?.machine_part?.name ?? '';
}
function getModelNameFromRow(row) {
	return (
		row?.machine_model?.name ||
		(row?.machine_models?.[0]?.name ?? '') ||
		(row?.machine_model_id?.name ?? '') ||
		''
	);
}

export default function ModelsPage() {
	const [partNoSearch, setPartNoSearch] = useState('');
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef(null);

	const [searchLoading, setSearchLoading] = useState(false);
	const [searchResults, setSearchResults] = useState([]); // raw rows from backend
	const [selectedPartNo, setSelectedPartNo] = useState('');

	const [rowsLoading, setRowsLoading] = useState(false);
	const [rows, setRows] = useState([]); // raw rows for selected part no

	const [deleteDialog, setDeleteDialog] = useState({ open: false, model: null, busy: false });

	useEffect(() => {
		const onDown = (e) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
		};
		document.addEventListener('mousedown', onDown);
		return () => document.removeEventListener('mousedown', onDown);
	}, []);

	// Search suggestions (server-side filter so it can find in large data)
	useEffect(() => {
		const q = partNoSearch.trim();
		if (!q) {
			setSearchResults([]);
			return;
		}

		const t = setTimeout(() => {
			setSearchLoading(true);
			apiClient
				// existing backend supports these query params in the old index page
				.get(`/getModelItemOem?records=20&pageNo=1&colName=id&sort=desc&company_oem_number=${encodeURIComponent(q)}`)
				.then((res) => {
					const payload = res.data?.data;
					const list = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
					setSearchResults(list);
					setShowDropdown(true);
				})
				.finally(() => setSearchLoading(false));
		}, 250);

		return () => clearTimeout(t);
	}, [partNoSearch]);

	const refreshSelected = () => {
		if (!selectedPartNo) return;
		setRowsLoading(true);
		apiClient
			.get(
				`/getModelItemOem?records=200&pageNo=1&colName=id&sort=desc&company_oem_number=${encodeURIComponent(selectedPartNo)}`,
			)
			.then((res) => {
				const payload = res.data?.data;
				const list = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
				// ensure exact match (backend may return partial)
				const exact = list.filter((r) => getPartNoFromRow(r) === selectedPartNo);
				setRows(exact.length ? exact : list);
			})
			.finally(() => setRowsLoading(false));
	};

	useEffect(() => {
		refreshSelected();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedPartNo]);

	const selectedMeta = useMemo(() => {
		const first = rows[0] || searchResults.find((r) => getPartNoFromRow(r) === selectedPartNo) || null;
		return {
			partNo: selectedPartNo,
			oemNo: first ? getOemNoFromRow(first) : '',
			title: first ? getPartTitleFromRow(first) : '',
		};
	}, [rows, searchResults, selectedPartNo]);

	const modelRows = useMemo(() => {
		// Group by machine model name, Qty Used = count of records
		const map = new Map();
		rows.forEach((r) => {
			const name = getModelNameFromRow(r);
			if (!name) return;
			if (!map.has(name)) map.set(name, { name, qtyUsed: 0, ids: [] });
			const entry = map.get(name);
			entry.qtyUsed += 1;
			entry.ids.push(r.id);
		});
		return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
	}, [rows]);

	const suggestions = useMemo(() => {
		const uniq = new Map();
		searchResults.forEach((r) => {
			const partNo = getPartNoFromRow(r);
			if (!partNo) return;
			if (!uniq.has(partNo)) {
				uniq.set(partNo, {
					partNo,
					title: getPartTitleFromRow(r),
					oemNo: getOemNoFromRow(r),
				});
			}
		});
		return [...uniq.values()].slice(0, 10);
	}, [searchResults]);

	const openDelete = (model) => setDeleteDialog({ open: true, model, busy: false });
	const doDelete = async () => {
		const m = deleteDialog.model;
		if (!m?.ids?.length) return;
		setDeleteDialog((p) => ({ ...p, busy: true }));
		try {
			// delete all rows that create this model grouping
			await Promise.all(m.ids.map((id) => apiClient.delete(`/deleteModelItemOem?id=${id}`)));
			setDeleteDialog({ open: false, model: null, busy: false });
			refreshSelected();
		} catch (e) {
			setDeleteDialog((p) => ({ ...p, busy: false }));
			// eslint-disable-next-line no-alert
			alert('Delete failed. This model may be in use.');
		}
	};

	return (
		<PageWrapper title='Models Management'>
			<PartsModuleNav />
			<Page container='fluid'>
				<div className='mt-4 mb-4'>
					<div className='flex items-center gap-2'>
						<div className='w-1 h-8 bg-orange-500 rounded-full' />
						<div>
							<h1 className='text-2xl font-bold text-foreground'>Models Management</h1>
							<p className='text-sm text-muted-foreground'>
								Select a part to view its models and quantity used
							</p>
						</div>
					</div>
				</div>

				{/* Model Selection */}
				<div className='bg-card rounded-xl border border-border p-6 mb-4'>
					<div className='flex items-center gap-2 mb-6'>
						<div className='w-1 h-6 bg-orange-500 rounded-full' />
						<h2 className='text-lg font-semibold text-foreground'>Model Selection</h2>
					</div>

					<div ref={dropdownRef} className='relative max-w-3xl'>
						<label className='block text-sm font-medium text-foreground mb-2'>
							Part No <span className='text-red-500'>*</span>
						</label>
						<div className='relative'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
							<input
								value={partNoSearch}
								onChange={(e) => setPartNoSearch(e.target.value)}
								onFocus={() => suggestions.length && setShowDropdown(true)}
								placeholder='Search by part no...'
								className='w-full h-10 pl-10 pr-3 rounded-md border border-border bg-background text-sm'
							/>
						</div>

						{showDropdown ? (
							<div className='absolute z-50 mt-2 w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden'>
								<div className='max-h-64 overflow-auto'>
									{searchLoading ? (
										<div className='p-3 text-sm text-muted-foreground'>Searching…</div>
									) : suggestions.length === 0 ? (
										<div className='p-3 text-sm text-muted-foreground'>No results</div>
									) : (
										suggestions.map((s) => (
											<button
												key={s.partNo}
												type='button'
												onClick={() => {
													setSelectedPartNo(s.partNo);
													setPartNoSearch(s.partNo);
													setShowDropdown(false);
												}}
												className='w-full text-left px-4 py-3 hover:bg-muted/40'>
												<div className='font-medium text-foreground'>{s.partNo}</div>
												<div className='text-xs text-muted-foreground truncate'>
													{s.title ? `${s.title}` : '—'}
													{s.oemNo ? ` • OEM: ${s.oemNo}` : ''}
												</div>
											</button>
										))
									)}
								</div>
							</div>
						) : null}
					</div>
				</div>

				{/* Models Table */}
				<div className='bg-card rounded-xl border border-border p-6'>
					<div className='flex items-start justify-between gap-3 mb-4'>
						<div>
							<div className='flex items-center gap-2'>
								<div className='w-1 h-6 bg-orange-500 rounded-full' />
								<h2 className='text-lg font-semibold text-foreground'>
									Models for {selectedMeta.partNo || '—'}
								</h2>
							</div>
							<p className='text-sm text-muted-foreground ml-3'>
								{selectedMeta.title ? selectedMeta.title : 'Select a part no to load models'}
							</p>
						</div>

						<div className='flex items-center gap-2'>
							<button
								type='button'
								onClick={() => {
									// No backend endpoint exists to add a model association directly here.
									// Send user to Parts Entry to add models via existing workflow.
									window.location.href = `/${itemsManagementModule.itemsManagement.subMenu.itemParts.path}`;
								}}
								className='h-9 px-3 rounded-md bg-orange-500 hover:bg-orange-500/90 text-white text-sm font-medium flex items-center gap-2'>
								<Plus className='w-4 h-4' />
								Add Model
							</button>
							<button
								type='button'
								onClick={refreshSelected}
								disabled={!selectedPartNo || rowsLoading}
								className={cn(
									'h-9 px-3 rounded-md border border-border bg-background hover:bg-muted text-sm font-medium flex items-center gap-2',
									(!selectedPartNo || rowsLoading) && 'opacity-50 cursor-not-allowed',
								)}>
								<RefreshCw className='w-4 h-4' />
								Refresh
							</button>
						</div>
					</div>

					<div className='overflow-hidden rounded-lg border border-border'>
						<table className='w-full text-sm'>
							<thead className='bg-muted/30'>
								<tr>
									<th className='text-left px-4 py-3 text-xs font-medium text-muted-foreground'>Model</th>
									<th className='text-center px-4 py-3 text-xs font-medium text-muted-foreground'>
										Qty. Used
									</th>
									<th className='text-center px-4 py-3 text-xs font-medium text-muted-foreground'>
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{rowsLoading ? (
									<tr>
										<td colSpan={3} className='px-4 py-10 text-center text-muted-foreground'>
											Loading…
										</td>
									</tr>
								) : !selectedPartNo ? (
									<tr>
										<td colSpan={3} className='px-4 py-10 text-center text-muted-foreground'>
											Select a Part No to view models
										</td>
									</tr>
								) : modelRows.length === 0 ? (
									<tr>
										<td colSpan={3} className='px-4 py-10 text-center text-muted-foreground'>
											No models found for this part
										</td>
									</tr>
								) : (
									modelRows.map((m) => (
										<tr key={m.name} className='border-t border-border'>
											<td className='px-4 py-4 font-medium text-foreground'>{m.name}</td>
											<td className='px-4 py-4 text-center text-foreground'>{m.qtyUsed}</td>
											<td className='px-4 py-4 text-center'>
												<button
													type='button'
													onClick={() => openDelete(m)}
													className='h-8 w-8 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white inline-flex items-center justify-center'>
													<Trash2 className='w-4 h-4' />
												</button>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>

					<div className='flex justify-center mt-6'>
						<button
							type='button'
							onClick={() => {
								setSelectedPartNo('');
								setPartNoSearch('');
								setRows([]);
								setSearchResults([]);
							}}
							className='h-9 px-10 rounded-md border border-border bg-background hover:bg-muted text-sm'>
							Reset
						</button>
					</div>
				</div>

				{/* Delete confirmation */}
				{deleteDialog.open ? (
					<div className='fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4'>
						<div className='bg-card border border-border rounded-lg w-full max-w-md shadow-xl overflow-hidden'>
							<div className='p-4 border-b border-border'>
								<div className='text-sm font-semibold text-foreground'>Delete Model</div>
								<div className='text-xs text-muted-foreground mt-1'>
									Are you sure you want to remove model{' '}
									<span className='font-semibold text-foreground'>{deleteDialog.model?.name}</span> from{' '}
									<span className='font-semibold text-foreground'>{selectedMeta.partNo}</span>?
								</div>
							</div>
							<div className='p-4 flex items-center justify-end gap-2'>
								<button
									type='button'
									className='h-8 px-3 rounded-md border border-border hover:bg-muted text-xs'
									disabled={deleteDialog.busy}
									onClick={() => setDeleteDialog({ open: false, model: null, busy: false })}>
									Cancel
								</button>
								<button
									type='button'
									className={cn(
										'h-8 px-3 rounded-md text-xs text-white',
										deleteDialog.busy ? 'bg-red-500/60' : 'bg-red-500 hover:bg-red-500/90',
									)}
									disabled={deleteDialog.busy}
									onClick={doDelete}>
									{deleteDialog.busy ? 'Deleting…' : 'Delete'}
								</button>
							</div>
						</div>
					</div>
				) : null}
			</Page>
		</PageWrapper>
	);
}

