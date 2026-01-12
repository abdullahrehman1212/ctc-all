import React, { useEffect, useMemo, useState } from 'react';
import { Boxes, Building2, DollarSign, FileText, Package, Plus, Tag, Users, BarChart3 } from 'lucide-react';

import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft } from '../../../layout/SubHeader/SubHeader';
import Page from '../../../layout/Page/Page';

import StatCard from '../../../components/dashboard/StatCard';
import InventoryChart from '../../../components/dashboard/InventoryChart';
import OrderStatusChart from '../../../components/dashboard/OrderStatusChart';
import QuickActions from '../../../components/dashboard/QuickActions';
import RecentActivity from '../../../components/dashboard/RecentActivity';
import InventoryDistribution from '../../../components/dashboard/InventoryDistribution';

import apiClient from '../../../baseURL/apiClient';
import useDarkMode from '../../../hooks/useDarkMode';
import {
	dashboardHome,
	inventoryModule,
	itemsManagementModule,
	reportModule,
	salesModule,
	suppliersModule,
} from '../../../menu';

const OVERVIEW_TABS = {
	WEEK: 'Week',
	MONTH: 'Month',
	YEAR: 'Year',
};

const DashboardHome = () => {
	const { darkModeStatus } = useDarkMode();

	const [dashboardData, setDashboardData] = useState(null);
	const [dashboardLoading, setDashboardLoading] = useState(true);

	const [trailBalanceLoading, setTrailBalanceLoading] = useState(true);
	const [trailBalance, setTrailBalance] = useState(null);

	// Kept for existing behavior (even if not displayed on UI).
	const [, setReceivableTotals] = useState(null);

	const [inventoryStatsLoading, setInventoryStatsLoading] = useState(true);
	const [inventoryStats, setInventoryStats] = useState({
		parts: 0,
		categories: 0,
		activeKits: 0,
		suppliers: 0,
	});

	const [overviewTab, setOverviewTab] = useState(OVERVIEW_TABS.MONTH);

	useEffect(() => {
		const loadDashboard = async () => {
			setDashboardLoading(true);
			try {
				const res = await apiClient.get('/getDashboardData');
				if (res.data?.status === 'ok') setDashboardData(res.data);
			} catch (e) {
				// keep silent (existing code used console logging)
			} finally {
				setDashboardLoading(false);
			}
		};

		const loadTrailBalance = async () => {
			setTrailBalanceLoading(true);
			try {
				const res = await apiClient.get('/getTrailBalanceForDash');
				if (res.data?.status === 'ok') setTrailBalance(res.data);
			} catch (e) {
				// keep silent
			} finally {
				setTrailBalanceLoading(false);
			}
		};

		const loadBookingReportTotals = async () => {
			try {
				const res = await apiClient.get('/getBookingReport');
				if (res.data?.status !== 'ok') return;

				const total = Array.isArray(res.data.data)
					? res.data.data.reduce(
						(a, v) => a + parseFloat(v?.total_payable !== undefined ? v.total_payable : 0),
						0,
					)
					: 0;
				const received = Array.isArray(res.data.data)
					? res.data.data.reduce(
						(a, v) => a + parseFloat(v?.received !== undefined ? v.received : 0),
						0,
					)
					: 0;

				setReceivableTotals({ total, received });
			} catch (e) {
				// keep silent
			}
		};

		const loadInventoryStats = async () => {
			setInventoryStatsLoading(true);
			try {
				const [partsRes, categoriesRes, kitsRes, suppliersRes] = await Promise.all([
					apiClient.get('/getModelItemOem?records=1&pageNo=1&colName=id&sort=desc'),
					apiClient.get('/getCategories?records=1&pageNo=1&colName=id&sort=desc'),
					apiClient.get('/getKits?records=1&pageNo=1&colName=id&sort=desc'),
					apiClient.get('/getSupplierslist?records=1&pageNo=1&colName=id&sort=desc'),
				]);

				setInventoryStats({
					parts: partsRes?.data?.data?.total ?? 0,
					categories: categoriesRes?.data?.categories?.total ?? 0,
					activeKits: kitsRes?.data?.data?.total ?? 0,
					suppliers: suppliersRes?.data?.suppliers?.total ?? 0,
				});
			} catch (e) {
				setInventoryStats({
					parts: 0,
					categories: 0,
					activeKits: 0,
					suppliers: 0,
				});
			} finally {
				setInventoryStatsLoading(false);
			}
		};

		loadDashboard();
		loadTrailBalance();
		loadBookingReportTotals();
		loadInventoryStats();
	}, []);

	const orderStatus = useMemo(() => {
		const totalPOs = Number(dashboardData?.data?.total_po ?? 0);
		const draft = Number(dashboardData?.data?.pending_po ?? 0);
		const approvedNotReceived = Number(dashboardData?.data?.unreceived_po ?? 0);
		const received = Math.max(0, totalPOs - draft - approvedNotReceived);
		const pending = 0;

		return {
			labels: ['Draft', 'Pending', 'Approved', 'Received'],
			series: [draft, pending, approvedNotReceived, received],
			total: totalPOs,
		};
	}, [dashboardData]);

	const inventoryOverview = useMemo(() => {
		const months = Array.isArray(trailBalance?.months)
			? trailBalance.months.map((m) => m?.Month).filter(Boolean).reverse()
			: [];

		let cr = 0;
		let dr = 0;
		const revenueList = [];

		if (Array.isArray(trailBalance?.Data)) {
			trailBalance.Data.forEach((dataStart) => {
				if (!dataStart) return;
				(dataStart.revenues ?? []).forEach((group) => {
					(group.coa_sub_groups ?? []).forEach((subGroup) => {
						(subGroup.coa_accounts ?? []).forEach((account) => {
							const bal = account?.balance?.balance;
							if (bal === null || bal === undefined) return;
							if (bal > 0) dr += bal;
							else if (bal < 0) cr += bal;
						});
					});
				});
				revenueList.push(Math.abs(cr - dr));
				cr = 0;
				dr = 0;
			});
		}

		const values = revenueList.reverse();

		const slice = (count) => ({
			categories: months.slice(Math.max(0, months.length - count)),
			values: values.slice(Math.max(0, values.length - count)),
		});

		if (overviewTab === OVERVIEW_TABS.WEEK) return slice(4);
		if (overviewTab === OVERVIEW_TABS.MONTH) return slice(6);
		return { categories: months, values };
	}, [overviewTab, trailBalance]);

	const overviewChart = useMemo(() => {
		return {
			series: [
				{
					name: 'Movement',
					data: inventoryOverview.values,
				},
			],
			options: {
				chart: {
					type: 'line',
					height: 300,
					toolbar: { show: false },
				},
				stroke: { curve: 'smooth', width: 3 },
				dataLabels: { enabled: false },
				xaxis: { categories: inventoryOverview.categories },
				grid: {
					borderColor: 'rgba(0,0,0,0.08)',
					strokeDashArray: 4,
				},
				colors: ['hsl(var(--chart-orange))'],
				tooltip: { theme: darkModeStatus ? 'dark' : 'light' },
			},
		};
	}, [darkModeStatus, inventoryOverview.categories, inventoryOverview.values]);

	const distribution = useMemo(() => {
		const total =
			inventoryStats.parts +
			inventoryStats.categories +
			inventoryStats.activeKits +
			inventoryStats.suppliers;

		const pct = (v) => (total > 0 ? Math.round((v / total) * 100) : 0);
		return {
			total,
			parts: { value: inventoryStats.parts, percent: pct(inventoryStats.parts) },
			categories: { value: inventoryStats.categories, percent: pct(inventoryStats.categories) },
			kits: { value: inventoryStats.activeKits, percent: pct(inventoryStats.activeKits) },
			suppliers: { value: inventoryStats.suppliers, percent: pct(inventoryStats.suppliers) },
		};
	}, [inventoryStats]);

	if (dashboardLoading) {
		return <div className='p-6 text-muted-foreground'>Loading...</div>;
	}

	return (
		<PageWrapper title={dashboardHome?.dashboard?.text ?? 'Dashboard'}>
			<SubHeader>
				<SubHeaderLeft>
					<div>
						<div className='text-xl font-bold text-foreground'>Welcome to Inventory Management</div>
						<div className='text-sm text-muted-foreground'>Here&apos;s what&apos;s happening with your inventory today.</div>
					</div>
				</SubHeaderLeft>
			</SubHeader>

			<Page container='fluid' className='bg-white'>
				<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4'>
					<StatCard
						icon={<Package className='w-5 h-5 text-primary' />}
						value={inventoryStatsLoading ? '—' : inventoryStats.parts}
						label='Total Parts'
						iconBgColor='bg-primary/10'
						progressClass='bg-primary'
						progressBgClass='bg-primary/20'
					/>
					<StatCard
						icon={<Tag className='w-5 h-5 text-chart-blue' />}
						value={inventoryStatsLoading ? '—' : inventoryStats.categories}
						label='Categories'
						iconBgColor='bg-chart-blue/10'
						progressClass='bg-chart-blue'
						progressBgClass='bg-chart-blue/20'
					/>
					<StatCard
						icon={<Boxes className='w-5 h-5 text-chart-yellow' />}
						value={inventoryStatsLoading ? '—' : inventoryStats.activeKits}
						label='Active Kits'
						iconBgColor='bg-chart-yellow/10'
						progressClass='bg-chart-yellow'
						progressBgClass='bg-chart-yellow/20'
					/>
					<StatCard
						icon={<Users className='w-5 h-5 text-chart-green' />}
						value={inventoryStatsLoading ? '—' : inventoryStats.suppliers}
						label='Suppliers'
						iconBgColor='bg-chart-green/10'
						progressClass='bg-chart-green'
						progressBgClass='bg-chart-green/20'
					/>
				</div>

				<div className='grid grid-cols-1 xl:grid-cols-12 gap-4 mt-4'>
					<div className='xl:col-span-8'>
						<InventoryChart
							tabs={Object.values(OVERVIEW_TABS)}
							activeTab={overviewTab}
							onTabChange={setOverviewTab}
							loading={trailBalanceLoading}
							chart={{
								series: overviewChart.series,
								options: overviewChart.options,
								type: 'line',
								height: 260,
							}}
						/>
					</div>

					<div className='xl:col-span-4'>
						<OrderStatusChart labels={orderStatus.labels} series={orderStatus.series} total={orderStatus.total} />
					</div>

					<div className='xl:col-span-8'>
						<QuickActions
							actions={[
								{
									key: 'add-part',
									icon: <Plus className='w-5 h-5 text-primary' />,
									iconBgColor: 'bg-primary/10',
									title: 'Add New Part',
									description: 'Create a new inventory item',
									to: `../${itemsManagementModule.itemsManagement.subMenu.itemParts.path}`,
								},
								{
									key: 'create-po',
									icon: <FileText className='w-5 h-5 text-chart-purple' />,
									iconBgColor: 'bg-chart-purple/10',
									title: 'Create Purchase Order',
									description: 'Start a new procurement',
									badge: 'New',
									to: `../${inventoryModule.inventoryModules.subMenu.purchaseOrder.path}`,
								},
								{
									key: 'kits',
									icon: <Package className='w-5 h-5 text-info' />,
									iconBgColor: 'bg-info/10',
									title: 'Manage Kits',
									description: 'View and edit kit assemblies',
									to: `../${inventoryModule.inventoryModules.path}`,
								},
								{
									key: 'sales',
									icon: <DollarSign className='w-5 h-5 text-success' />,
									iconBgColor: 'bg-success/10',
									title: 'Sales & Invoices',
									description: 'Manage sales transactions',
									to: `../${salesModule.saleModules.subMenu.sales.path}`,
								},
								{
									key: 'suppliers',
									icon: <Building2 className='w-5 h-5 text-muted-foreground' />,
									iconBgColor: 'bg-muted',
									title: 'View Suppliers',
									description: 'Manage vendor relationships',
									to: `../${suppliersModule.suppliersModules.subMenu.manage.path}`,
								},
								{
									key: 'reports',
									icon: <BarChart3 className='w-5 h-5 text-chart-blue' />,
									iconBgColor: 'bg-chart-blue/10',
									title: 'View Reports',
									description: 'Analytics and insights',
									to: `../${reportModule.reportModules.path}`,
								},
							]}
						/>
					</div>

					<div className='xl:col-span-4'>
						<RecentActivity viewAllTo={`../${inventoryModule.inventoryModules.subMenu.history.path}`} />
					</div>

					<div className='xl:col-span-12'>
						<InventoryDistribution
							manageTo={`../${itemsManagementModule.itemsManagement.subMenu.category.path}`}
							items={[
								{
									key: 'parts',
									label: 'Parts',
									value: distribution.parts.value,
									percent: distribution.parts.percent,
									colorClass: 'bg-orange-500',
									to: `../${itemsManagementModule.itemsManagement.subMenu.itemParts.path}`,
								},
								{
									key: 'categories',
									label: 'Categories',
									value: distribution.categories.value,
									percent: distribution.categories.percent,
									colorClass: 'bg-sky-500',
									to: `../${itemsManagementModule.itemsManagement.subMenu.category.path}`,
								},
								{
									key: 'kits',
									label: 'Kits',
									value: distribution.kits.value,
									percent: distribution.kits.percent,
									colorClass: 'bg-amber-500',
									to: `../${inventoryModule.inventoryModules.path}`,
								},
								{
									key: 'suppliers',
									label: 'Suppliers',
									value: distribution.suppliers.value,
									percent: distribution.suppliers.percent,
									colorClass: 'bg-emerald-500',
									to: `../${suppliersModule.suppliersModules.subMenu.manage.path}`,
								},
							]}
						/>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default DashboardHome;
