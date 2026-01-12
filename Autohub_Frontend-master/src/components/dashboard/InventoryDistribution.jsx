import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function InventoryDistribution({
	title = 'Inventory Distribution',
	subtitle = 'Items by category',
	manageLabel = 'Manage Categories',
	manageTo,
	items = [],
}) {
	// items: [{ label, value, percent, colorClass, to }]
	const maxValue = Math.max(...items.map((i) => Number(i.value || 0)), 1);

	return (
		<div className='bg-card rounded-xl p-6 border border-border shadow-sm'>
			<div className='flex items-start justify-between mb-6'>
				<div>
					<h3 className='text-lg font-semibold text-card-foreground'>{title}</h3>
					<p className='text-muted-foreground text-sm'>{subtitle}</p>
				</div>
				{manageTo ? (
					<Link
						to={manageTo}
						className='text-primary text-sm font-medium hover:underline flex items-center gap-1 text-decoration-none'>
						{manageLabel}
						<ChevronRight className='w-4 h-4' />
					</Link>
				) : null}
			</div>

			<div className='space-y-4'>
				{items.map((item) => {
					const widthPct =
						typeof item.percent === 'number'
							? Math.max(item.percent, 2)
							: Math.max((Number(item.value || 0) / maxValue) * 100, 2);

					return (
						<Link
							key={item.key || item.label}
							to={item.to || '#'}
							className='space-y-2 w-full text-left group text-decoration-none block'>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-card-foreground group-hover:text-primary transition-colors'>
									{item.label}
								</span>
								<span className='text-sm font-medium text-card-foreground'>{item.value}</span>
							</div>
							<div className='h-2 bg-muted rounded-full overflow-hidden'>
								<div
									className={cn('h-full rounded-full transition-all duration-500', item.colorClass || 'bg-primary')}
									style={{ width: `${widthPct}%` }}
								/>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
