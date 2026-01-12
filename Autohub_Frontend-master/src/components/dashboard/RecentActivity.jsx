import React from 'react';
import { Link } from 'react-router-dom';

export default function RecentActivity({ title = 'Recent Activity', subtitle = 'Latest updates', viewAllTo, emptyText = 'No recent activity' }) {
	return (
		<div className='bg-card rounded-xl p-6 border border-border shadow-sm h-fit'>
			<div className='flex items-center justify-between mb-4'>
				<div>
					<h3 className='text-lg font-semibold text-card-foreground'>{title}</h3>
					<p className='text-muted-foreground text-sm'>{subtitle}</p>
				</div>
				{viewAllTo ? (
					<Link to={viewAllTo} className='text-primary text-sm font-medium hover:underline text-decoration-none'>
						View All
					</Link>
				) : null}
			</div>

			<div className='flex items-center justify-center py-8 text-muted-foreground text-sm'>
				{emptyText}
			</div>
		</div>
	);
}
