import React from 'react';
import { cn } from '@/lib/utils';
import Chart from '@/components/extras/Chart';

export default function InventoryChart({
	title = 'Inventory Overview',
	subtitle = 'Monthly inventory movement',
	tabs = ['Week', 'Month', 'Year'],
	activeTab = 'Month',
	onTabChange,
	loading = false,
	chart,
}) {
	return (
		<div className='bg-card rounded-xl p-6 border border-border shadow-sm'>
			<div className='flex items-start justify-between mb-6'>
				<div>
					<h3 className='text-lg font-semibold text-card-foreground'>{title}</h3>
					<p className='text-muted-foreground text-sm'>{subtitle}</p>
				</div>

				<div className='flex bg-muted rounded-lg p-1 gap-1'>
					{tabs.map((t) => (
						<button
							key={t}
							type='button'
							onClick={() => onTabChange?.(t)}
							className={cn(
								'px-4 py-1.5 text-sm font-medium rounded-md transition-all',
								activeTab === t
									? 'bg-primary text-primary-foreground shadow-sm'
									: 'text-muted-foreground hover:text-foreground hover:bg-secondary',
							)}>
							{t}
						</button>
					))}
				</div>
			</div>

			<div className='h-64'>
				{loading ? (
					<div className='h-full w-full flex items-center justify-center text-sm text-muted-foreground'>
						Loading chart...
					</div>
				) : (
					<Chart
						series={chart?.series}
						options={chart?.options}
						type={chart?.type || 'line'}
						height={chart?.height || 260}
					/>
				)}
			</div>

			<div className='flex items-center justify-center gap-2 mt-4'>
				<div className='w-3 h-3 rounded-full bg-chart-orange' />
				<span className='text-sm text-muted-foreground'>Parts Added</span>
			</div>
		</div>
	);
}
