import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

function normalizeRows(payload) {
	// payload may be paginator object or array
	if (!payload) return [];
	if (Array.isArray(payload)) return payload;
	if (Array.isArray(payload.data)) return payload.data;
	return [];
}

export default function PartsListModern({ tableData, onRefresh }) {
	const [tab, setTab] = useState('parts');
	const [query, setQuery] = useState('');

	const rows = useMemo(() => normalizeRows(tableData), [tableData]);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return rows;
		return rows.filter((r) => {
			const a =
				r?.machine_part_oem_part?.oem_part_number?.number2 ||
				r?.machine_part_oem_part?.oem_part_number?.number1 ||
				'';
			const b = r?.brand?.name || '';
			return String(a).toLowerCase().includes(q) || String(b).toLowerCase().includes(q);
		});
	}, [query, rows]);

	return (
		<div className='bg-card rounded-lg border border-border flex flex-col h-full'>
			<div className='flex border-b border-border'>
				<button
					type='button'
					onClick={() => setTab('parts')}
					className={cn(
						'flex-1 py-2.5 text-xs font-medium transition-all relative text-center',
						tab === 'parts' ? 'text-orange-500' : 'text-muted-foreground hover:text-foreground',
					)}>
					Parts List
					{tab === 'parts' ? (
						<div className='absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500' />
					) : null}
				</button>
				<button
					type='button'
					onClick={() => setTab('kits')}
					className={cn(
						'flex-1 py-2.5 text-xs font-medium transition-all relative text-center',
						tab === 'kits' ? 'text-orange-500' : 'text-muted-foreground hover:text-foreground',
					)}>
					Kits List
					{tab === 'kits' ? (
						<div className='absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500' />
					) : null}
				</button>
			</div>

			{tab === 'parts' ? (
				<>
					<div className='p-3 border-b border-border'>
						<div className='flex items-start justify-between'>
							<div className='flex items-center gap-2'>
								<div className='w-0.5 h-7 bg-orange-500 rounded-full' />
								<div>
									<h2 className='text-sm font-semibold text-foreground'>Parts List</h2>
									<p className='text-muted-foreground text-xs'>Browse and search inventory parts</p>
								</div>
							</div>
							<input
								placeholder='Search parts...'
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								className='w-44 h-8 text-xs rounded-md border border-[var(--bs-border-color,#e5e7eb)] px-3 bg-white'
							/>
						</div>
					</div>

					<div className='flex-1 overflow-auto'>
						<table className='w-full text-sm'>
							<thead>
								<tr className='bg-muted/30'>
									<th className='text-left px-4 py-2 text-xs font-semibold'>Master Part #</th>
									<th className='text-left px-4 py-2 text-xs font-semibold'>Brand</th>
									<th className='text-left px-4 py-2 text-xs font-semibold'>UOM</th>
									<th className='text-right px-4 py-2 text-xs font-semibold'>Cost</th>
									<th className='text-right px-4 py-2 text-xs font-semibold'>Price</th>
									<th className='text-right px-4 py-2 text-xs font-semibold'>Stock</th>
								</tr>
							</thead>
							<tbody>
								{filtered.map((r, idx) => {
									const master =
										r?.machine_part_oem_part?.oem_part_number?.number2 ||
										r?.machine_part_oem_part?.oem_part_number?.number1 ||
										'-';
									const brand = r?.brand?.name || '-';
									const uom = r?.machine_part_oem_part?.machine_part?.unit?.name || '-';
									const cost = r?.cost ?? '-';
									const price = r?.price ?? '-';
									const stock = r?.stock ?? 0;
									return (
										<tr key={r?.id ?? idx} className='border-b border-border hover:bg-muted/30'>
											<td className='px-4 py-2 text-xs font-medium text-foreground'>{master}</td>
											<td className='px-4 py-2 text-xs text-muted-foreground'>{brand}</td>
											<td className='px-4 py-2 text-xs text-muted-foreground'>{uom}</td>
											<td className='px-4 py-2 text-xs text-right text-orange-500 font-medium'>
												{typeof cost === 'number' ? `Rs ${cost.toFixed(2)}` : cost}
											</td>
											<td className='px-4 py-2 text-xs text-right text-orange-500 font-medium'>
												{typeof price === 'number' ? `Rs ${price.toFixed(2)}` : price}
											</td>
											<td className='px-4 py-2 text-xs text-right text-foreground'>{stock}</td>
										</tr>
									);
								})}
								{filtered.length === 0 ? (
									<tr>
										<td colSpan={6} className='px-4 py-8 text-center text-xs text-muted-foreground'>
											No parts found
										</td>
									</tr>
								) : null}
							</tbody>
						</table>
					</div>
				</>
			) : (
				<div className='p-6 text-sm text-muted-foreground'>
					Kits UI will be added here next (no backend changes).
				</div>
			)}
		</div>
	);
}

