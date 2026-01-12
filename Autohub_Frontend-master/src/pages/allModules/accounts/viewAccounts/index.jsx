// // eslint-disable-next-line eslint-comments/disable-enable-pair
// /* eslint-disable no-console */
// // eslint-disable-next-line eslint-comments/disable-enable-pair
// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from 'react';

// import moment from 'moment';
// import classNames from 'classnames';
// import SubHeader, { SubHeaderLeft } from '../../../../layout/SubHeader/SubHeader';
// import Breadcrumb from '../../../../components/bootstrap/Breadcrumb';
// import Page from '../../../../layout/Page/Page';
// import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
// // import AddCoeSubGroup from './modals/AddCoeSubGroup';
// // import AddAccount from './modals/AddAccount';

// import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
// import Card, {
// 	CardActions,
// 	CardBody,
// 	CardCodeView,
// 	CardFooter,
// 	CardFooterLeft,
// 	CardFooterRight,
// 	CardHeader,
// 	CardLabel,
// 	CardSubTitle,
// 	CardTabItem,
// 	CardTitle,
// } from '../../../../components/bootstrap/Card';
// import Dropdown, {
// 	DropdownItem,
// 	DropdownMenu,
// 	DropdownToggle,
// } from '../../../../components/bootstrap/Dropdown';
// // ** apiClient Imports

// import apiClient from '../../../../baseURL/apiClient';
// import baseURL from '../../../../baseURL/baseURL';
// import useSortableData from '../../../../hooks/useSortableData';
// import PaginationButtons, {
// 	dataPagination,
// } from '../../../../components/defaultPagination/PaginationButtons';
// import useSelectTable from '../../../../hooks/useSelectTable';
// import Checks from '../../../../components/bootstrap/forms/Checks';
// import Icon from '../../../../components/icon/Icon';
// import { componentsMenu } from '../../../../menu';
// // import Heads from './Heads';
// // import SubGroups from './SubGroups';
// // import MainAccounts from './MainAccounts';
// import GeneralJournal from './GeneralJournal';
// import BalanceSheet from './BalanceSheet';
// import TrialBalance from './TrialBalance';
// import IncomeStatement from './IncomeStatement';
// import Ledgers from './Ledgers';

// const TablePage = () => {
// 	const [generalJournalDefault, setGeneralJournalDefault] = useState([]);
// 	const [balanceSheetDefault, setBalanceSheetDefault] = useState([]);
// 	const [trailBalanaceDefault, setTrailBalanaceDefault] = useState([]);

// 	// const [coaAccountsView, setCoaAccountsView] = useState([]);
// 	// const [coaMainAccountsView, setCoaMainAccountsView] = useState([]);
// 	const [refreshTablesAccounts, setRefreshTablesAccounts] = useState(0);
// 	const rereshTablesHandler = (arg) => {
// 		setRefreshTablesAccounts(arg);
// 	};

// 	useEffect(() => {
// 		apiClient
// 			.get(`/getGeneralJournal`)
// 			.then((response) => {
// 				setGeneralJournalDefault(response.data.data);
// 				//   setLoading(false)
// 			})
// 			.catch((err) => console.log(err));
// 		apiClient
// 			.get(`/getBalanceSheet?date=${moment().format('DD/MM/YY')}`)
// 			.then((response) => {
// 				setBalanceSheetDefault(response.data.data);
// 				console.log(':::::', response.data.data);
// 				//   setLoading(false)
// 			})
// 			.catch((err) => console.log(err));
// 		apiClient
// 			.get(
// 				`/getTrailBalance?from=${moment()
// 					.startOf('month')
// 					.format('DD/MM/YY')}&to=${moment().format('DD/MM/YY')}`,
// 			)
// 			.then((response) => {
// 				setTrailBalanaceDefault(response.data.data);
// 				console.log(':::::', response.data.data);
// 				//   setLoading(false)
// 			})
// 			.catch((err) => console.log(err));
// 	}, [refreshTablesAccounts]);

// 	return (
// 		<PageWrapper title='View Accounts'>
// 			<div className='row'>
// 				<div className='col-12'>
// 					{/* <div className='col-12 mt-5 mb-3'>
// 							<h3 id='card-hasTab' className='scroll-margin'>
// 								Manage Accounts subGroups
// 							</h3>
// 						</div> */}

// 					<Card stretch>
// 						{/* <CardHeader>
// 								<CardLabel icon='ViewColumn'>
// 									<CardTitle>Manage Accounts/ subGroups</CardTitle>
// 									<CardSubTitle>Card</CardSubTitle>
// 								</CardLabel>
// 								<CardActions>
// 										<CommonStoryBtn to='/story/components-card-props-hastab--default' />
// 									</CardActions>
// 							</CardHeader> */}

