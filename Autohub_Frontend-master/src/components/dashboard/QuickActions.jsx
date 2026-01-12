import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

function QuickActionItem({ icon, iconBgColor, title, description, badge, to }) {
	return (
		<Link
			to={to}
			className='flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all duration-200 w-full group text-decoration-none'>
			<div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', iconBgColor)}>
				{icon}
			</div>
			<div className='flex-1 text-left'>
				<div className='flex items-center gap-2'>
					<span className='font-medium text-card-foreground'>{title}</span>
					{badge ? (
						<span className='px-2 py-0.5 bg-success text-success-foreground text-xs font-medium rounded'>
							{badge}
						</span>
					) : null}
				</div>
				<span className='text-sm text-muted-foreground'>{description}</span>
			</div>
			<ChevronRight className='w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors' />
		</Link>
	);
}

export default function QuickActions({ actions = [] }) {
	return (
		<div className='bg-card rounded-xl p-6 border border-border shadow-sm'>
			<div className='mb-4'>
				<h3 className='text-lg font-semibold text-card-foreground'>Quick Actions</h3>
				<p className='text-muted-foreground text-sm'>Frequently used shortcuts</p>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
				{actions.map((action) => (
					<QuickActionItem key={action.key || action.title} {...action} />
				))}
			</div>
		</div>
	);
}


