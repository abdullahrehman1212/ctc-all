import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

import {
	Home,
	Package,
	Boxes,
	DollarSign,
	Tag,
	BarChart3,
	Settings2,
	Receipt,
	BookOpen,
	Users,
	Building2,
} from 'lucide-react';

function SidebarItem({ Icon, label, active, onClick }) {
	return (
		<button
			type='button'
			onClick={onClick}
			title={label}
			aria-label={label}
			className={cn(
				'w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-150',
				active
					? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
					: 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
			)}>
			<Icon className='w-4 h-4' />
		</button>
	);
}

function toAbsPath(path) {
	if (!path) return '/';
	return path.startsWith('/') ? path : `/${path}`;
}

export default function Sidebar({ items }) {
	const navigate = useNavigate();
	const location = useLocation();
	const currentPath = location.pathname;

	const menuItems = useMemo(() => {
		// items is expected to already be filtered by permissions
		return Array.isArray(items) ? items : [];
	}, [items]);

	return (
		<aside className='w-16 bg-card border-r border-border flex flex-col items-center py-4 h-screen fixed left-0 top-0 z-50'>
			<div className='w-10 h-10 rounded-xl bg-primary flex items-center justify-center mb-4 shadow-md shadow-primary/20'>
				<Package className='w-5 h-5 text-primary-foreground' />
			</div>

			<nav className='flex-1 flex flex-col items-center justify-center gap-0.5'>
				{menuItems.map((item) => {
					const abs = toAbsPath(item.path);
					const isActive = currentPath === abs || (item.activeStartsWith && currentPath.startsWith(abs));
					return (
						<div key={item.key} className='h-11 w-16 flex items-center justify-center'>
							<SidebarItem
								Icon={item.Icon}
								label={item.label}
								active={isActive}
								onClick={() => navigate(abs)}
							/>
						</div>
					);
				})}
			</nav>
		</aside>
	);
}

// Icon map helpers for Aside
export const SidebarIcons = {
	Dashboard: Home,
	Parts: Package,
	Inventory: Boxes,
	Sales: DollarSign,
	Suppliers: Building2,
	Customers: Users,
	Employees: Users,
	Reports: BarChart3,
	Expense: Receipt,
	Accounts: BookOpen,
	Manage: Settings2,
	Category: Tag,
};