// 						<Card hasTab tabButtonColor='info'>
// 							<CardTabItem
// 								id='tab-item-1'
// 								title='Genaral Journal'
// 								icon='Architecture'>
// 								<Card shadow='none' className='border-0'>
// 									<GeneralJournal generalJournalDefault={generalJournalDefault} />

// 									{/* <CardFooter className='px-0 pb-0'>
// 										<CardFooterLeft>
// 											<Button color='info' isOutline icon='DocumentScanner'>
// 												Action
// 											</Button>
// 										</CardFooterLeft>
// 										<CardFooterRight>
// 											<Button color='info' icon='CleaningServices'>
// 												Other Action
// 											</Button>
// 										</CardFooterRight>
// 									</CardFooter> */}
// 								</Card>
// 							</CardTabItem>

// 							<CardTabItem id='tab-item-2' title='Balance Sheet' icon='Architecture'>
// 								<Card shadow='none' className='border-0'>
// 									<BalanceSheet balanceSheetDefault={balanceSheetDefault} />
// 									{/* <CardFooter className='px-0 pb-0'>
// 										<CardFooterLeft>
// 											<Button color='info' isOutline icon='DocumentScanner'>
// 												Action
// 											</Button>
// 										</CardFooterLeft>
// 										<CardFooterRight>
// 											<Button color='info' icon='CleaningServices'>
// 												Other Action
// 											</Button>
// 										</CardFooterRight>
// 									</CardFooter> */}
// 								</Card>
// 							</CardTabItem>

// 							<CardTabItem id='tab-item-3' title='Trial Balance' icon='Architecture'>
// 								<Card shadow='none' className='border-0'>
// 									<TrialBalance trailBalanaceDefault={trailBalanaceDefault} />
// 									{/* <CardFooter className='px-0 pb-0'>
// 										<CardFooterLeft>
// 											<Button color='info' isOutline icon='DocumentScanner'>
// 												Action
// 											</Button>
// 										</CardFooterLeft>
// 										<CardFooterRight>
// 											<Button color='info' icon='CleaningServices'>
// 												Other Action
// 											</Button>
// 										</CardFooterRight>
// 									</CardFooter> */}
// 								</Card>
// 							</CardTabItem>
// 							<CardTabItem
// 								id='tab-item-4'
// 								title='Income Statement'
// 								icon='Architecture'>
// 								<Card shadow='none' className='border-0'>
// 									<IncomeStatement
// 										incomeStatementDefault={trailBalanaceDefault}
// 									/>
// 									{/* <CardFooter className='px-0 pb-0'>
// 										<CardFooterLeft>
// 											<Button color='info' isOutline icon='DocumentScanner'>
// 												Action
// 											</Button>
// 										</CardFooterLeft>
// 										<CardFooterRight>
// 											<Button color='info' icon='CleaningServices'>
// 												Other Action
// 											</Button>
// 										</CardFooterRight>
// 									</CardFooter> */}
// 								</Card>
// 							</CardTabItem>
// 							<CardTabItem id='tab-item-5' title='Ledgers' icon='Architecture'>
// 								<Card shadow='none' className='border-0'>
// 									<Ledgers />

// 									{/* <CardFooter className='px-0 pb-0'>
// 										<CardFooterLeft>
// 											<Button color='info' isOutline icon='DocumentScanner'>
// 												Action
// 											</Button>
// 										</CardFooterLeft>
// 										<CardFooterRight>
// 											<Button color='info' icon='CleaningServices'>
// 												Other Action
// 											</Button>
// 										</CardFooterRight>
// 									</CardFooter> */}
// 								</Card>
// 							</CardTabItem>
// 						</Card>

// 						<CardFooter />
// 					</Card>
// 				</div>
// 			</div>
// 		</PageWrapper>
// 	);
// };

// export default TablePage;

// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

import moment from 'moment';

import Cookies from 'js-cookie';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
// import AddCoeSubGroup from './modals/AddCoeSubGroup';
// import AddAccount from './modals/AddAccount';

import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardBody,
	CardCodeView,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTabItem,
	CardTitle,
} from '../../../../components/bootstrap/Card';

import apiClient from '../../../../baseURL/apiClient';

import GeneralJournal from './GeneralJournal';
import BalanceSheet from './BalanceSheet';
import TrialBalance from './TrialBalance';
import IncomeStatement from './IncomeStatement';
import Ledgers from './Ledgers';

