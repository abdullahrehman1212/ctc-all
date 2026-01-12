import React from 'react';
import { cn } from '@/lib/utils';

export default function StatCard({
	icon,
	value,
	label,
	change,
	progressClass = 'bg-primary',
	progressBgClass = 'bg-primary/20',
	iconBgColor = 'bg-primary/10',
}) {
	return (
		<div className='bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-200'>
			<div className='flex items-center justify-between mb-4'>
				<div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', iconBgColor)}>
					{icon}
				</div>
			</div>

			<div>
				<p className='text-3xl font-bold text-card-foreground mb-1'>{value ?? 0}</p>
				<p className='text-muted-foreground text-sm font-medium'>{label}</p>
			</div>
		</div>
	);
}
