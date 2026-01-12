// import React, { lazy } from 'react';
// import { Route, Routes } from 'react-router-dom';
// import {
// 	contents,
// 	dashbord,
// 	accounts,
// 	itemsManagementR,
// 	// kitManagementR,
// 	inventoryMangementR,
// 	suppliersMangementR,
// 	reportMangementR,
// 	storesMangementR,
// 	salesManagementR,
// 	transferManagementR,
// 	customersMangementR,
// 	expenseMangementR,
// 	systemUsersR,
// } from '../../routes/contentRoutes';

// const PAGE_404 = lazy(() => import('../../pages/presentation/auth/Page404'));
// const ContentRoutes = () => {
// 	return (
// 		<Routes>
// 			{dashbord.map((page) => (
// 				// eslint-disable-next-line react/jsx-props-no-spreading
// 				<Route key={page.path} {...page} />
// 			))}

// 			{contents.map((page) => (
// 				// eslint-disable-next-line react/jsx-props-no-spreading
// 				<Route key={page.path} {...page} />
// 			))}
// 			{accounts.map((page) => (
// 				// eslint-disable-next-line react/jsx-props-no-spreading
// 				<Route key={page.path} {...page} />
// 			))}
// 			{itemsManagementR.map((page) => (
// 				// eslint-disable-next-line react/jsx-props-no-spreading
// 				<Route key={page.path} {...page} />
// 			))}
// 			{/* {kitManagementR.map((page) => (
// 				// eslint-disable-next-line react/jsx-props-no-spreading
// 				<Route key={page.path} {...page} />
// 			))} */}
// 			{inventoryMangementR.map((page) => (
// 				// eslint-disable-next-line react/jsx-props-no-spreading
// 				<Route key={page.path} {...page} />
// 			))}
// 			{salesManagementR.map((page) => (
// 				// eslint-disable-next-line react/jsx-props-no-spreading
// 				<Route key={page.path} {...page} />
// 			))}
// 			{transferManagementR.map((page) => (
// 				// eslint-disable-next-line react/jsx-props-no-spreading
// 				<Route key={page.path} {...page} />
// 			))}
// 			{suppliersMangementR.map((page) => (
// 				// eslint-disable-next-line react/jsx-props-no-spreading
// 				<Route key={page.path} {...page} />
// 			))}
// 			{customersMangementR.map((page) => (
// 				// eslint-disable-next-line react/jsx-props-no-spreading
// 				<Route key={page.path} {...page} />
// 			))}
// 			{storesMangementR.map((page) => (
// 				// eslint-disable-next-line react/jsx-props-no-spreading
// 				<Route key={page.path} {...page} />
// 			))}
// 			{reportMangementR.map((page) => (
// 				// eslint-disable-next-line react/jsx-props-no-spreading
// 				<Route key={page.path} {...page} />
// 			))}
// 			{expenseMangementR.map((page) => (
// 				// eslint-disable-next-line react/jsx-props-no-spreading
// 				<Route key={page.path} {...page} />
// 			))}
// 			{systemUsersR.map((page) => (
// 				// eslint-disable-next-line react/jsx-props-no-spreading
// 				<Route key={page.path} {...page} />
// 			))}

// 			<Route path='*' element={<PAGE_404 />} />
// 		</Routes>
// 	);
// };

// export default ContentRoutes;

import React, { lazy } from 'react';
import Cookies from 'js-cookie';

import { Route, Routes } from 'react-router-dom';
import {
	contents,
	dashbord,
	accounts,
	itemsManagementR,
	// kitManagementR,
	inventoryMangementR,
	suppliersMangementR,
	reportMangementR,
	storesMangementR,
	salesManagementR,
	transferManagementR,
	customersMangementR,
	employeesMangementR,
	expenseMangementR,
	systemUsersR,
} from '../../routes/contentRoutes';

const PAGE_404 = lazy(() => import('../../pages/presentation/auth/Page404'));
const ContentRoutes = () => {
	const role = Cookies.get('role_id1');
	return (
		<Routes>
			{role === '2' && (
				<>
					{contents.map((page) => (
						// eslint-disable-next-line react/jsx-props-no-spreading
						<Route key={page.path} {...page} />
					))}
					{itemsManagementR.map((page) => (
						// eslint-disable-next-line react/jsx-props-no-spreading
						<Route key={page.path} {...page} />
					))}
					{transferManagementR.map((page) => (
						// eslint-disable-next-line react/jsx-props-no-spreading
						<Route key={page.path} {...page} />
					))}
					{suppliersMangementR.map((page) => (
						// eslint-disable-next-line react/jsx-props-no-spreading
						<Route key={page.path} {...page} />
					))}
					{customersMangementR.map((page) => (
						// eslint-disable-next-line react/jsx-props-no-spreading
						<Route key={page.path} {...page} />
					))}
					{employeesMangementR.map((page) => (
						// eslint-disable-next-line react/jsx-props-no-spreading
						<Route key={page.path} {...page} />
					))}
					{storesMangementR.map((page) => (
						// eslint-disable-next-line react/jsx-props-no-spreading
						<Route key={page.path} {...page} />
					))}
					{reportMangementR.map((page) => (
						// eslint-disable-next-line react/jsx-props-no-spreading
						<Route key={page.path} {...page} />
					))}
					{expenseMangementR.map((page) => (
						// eslint-disable-next-line react/jsx-props-no-spreading
						<Route key={page.path} {...page} />
					))}
					{systemUsersR.map((page) => (
						// eslint-disable-next-line react/jsx-props-no-spreading
						<Route key={page.path} {...page} />
					))}
				</>
			)}

			{dashbord.map((page) => (
				// eslint-disable-next-line react/jsx-props-no-spreading
				<Route key={page.path} {...page} />
			))}

			{accounts.map((page) => (
				// eslint-disable-next-line react/jsx-props-no-spreading
				<Route key={page.path} {...page} />
			))}

			{/* {kitManagementR.map((page) => (
				// eslint-disable-next-line react/jsx-props-no-spreading
				<Route key={page.path} {...page} />
			))} */}
			{inventoryMangementR.map((page) => (
				// eslint-disable-next-line react/jsx-props-no-spreading
				<Route key={page.path} {...page} />
			))}
			{salesManagementR.map((page) => (
				// eslint-disable-next-line react/jsx-props-no-spreading
				<Route key={page.path} {...page} />
			))}

			<Route path='*' element={<PAGE_404 />} />
		</Routes>
	);
};

export default ContentRoutes;
