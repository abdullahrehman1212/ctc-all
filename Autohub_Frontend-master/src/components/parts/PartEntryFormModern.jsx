import React, { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { Plus, X } from 'lucide-react';
import apiClient from '@/baseURL/apiClient';
import { cn } from '@/lib/utils';

function toOptions(list) {
	if (!Array.isArray(list)) return [];
	return list.map(({ id, name }) => ({ id, value: id, label: name }));
}

export default function PartEntryFormModern({ onSaved }) {
	const [loading, setLoading] = useState(false);
	const [dropdownLoading, setDropdownLoading] = useState(true);

	const [machines, setMachines] = useState([]);
	const [makes, setMakes] = useState([]);
	const [models, setModels] = useState([]);
	const [items, setItems] = useState([]);
	const [origins, setOrigins] = useState([]);
	const [brands, setBrands] = useState([]);
	const [dimensions, setDimensions] = useState([]);

	const [form, setForm] = useState({
		number1: '', // OEM Number (required in old form)
		number2: '', // Part Number
		machine_id: [],
		make_id: [],
		machine_model_id: null,
		machine_part_id: null,
		brand_id: null,
		origin_id: null,
	});

	const [dimensionRows, setDimensionRows] = useState([{ id: '1', dimension_id: null, value: '' }]);

	const selectStyles = useMemo(
		() => ({
			option: (provided) => ({ ...provided, color: 'black' }),
			singleValue: (provided) => ({ ...provided, color: 'black' }),
		}),
		[],
	);

	useEffect(() => {
		let alive = true;
		setDropdownLoading(true);
		apiClient
			.get('/getDropDownsOptionsForItemPartsAdd')
			.then((res) => {
				if (!alive) return;
				setMachines(toOptions(res.data?.machines));
				setItems(toOptions(res.data?.machine_Parts));
				setDimensions(toOptions(res.data?.dimensions));
				setMakes(toOptions(res.data?.makes));
				setOrigins(toOptions(res.data?.origin));
				// backend returns companies used as brands in existing code
				setBrands(
					Array.isArray(res.data?.companies)
						? res.data.companies.map(({ id, name }) => ({ id, value: id, label: name }))
						: [],
				);
			})
			.finally(() => {
				if (!alive) return;
				setDropdownLoading(false);
			});
		return () => {
			alive = false;
		};
	}, []);

	useEffect(() => {
		// load models based on selected machine + make (matches old behavior)
		const machineId = form.machine_id?.[0]?.id;
		const makeId = form.make_id?.[0]?.id;
		if (!machineId || !makeId) {
			setModels([]);
			setForm((p) => ({ ...p, machine_model_id: null }));
			return;
		}
		apiClient
			.get(`/getMachineModelsDropDown?machine_id=${machineId}&make_id=${makeId}`)
			.then((res) => setModels(toOptions(res.data?.machineModels)))
			.catch(() => setModels([]));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form.machine_id, form.make_id]);

	const canSave =
		form.number1.trim() &&
		form.machine_model_id?.id &&
		form.machine_part_id?.id &&
		form.brand_id?.id &&
		dimensionRows.every((r) => r.dimension_id?.id && String(r.value || '').trim());

	const handleSave = async () => {
		if (!canSave) return;
		setLoading(true);
		try {
			const payload = {
				number1: form.number1,
				number2: form.number2,
				machine_id: (form.machine_id || []).map((o) => o.id),
				make_id: (form.make_id || []).map((o) => o.id),
				machine_model_id: form.machine_model_id?.id,
				machine_part_id: form.machine_part_id?.id,
				brand_id: form.brand_id?.id,
				origin_id: form.origin_id?.id || '',
				dimensions: dimensionRows.map((r) => ({
					dimension_id: r.dimension_id.id,
					value: r.value,
				})),
				alternateParts: [],
				alternativeBrands: [],
			};

			const res = await apiClient.post('/addModelItemOem', payload);
			if (res.data?.status === 'ok') {
				onSaved?.();
				setForm({
					number1: '',
					number2: '',
					machine_id: [],
					make_id: [],
					machine_model_id: null,
					machine_part_id: null,
					brand_id: null,
					origin_id: null,
				});
				setDimensionRows([{ id: '1', dimension_id: null, value: '' }]);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex gap-3 h-full'>
			<div className='flex-1 bg-card rounded-lg border border-border overflow-auto'>
				<div className='p-4'>
					<div className='flex items-center justify-between mb-4'>
						<div className='flex items-center gap-2'>
							<div className='w-0.5 h-8 bg-orange-500 rounded-full' />
							<div>
								<h2 className='text-base font-semibold text-foreground'>Create New Part</h2>
								<p className='text-muted-foreground text-xs'>Add a new inventory part</p>
							</div>
						</div>
						<button
							type='button'
							onClick={() => {
								setForm((p) => ({
									...p,
									number1: '',
									number2: '',
									machine_id: [],
									make_id: [],
									machine_model_id: null,
									machine_part_id: null,
									brand_id: null,
									origin_id: null,
								}));
								setDimensionRows([{ id: '1', dimension_id: null, value: '' }]);
							}}
							className='h-7 text-xs px-3 rounded-md border border-border hover:bg-muted'>
							New
						</button>
					</div>

					<div className='mb-4'>
						<div className='flex items-center gap-1.5 mb-3'>
							<span className='text-orange-500 text-xs'>•</span>
							<span className='text-xs font-medium text-foreground'>PART INFORMATION</span>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-3'>
							<div>
								<label className='block text-xs text-muted-foreground mb-1'>
									OEM Number <span className='text-red-500'>*</span>
								</label>
								<input
									value={form.number1}
									onChange={(e) => setForm((p) => ({ ...p, number1: e.target.value }))}
									placeholder='Enter OEM number'
									className='h-9 w-full rounded-md border border-[var(--bs-border-color,#e5e7eb)] px-3 text-sm bg-white'
								/>
							</div>
							<div>
								<label className='block text-xs text-muted-foreground mb-1'>Part Number</label>
								<input
									value={form.number2}
									onChange={(e) => setForm((p) => ({ ...p, number2: e.target.value }))}
									placeholder='Enter part number'
									className='h-9 w-full rounded-md border border-[var(--bs-border-color,#e5e7eb)] px-3 text-sm bg-white'
								/>
							</div>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-3 gap-3 mb-3'>
							<div>
								<label className='block text-xs text-muted-foreground mb-1'>Machine</label>
								<Select
									isMulti
									styles={selectStyles}
									isLoading={dropdownLoading}
									options={machines}
									value={form.machine_id}
									onChange={(val) => setForm((p) => ({ ...p, machine_id: val || [] }))}
								/>
							</div>
							<div>
								<label className='block text-xs text-muted-foreground mb-1'>Make</label>
								<Select
									isMulti
									styles={selectStyles}
									isLoading={dropdownLoading}
									options={makes}
									value={form.make_id}
									onChange={(val) => setForm((p) => ({ ...p, make_id: val || [] }))}
								/>
							</div>
							<div>
								<label className='block text-xs text-muted-foreground mb-1'>
									Model <span className='text-red-500'>*</span>
								</label>
								<Select
									styles={selectStyles}
									isLoading={dropdownLoading}
									options={models}
									value={form.machine_model_id}
									onChange={(val) => setForm((p) => ({ ...p, machine_model_id: val || null }))}
								/>
							</div>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-3 gap-3 mb-3'>
							<div>
								<label className='block text-xs text-muted-foreground mb-1'>
									Item <span className='text-red-500'>*</span>
								</label>
								<Select
									styles={selectStyles}
									isLoading={dropdownLoading}
									options={items}
									value={form.machine_part_id}
									onChange={(val) => setForm((p) => ({ ...p, machine_part_id: val || null }))}
								/>
							</div>
							<div>
								<label className='block text-xs text-muted-foreground mb-1'>
									Brand <span className='text-red-500'>*</span>
								</label>
								<Select
									styles={selectStyles}
									isLoading={dropdownLoading}
									options={brands}
									value={form.brand_id}
									onChange={(val) => setForm((p) => ({ ...p, brand_id: val || null }))}
								/>
							</div>
							<div>
								<label className='block text-xs text-muted-foreground mb-1'>Origin</label>
								<Select
									styles={selectStyles}
									isLoading={dropdownLoading}
									options={origins}
									value={form.origin_id}
									onChange={(val) => setForm((p) => ({ ...p, origin_id: val || null }))}
								/>
							</div>
						</div>

						<div className='mt-4 border-t border-border pt-3'>
							<div className='flex items-center justify-between mb-2'>
								<div className='text-xs font-medium text-foreground'>Dimensions</div>
								<button
									type='button'
									onClick={() =>
										setDimensionRows((prev) => [
											...prev,
											{ id: String(Date.now()), dimension_id: null, value: '' },
										])
									}
									className='h-7 text-xs px-3 rounded-md border border-border hover:bg-muted flex items-center gap-2'>
									<Plus className='w-4 h-4' /> Add
								</button>
							</div>

							<div className='space-y-2'>
								{dimensionRows.map((r, idx) => (
									<div key={r.id} className='grid grid-cols-12 gap-2 items-center'>
										<div className='col-span-6'>
											<Select
												styles={selectStyles}
												isLoading={dropdownLoading}
												options={dimensions}
												value={r.dimension_id}
												onChange={(val) =>
													setDimensionRows((prev) =>
														prev.map((x) => (x.id === r.id ? { ...x, dimension_id: val } : x)),
													)
												}
											/>
										</div>
										<div className='col-span-5'>
											<input
												value={r.value}
												onChange={(e) =>
													setDimensionRows((prev) =>
														prev.map((x) => (x.id === r.id ? { ...x, value: e.target.value } : x)),
													)
												}
												placeholder='Value'
												className='h-9 w-full rounded-md border border-[var(--bs-border-color,#e5e7eb)] px-3 text-sm bg-white'
											/>
										</div>
										<div className='col-span-1 flex justify-end'>
											<button
												type='button'
												disabled={dimensionRows.length === 1}
												onClick={() => setDimensionRows((prev) => prev.filter((x) => x.id !== r.id))}
												className={cn(
													'h-9 w-9 rounded-md border flex items-center justify-center',
													dimensionRows.length === 1
														? 'opacity-40 cursor-not-allowed'
														: 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white',
												)}>
												<X className='w-4 h-4' />
											</button>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className='flex gap-3 mt-4'>
							<button
								type='button'
								disabled={!canSave || loading}
								onClick={handleSave}
								className={cn(
									'flex-1 h-9 rounded-md text-sm font-medium flex items-center justify-center gap-2',
									!canSave || loading
										? 'bg-orange-500/40 text-white cursor-not-allowed'
										: 'bg-orange-500 text-white hover:bg-orange-500/90',
								)}>
								<Plus className='w-4 h-4' />
								{loading ? 'Saving…' : 'Save Part'}
							</button>
							<button
								type='button'
								className='h-9 px-4 rounded-md border border-border hover:bg-muted text-sm'
								onClick={() => {
									setForm((p) => ({ ...p, number1: '', number2: '' }));
									setDimensionRows([{ id: '1', dimension_id: null, value: '' }]);
								}}>
								Reset
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className='w-64 bg-card rounded-lg border border-border p-3'>
				<div className='flex items-start justify-between mb-3'>
					<div>
						<div className='flex items-center gap-1.5'>
							<div className='w-0.5 h-5 bg-orange-500 rounded-full' />
							<span className='text-xs font-medium text-foreground'>Model and its</span>
						</div>
						<span className='text-xs font-medium text-foreground ml-2'>Quantity used</span>
						<p className='text-[10px] text-muted-foreground ml-2'>
							This panel is UI-only for now
						</p>
					</div>
					<button
						type='button'
						className='h-6 text-xs px-2 rounded-md border border-border hover:bg-muted'
						onClick={() => {}}>
						Add More
					</button>
				</div>

				<div className='border-t border-border pt-3'>
					<div className='grid grid-cols-3 gap-1.5 mb-2 text-xs text-muted-foreground'>
						<span>Model</span>
						<span>Qty. Used</span>
						<span>Action</span>
					</div>

					<div className='grid grid-cols-3 gap-1.5 mb-1.5 items-center'>
						<input
							placeholder='Enter model'
							className='h-8 rounded-md border border-[var(--bs-border-color,#e5e7eb)] px-2 text-xs bg-white'
						/>
						<input
							type='number'
							placeholder='0'
							className='h-8 rounded-md border border-[var(--bs-border-color,#e5e7eb)] px-2 text-xs bg-white'
						/>
						<button
							type='button'
							className='h-8 w-8 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center'>
							<X className='w-4 h-4' />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

