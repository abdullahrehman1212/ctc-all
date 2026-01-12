import React, { useMemo } from 'react';
import Chart from '@/components/extras/Chart';

export default function OrderStatusChart({
	title = 'Order Status',
	subtitle = 'Current purchase orders',
	labels = ['Draft', 'Pending', 'Approved', 'Received'],
	series = [0, 0, 0, 0],
	total,
}) {
	const computedTotal = useMemo(() => {
		if (typeof total === 'number') return total;
		return (series || []).reduce((a, v) => a + Number(v || 0), 0);
	}, [series, total]);

	const options = useMemo(
		() => ({
			chart: { type: 'donut' },
			labels,
			legend: { position: 'bottom' },
			colors: [
				'hsl(215, 16%, 75%)', // Draft - Gray
				'hsl(var(--chart-yellow))', // Pending - Yellow
				'hsl(var(--chart-orange))', // Approved - Orange
				'hsl(var(--chart-green))', // Received - Green
			],
			plotOptions: {
				pie: {
					donut: { size: '70%' },
				},
			},
			dataLabels: { enabled: false },
			stroke: { width: 0 },
		}),
		[labels],
	);

	return (
		<div className='bg-card rounded-xl p-6 border border-border shadow-sm'>
			<div className='mb-4'>
				<h3 className='text-lg font-semibold text-card-foreground'>{title}</h3>
				<p className='text-muted-foreground text-sm'>{subtitle}</p>
			</div>

			<div className='relative h-48 flex items-center justify-center'>
				<div className='w-full'>
					<Chart series={series} options={options} type='donut' height={190} />
				</div>
				<div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none'>
					<span className='text-3xl font-bold text-card-foreground'>{computedTotal}</span>
					<span className='text-muted-foreground text-sm'>Loading...</span>
				</div>
			</div>

			<div className='grid grid-cols-2 gap-3 mt-4'>
				{labels.map((name, idx) => (
					<div key={name} className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<div
								className='w-2.5 h-2.5 rounded-full'
								style={{ backgroundColor: options.colors[idx] }}
							/>
							<span className='text-sm text-muted-foreground'>{name}</span>
						</div>
						<span className='text-sm font-medium text-card-foreground'>{series?.[idx] ?? 0}</span>
					</div>
				))}
			</div>
		</div>
	);
}