const TablePage = () => {
	const role = Cookies.get('role_id1'); // Get the role_id from cookies

	const [generalJournalDefault, setGeneralJournalDefault] = useState([]);
	const [balanceSheetDefault, setBalanceSheetDefault] = useState([]);
	const [trailBalanaceDefault, setTrailBalanaceDefault] = useState([]);
	const [refreshTablesAccounts, setRefreshTablesAccounts] = useState(0);
	const rereshTablesHandler = (arg) => {
		setRefreshTablesAccounts(arg);
	};

	useEffect(() => {
		apiClient
			.get(`/getGeneralJournal`)
			.then((response) => {
				setGeneralJournalDefault(response.data.data);
				//   setLoading(false)
			})
			.catch((err) => console.log(err));
		apiClient
			.get(`/getBalanceSheet?date=${moment().format('DD/MM/YY')}`)
			.then((response) => {
				setBalanceSheetDefault(response.data.data);
				console.log(':::::', response.data.data);
				//   setLoading(false)
			})
			.catch((err) => console.log(err));
		apiClient
			.get(
				`/getTrailBalance?from=${moment()
					.startOf('month')
					.format('DD/MM/YY')}&to=${moment().format('DD/MM/YY')}`,
			)
			.then((response) => {
				setTrailBalanaceDefault(response.data.data);
			})
			.catch((err) => console.log(err));
	}, [refreshTablesAccounts]);

	return (
		<PageWrapper title='View Accounts'>
			<div className='row'>
				<div className='col-12'>
					{/* <Card stretch>
						<Card hasTab tabButtonColor='info'>
							<CardTabItem
								id='tab-item-1'
								title='Genaral Journal'
								icon='Architecture'>
								<Card shadow='none' className='border-0'>
									<GeneralJournal generalJournalDefault={generalJournalDefault} />
								</Card>
							</CardTabItem>

							<CardTabItem id='tab-item-2' title='Balance Sheet' icon='Architecture'>
								<Card shadow='none' className='border-0'>
									<BalanceSheet balanceSheetDefault={balanceSheetDefault} />
								</Card>
							</CardTabItem>

							<CardTabItem id='tab-item-3' title='Trial Balance' icon='Architecture'>
								<Card shadow='none' className='border-0'>
									<TrialBalance trailBalanaceDefault={trailBalanaceDefault} />
								</Card>
							</CardTabItem>
							<CardTabItem
								id='tab-item-4'
								title='Income Statement'
								icon='Architecture'>
								<Card shadow='none' className='border-0'>
									<IncomeStatement
										incomeStatementDefault={trailBalanaceDefault}
									/>
								</Card>
							</CardTabItem>
							<CardTabItem id='tab-item-5' title='Ledgers' icon='Architecture'>
								<Card shadow='none' className='border-0'>
									<Ledgers />
								</Card>
							</CardTabItem>
						</Card>

						<CardFooter />
					</Card> */}

					{role === '2' ? (
						<Card stretch>
							<Card hasTab tabButtonColor='info'>
								<CardTabItem
									id='tab-item-1'
									title='Genaral Journal'
									icon='Architecture'>
									<Card shadow='none' className='border-0'>
										<GeneralJournal
											generalJournalDefault={generalJournalDefault}
										/>
									</Card>
								</CardTabItem>

								<CardTabItem
									id='tab-item-2'
									title='Balance Sheet'
									icon='Architecture'>
									<Card shadow='none' className='border-0'>
										<BalanceSheet balanceSheetDefault={balanceSheetDefault} />
									</Card>
								</CardTabItem>

								<CardTabItem
									id='tab-item-3'
									title='Trial Balance'
									icon='Architecture'>
									<Card shadow='none' className='border-0'>
										<TrialBalance trailBalanaceDefault={trailBalanaceDefault} />
									</Card>
								</CardTabItem>
								<CardTabItem
									id='tab-item-4'
									title='Income Statement'
									icon='Architecture'>
									<Card shadow='none' className='border-0'>
										<IncomeStatement
											incomeStatementDefault={trailBalanaceDefault}
										/>
									</Card>
								</CardTabItem>
								<CardTabItem id='tab-item-5' title='Ledgers' icon='Architecture'>
									<Card shadow='none' className='border-0'>
										<Ledgers />
									</Card>
								</CardTabItem>
							</Card>

							<CardFooter />
						</Card>
					) : (
						<Card stretch>
							<Card hasTab tabButtonColor='info'>
								<CardTabItem id='tab-item-5' title='Ledgers' icon='Architecture'>
									<Card shadow='none' className='border-0'>
										<Ledgers />
									</Card>
								</CardTabItem>
							</Card>

							<CardFooter />
						</Card>
					)}
				</div>
			</div>
		</PageWrapper>
	);
};

export default TablePage;
