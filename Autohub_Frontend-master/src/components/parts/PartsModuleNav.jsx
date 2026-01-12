import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Layers, List, SlidersHorizontal, Boxes } from 'lucide-react';
import { itemsManagementModule } from '@/menu';

const itemPartsBase = itemsManagementModule.itemsManagement.subMenu.itemParts.path;

const tabs = [
	{
		key: 'parts-entry',
		label: 'Parts Entry',
		icon: Layers,
		path: itemPartsBase,
		primary: true,
	},
	{
		key: 'items',
		label: 'Items',
		icon: List,
		// items list inside Parts module (matches screenshot)
		path: `${itemPartsBase}/items`,
	},
	{
		key: 'attributes',
		label: 'Attributes',
		icon: SlidersHorizontal,
		// attributes page inside Parts module (matches screenshot)
		path: `${itemPartsBase}/attributes`,
	},
	{
		key: 'models',
		label: 'Models',
		icon: Boxes,
		path: `${itemPartsBase}/models`,
	},
];

export default function PartsModuleNav() {
	const location = useLocation();
	const navigate = useNavigate();

	return (
		<div className='bg-card border-b border-border'>
			<div className='px-6 py-3'>
				<div className='grid grid-cols-1 md:grid-cols-3 items-center gap-3'>
					{/* Left: Brand */}
					<div className='flex items-center gap-2 md:justify-start justify-center'>
					<div className='w-8 h-8 rounded-lg bg-primary flex items-center justify-center'>
						<Layers className='w-4 h-4 text-primary-foreground' />
					</div>
					<span className='font-semibold text-foreground'>InventoryERP</span>
				</div>

					{/* Center: Menu */}
					<div className='flex items-center justify-center'>
						<div className='flex items-center gap-3 overflow-x-auto'>
					{tabs.map((t) => {
						const active = location.pathname === `/${t.path}` || location.pathname.endsWith(t.path);
						const Icon = t.icon;
						return (
							<button
								key={t.key}
								type='button'
								onClick={() => navigate(`/${t.path}`)}
								className={cn(
									'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
									t.primary
										? 'bg-orange-500 text-white hover:bg-orange-500/90'
										: active
											? 'text-primary'
											: 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
								)}>
								<Icon className='w-4 h-4' />
								<span className='hidden md:inline'>{t.label}</span>
							</button>
						);
					})}
						</div>
					</div>

					{/* Right: Spacer (keeps center truly centered on desktop) */}
					<div className='hidden md:block' />
				</div>
			</div>
		</div>
	);
}

