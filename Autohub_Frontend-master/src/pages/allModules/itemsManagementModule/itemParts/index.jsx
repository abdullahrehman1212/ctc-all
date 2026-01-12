import React, { useEffect, useState } from 'react';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Page from '../../../../layout/Page/Page';
import apiClient from '../../../../baseURL/apiClient';

import PartsModuleNav from '../../../../components/parts/PartsModuleNav';
import PartEntryFormModern from '../../../../components/parts/PartEntryFormModern';
import PartsListModern from '../../../../components/parts/PartsListModern';

const PartsManagement = () => {
	const [tableData, setTableData] = useState(null);
	const [loading, setLoading] = useState(true);

	const refresh = () => {
		setLoading(true);
		apiClient
			.get('/getModelItemOem?records=20&pageNo=1&colName=id&sort=desc')
			.then((res) => setTableData(res.data?.data))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		refresh();
	}, []);

	return (
		<PageWrapper title='Parts Management'>
			<PartsModuleNav />
			<Page container='fluid'>
				<div className='flex border-b border-border mb-3'>
					<div className='px-4 py-2 text-xs font-medium text-orange-500 border-b-2 border-orange-500'>
						Part Entry
					</div>
					<div className='px-4 py-2 text-xs font-medium text-muted-foreground'>Create Kit</div>
				</div>

				<div className='grid grid-cols-1 xl:grid-cols-12 gap-4'>
					<div className='xl:col-span-7'>
						<PartEntryFormModern onSaved={refresh} />
					</div>
					<div className='xl:col-span-5'>
						{loading ? (
							<div className='p-6 text-sm text-muted-foreground'>Loading parts...</div>
						) : (
							<PartsListModern tableData={tableData} onRefresh={refresh} />
						)}
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default PartsManagement;
