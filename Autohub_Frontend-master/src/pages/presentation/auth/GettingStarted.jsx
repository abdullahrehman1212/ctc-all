/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-undef */
// eslint-disable-next-line eslint-comments/no-duplicate-disable
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react/button-has-type */
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import {
	Box, Drawer, IconButton, List, ListItem, Typography,
	Dialog, DialogContent, DialogActions, Button, Radio, RadioGroup,
	FormControlLabel,
} from '@mui/material';


import Logo from '../../../components/logo/logo.png';
import Logo1 from '../../../components/logo/cloud-based-software.png';
import Logo2 from '../../../components/logo/multi-user-mobile-responsive.png';
import Logo3 from '../../../components/logo/easy-item-tracking.png';
import Logo4 from '../../../components/logo/easy-inventory-management.png.png';
import Logo5 from '../../../components/logo/price-history.png';
import Logo6 from '../../../components/logo/easy-return.png';

import './GettingStarted.css'; // Make sure to create and include this CSS file
import baseURL from '../../../baseURL/baseURL';


const DashedLineSvg = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="80%"
			height="21"
			fill="none"
			viewBox="0 0 592 21"
			style={{ marginTop: 30 }}
		>
			<path
				stroke="#0B0A0A"
				strokeDasharray="40"
				strokeLinecap="round"
				strokeWidth="20"
				d="M10.908 10.047h570.125"
			/>
		</svg>
	);
}

const GetingStarted = () => {
	const navigate = useNavigate();
	const [showPackages, setShowPackages] = useState(false);
	const [showFeatures, setShowFeatures] = useState(false);
	const [about, setAbout] = useState(false);
	const [contact, setContact] = useState(false);
	const [expanded, setExpanded] = useState({
		cloudSoftware: false,
		multiUser: false,
		easyTracking: false,
		inventoryManagement: false,
		priceHistory: false,
		easyReturn: false,
	});
	const [packages, setPackages] = useState([]);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [selectedPackage, setSelectedPackage] = useState(null);
	const [planType, setPlanType] = useState("monthly");
	const toggleDrawer = (open) => () => {
		setIsDrawerOpen(open);
	};

	const handleSignup = () => {
		localStorage.setItem('packageId1', 1);
		localStorage.setItem('newUser1', 1);
		localStorage.setItem('packageType','monthly');
		navigate("/sparepart360/auth-pages/register");
	};
	const handlePackage = (id) => {
		setSelectedPackage(id);
		setOpenModal(true);
	};

	const handleClose = () => {
		setOpenModal(false);
		setPlanType("monthly");
	};
	const getModalData = (packageId) => {

		const packageInfo = packages && packages[packageId];
		const defaultPrices = [5000, 8000, 10000];
		const planNames = ["Basic Plan", "Silver Plan", "Gold Plan"];

		const discount = packageInfo?.discount || 10;
		const price = packageInfo?.price || defaultPrices[packageId - 1];

		const monthlyPrice = price;
		const yearlyPrice = price * 12;
		const discountedYearlyPrice = yearlyPrice - (yearlyPrice * (discount / 100));
		const savings = yearlyPrice - discountedYearlyPrice;
		return {
			name: planNames[packageId - 1],
			monthlyPrice,
			yearlyPrice: discountedYearlyPrice,
			discount,
			savings,
		};
	};


	const handleConfirmPurchase = () => {
		if (selectedPackage !== null) {

			localStorage.setItem('packageId1', selectedPackage);
			localStorage.setItem('newUser1', 1);
			localStorage.setItem('packageType', planType);
			navigate("/sparepart360/auth-pages/register", { replace: true });
		}
	};
	const handleShowPackages = () => {
		setShowPackages(true);
		setShowFeatures(false);
		setAbout(false);
		setContact(false);
		setIsDrawerOpen(false);
	};

	const handleShowFeatures = () => {
		setShowPackages(false);
		setContact(false);
		setAbout(false);
		setShowFeatures(true);
		setIsDrawerOpen(false);
	};
	// const handleShowAbout = () => {
	// 	setShowPackages(false);
	// 	setContact(false);
	// 	setAbout(true);
	// 	setShowFeatures(false);
	// };
	// const handleShowContact = () => {
	// 	setShowPackages(false);
	// 	setContact(true);
	// 	setAbout(false);
	// 	setShowFeatures(false);
	// };

	const handleHome = () => {
		setShowPackages(false);
		setContact(false);
		setAbout(false);
		setShowFeatures(false);
	};







	const toggleText = (key) => {
		setExpanded((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	useEffect(() => {
		fetch(`${baseURL}/allPackages`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => response.json())
			.then((data) => {
				setPackages(data.packages);
			})
			.catch((error) => console.error('Error fetching packages:', error));
	}, [showPackages]);




	return (
		<div className='container-fluid min-vh-100 d-flex flex-column justify-content-between text-light  p-0'>
			<header className='d-flex justify-content-between align-items-center bg-dark p-2'>
				<div className='d-flex align-items-center'>
					<a href='' onClick={handleHome}>
						<img src={Logo} alt='Logo' height={40} style={{ marginLeft: '5px' }} />
					</a>
				</div>

				<IconButton
					edge="end"
					color="inherit"
					aria-label="menu"
					sx={{ display: { xs: 'flex', md: 'none' }, marginRight: '1px' }}
					onClick={toggleDrawer(true)}
				>
					<MenuIcon />
				</IconButton>




				<nav style={{ fontSize: '22px' }} className='d-none d-md-flex'>
					<a href='#' className='btn ms-3 text-white hover-border' onClick={handleShowFeatures}>
						Features
					</a>
					<a href='#' className='btn ms-3 text-white hover-border' onClick={handleShowPackages}>
						Pricing
					</a>
					<a href='#' className='btn text-white ms-3 hover-border' onClick={handleSignup}>
						Sign up for Trial
					</a>
				</nav>

				<Drawer
					anchor="right"
					open={isDrawerOpen}
					onClose={toggleDrawer(false)}
					PaperProps={{
						sx: {
							width: '100%',
							backgroundColor: '#121212'
						}
					}}
				>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
						<Typography variant="h6" sx={{ color: 'white' }}>
							<img src={Logo} alt="Logo" style={{ height: '40px' }} />
						</Typography>
						<IconButton onClick={toggleDrawer(false)} style={{ margin: '-12px -5px 0px 10px' }} >
							<CloseIcon sx={{ color: 'white' }} />
						</IconButton>
					</Box>

					<List sx={{ padding: '12px 15px', boxSizing: 'border-box', color: 'white' }}>
						<ListItem
							button
							onClick={() => { handleShowFeatures(); toggleDrawer(false); }}
							sx={{ paddingLeft: '0px' }}
						>
							<Typography sx={{ color: 'white', width: '100%', textAlign: 'center', fontSize: '18px', lineHeight: '22px' }}>
								Features
							</Typography>
						</ListItem>

						<ListItem
							button
							onClick={() => { handleShowPackages(); toggleDrawer(false); }}
							sx={{ paddingLeft: '0px' }}
						>
							<Typography sx={{ color: 'white', width: '100%', textAlign: 'center', fontSize: '18px', lineHeight: '22px' }}>
								Pricing
							</Typography>
						</ListItem>

						<ListItem
							button
							onClick={() => { handleSignup(); toggleDrawer(false); }}
							sx={{ paddingLeft: '0px' }}
						>
							<Typography sx={{ color: 'white', width: '100%', textAlign: 'center', fontSize: '18px', lineHeight: '22px' }}>
								Sign up for Trial
							</Typography>
						</ListItem>
					</List>
				</Drawer>
			</header>


			<main
				className='flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center main-section text-black'
				style={{ backgroundColor: 'rgb(255 255 255)' }}>
				{!showPackages && !showFeatures && !about && !contact && (
					<div className='container-fluid'>
						<div className='row mt-5'>
							<div className='col-md-4 text-center'>
								<div className='d-flex' style={{ minHeight: '220px' }}>
									<div className='d-flex'>
										<img src={Logo1} alt="Cloud-Based Software" width={170} height={150} />
									</div>
									<div className='d-flex flex-column p-1' style={{ width: '70%' }}>
										<h3 className='text-start'>Cloud-Based Software</h3>
										<p className='text-start'>
											{expanded.cloudSoftware
												? 'Emphasizing that your sparepart management system is cloud-based can highlight several key benefits such as accessibility, scalability, and ease of use.'
												: 'Emphasizing that your sparepart management system is...'}
										</p>
										<button className='bg-dark rounded-3 col-md-6 text-white m-auto p-2' onClick={() => toggleText('cloudSoftware')}>
											{expanded.cloudSoftware ? 'Show Less' : 'Read More'}
										</button>
									</div>
								</div>
								<DashedLineSvg />
							</div>

							<div className='col-md-4 text-center'>
								<div className='d-flex' style={{ minHeight: '220px' }}>
									<div className='d-flex'>
										<img src={Logo2} alt="Multi-User and Mobile Responsive" width={170} height={150} />
									</div>
									<div className='d-flex flex-column p-1' style={{ width: '70%' }}>
										<h3 className='text-start'>Multi-User and Mobile Responsive</h3>
										<p className='text-start'>
											{expanded.multiUser
												? 'Multiple users can access the system at the same time. Our mobile responsive system can be handled from computers, tablets, and mobile devices.'
												: 'Multiple users can access the system at the same time...'}
										</p>
										<button className='bg-dark rounded-3 col-md-6 text-white m-auto p-2' onClick={() => toggleText('multiUser')}>
											{expanded.multiUser ? 'Show Less' : 'Read More'}
										</button>
									</div>
								</div>
								<DashedLineSvg />
							</div>

							<div className='col-md-4 text-center'>
								<div className='d-flex' style={{ minHeight: '220px' }}>
									<div className='d-flex'>
										<img src={Logo3} alt="Easy Item Tracking" width={170} height={150} />
									</div>
									<div className='d-flex flex-column p-1' style={{ width: '70%' }}>
										<h3 className='text-start'>Easy Item Tracking</h3>
										<p className='text-start'>
											{expanded.easyTracking
												? 'Implementing an easy item tracking system with OEM numbers creates a user-friendly interface and leverages modern technologies to ensure efficient and accurate tracking.'
												: 'Implementing an easy item tracking system  with OEM numbers creates a user-friendly...'}
										</p>
										<button className='bg-dark rounded-3 col-md-6 text-white m-auto p-2' onClick={() => toggleText('easyTracking')}>
											{expanded.easyTracking ? 'Show Less' : 'Read More'}
										</button>
									</div>
								</div>
								<DashedLineSvg />
							</div>
						</div>

						<div className='row mt-5'>
							<div className='col-md-4 text-center'>
								<div className='d-flex' style={{ minHeight: '220px' }}>
									<div className='d-flex'>
										<img src={Logo4} alt="Easy Inventory Management" width={170} height={150} />
									</div>
									<div className='d-flex flex-column p-1' style={{ width: '70%' }}>
										<h3 className='text-start'>Easy Inventory Management</h3>
										<p className='text-start'>
											{expanded.inventoryManagement
												? 'Providing users with clear, concise, and actionable information to help them efficiently manage their inventory.'
												: 'Providing users with clear, concise, and actionable information...'}
										</p>
										<button className='bg-dark rounded-3 col-md-6 text-white m-auto p-2' onClick={() => toggleText('inventoryManagement')}>
											{expanded.inventoryManagement ? 'Show Less' : 'Read More'}
										</button>
									</div>
								</div>
								<DashedLineSvg />
							</div>
							<div className='col-md-4 text-center'>
								<div className='d-flex' style={{ minHeight: "220px" }}>
									<div className='d-flex'>
										<img src={Logo5} alt="Price History" width={170} height={150} />
									</div>
									<div className='d-flex flex-column p-1' style={{ width: "70%" }}>
										<h3 className='text-start'>Price History</h3>
										<p className='text-start'>
											<ul>
												{expanded.priceHistory
													? <>
														<li>Average price </li>
														<li>Last sale </li>
														<li>Last purchase</li>
													</>
													:
													<>
														<li>Average price </li>
														<li>Last sale </li>
														<li>...</li>
													</>
												}
											</ul>
										</p>
										<button className='bg-dark rounded-3 col-md-6 text-white m-auto p-2' onClick={() => toggleText('priceHistory')} >
											{expanded.priceHistory ? 'Show Less' : 'Read More'}
										</button>
									</div>
								</div>
								<DashedLineSvg />
							</div>
							<div className='col-md-4 text-center'>
								<div className='d-flex' style={{ minHeight: "220px" }}>
									<div className='d-flex'>
										<img src={Logo6} alt="Easy Return" width={170} height={150} />
									</div>
									<div className='d-flex flex-column p-1' style={{ width: "70%" }}>
										<h3 className='text-start'>Easy Return</h3>
										<p className='text-start'>
											{expanded.easyReturn
												? 'Sale return and Purchase return can be easily managed.'
												: 'Sale return and Purchase return can be...'}
										</p>
										<button className='bg-dark rounded-3 col-md-6 text-white m-auto p-2' onClick={() => toggleText('easyReturn')} n>
											{expanded.easyReturn ? 'Show Less' : 'Read More'}
										</button>
									</div>
								</div>
								<DashedLineSvg />
							</div>
						</div>
					</div>
				)}


				{showFeatures && (
					<div className='features-section'>
						<h2 className='mb-4' style={{ fontSize: '2.5rem' }}>
							Our Features
						</h2>
						<ul className='list-unstyled'>
							<li>
								Gain comprehensive insights with real-time data visualization on
								your dashboard for informed decisions.
							</li>
							<li>
								Optimize parts management with advanced tools for efficient tracking
								and control.
							</li>
							<li>
								Streamline inventory operations, ensuring optimal stock levels and
								reduced costs.
							</li>
							<li>
								Boost sales performance with tools designed to enhance customer
								satisfaction.
							</li>
							<li>
								Manage product transfers seamlessly, ensuring accurate and efficient
								operations.
							</li>
							<li>
								Enhance supplier management with tools to streamline communication
								and transactions.
							</li>
							<li>
								Keep your store operations organized and efficient with our
								management tools.
							</li>
							<li>
								Handle your financial accounts effortlessly with comprehensive
								accounting solutions.
							</li>
							<li>
								Create and track vouchers accurately, ensuring seamless financial
								transactions.
							</li>
							<li>
								Generate precise financial statements to assess your business's
								financial health.
							</li>
							<li>
								Facilitate the transfer of items with tools that ensure accuracy and
								efficiency.
							</li>
							<li>
								Categorize and track expenses easily with our expense type
								management tools.
							</li>
							<li>
								Control and manage user access and permissions to ensure security
								and proper resource allocation.
							</li>
						</ul>
					</div>
				)}

				{showPackages && (
					<>


						<div className="container-fluid">
							<div className="row mt-1">
								<h1 className="mt-2 mb-4">Pick Your Perfect Plan</h1>
								<div className="d-flex justify-content-center flex-wrap">

									{[1, 2, 3].map((index) => {
										const packageInfo = packages && packages[index];
										const defaultPrices = [5000, 8000, 10000];
										const planNames = ["Basic Plan", "Silver Plan", "Gold Plan"];
										const price = packageInfo?.price || defaultPrices[index - 1];


										let dataLimit;
										let salesmenLimit;
										if (index === 1) {
											dataLimit = "One month data";
											salesmenLimit = "Three salesmen can be created";
										} else if (index === 2) {
											dataLimit = "Three months of data";
											salesmenLimit = "Six salesmen can be created";
										} else {
											dataLimit = "One year of data";
											salesmenLimit = "Ten salesmen can be created";
										}

										return (
											<div className="col-12 col-md-3 mb-3 mx-3" key={index}>
												<div className="card mx-2" style={{ color: "black", borderRadius: "25px" }}>
													<div
														className="card-header"
														style={{
															fontSize: "20px",
															fontWeight: "bold",
															borderTopLeftRadius: "25px",
															borderTopRightRadius: "25px",
															textAlign: "left",
															display: 'flex',
															justifyContent: 'space-between',
															alignItems: 'center',
														}}
													>
														<div>{planNames[index - 1]}</div>
														<span>{parseFloat(price).toFixed(0)} PKR</span>
													</div>


													<div
														className="card-body h-100 d-flex flex-column justify-content-end"
														style={{ backgroundColor: "#e0f3e8", borderBottomLeftRadius: "25px", borderBottomRightRadius: "25px" }}
													>
														<div className="text-start">
															<p className="card-text" style={{ fontSize: "12px" }}>
																<span style={{ color: "green" }}>✔</span> Real-time data insights on your dashboard
															</p>
															<p className="card-text" style={{ fontSize: "12px" }}>
																<span style={{ color: "green" }}>✔</span> Efficient parts management and tracking
															</p>
															<p className="card-text" style={{ fontSize: "12px" }}>
																<span style={{ color: "green" }}>✔</span> Streamlined inventory operations with optimal stock levels
															</p>
															<p className="card-text" style={{ fontSize: "12px" }}>
																<span style={{ color: "green" }}>✔</span> Boost sales performance with tools designed to enhance customer satisfaction
															</p>
															<p className="card-text" style={{ fontSize: "12px" }}>
																<span style={{ color: "green" }}>✔</span> Manage product transfers seamlessly, ensuring accurate and efficient operations
															</p>
															<p className="card-text" style={{ fontSize: "12px" }}>
																<span style={{ color: "green" }}>✔</span> Enhance supplier management with tools to streamline communication and transactions
															</p>
															<p className="card-text" style={{ fontSize: "12px" }}>
																<span style={{ color: "green" }}>✔</span> Keep your store operations organized and efficient
															</p>
															<p className="card-text" style={{ fontSize: "12px" }}>
																<span style={{ color: "green" }}>✔</span> Handle your financial accounts effortlessly
															</p>
															<p className="card-text" style={{ fontSize: "12px" }}>
																<span style={{ color: "green" }}>✔</span> Create and track vouchers accurately, ensuring seamless financial transactions
															</p>
															<p className="card-text" style={{ fontSize: "12px" }}>
																<span style={{ color: "green" }}>✔</span> {dataLimit}
															</p>
															<p className="card-text" style={{ fontSize: "12px" }}>
																<span style={{ color: "green" }}>✔</span> {salesmenLimit}
															</p>
															<br />
															<a
																href="#"
																className="btn btn-primary w-100"
																style={{ fontSize: "16px", fontWeight: "bold" }}
																onClick={() => handlePackage(index)}
															>
																Buy {planNames[index - 1].split(" ")[0]}
															</a>
														</div>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>

						<Dialog open={openModal} onClose={handleClose}>
							<DialogContent>
								{selectedPackage !== null && (
									<>
										<Typography variant="h6">{getModalData(selectedPackage).name}</Typography>
										<RadioGroup
											value={planType}
											onChange={(e) => setPlanType(e.target.value)}
											sx={{ marginTop: 2 }}
										>
											<FormControlLabel
												value="monthly"
												control={<Radio />}
												label={`Monthly: ${getModalData(selectedPackage)?.monthlyPrice} PKR`}
											/>
											<FormControlLabel
												value="yearly"
												control={<Radio />}
												label={`Yearly: ${getModalData(selectedPackage)?.yearlyPrice} PKR (Discount: ${getModalData(selectedPackage).discount}%)`}
											/>
										</RadioGroup>
										{planType === "yearly" && (
											<Typography variant="body1" sx={{ color: 'green', marginTop: 1 }}>
												You save {getModalData(selectedPackage).savings} PKR with the yearly plan!
											</Typography>
										)}
									</>
								)}
							</DialogContent>
							<DialogActions>
								<Button onClick={handleClose} color="secondary">
									Close
								</Button>
								<Button onClick={handleConfirmPurchase} color="primary">
									Confirm Purchase
								</Button>
							</DialogActions>
						</Dialog>
					</>
				)}



				{about && (
					<div className=''>
						<h2 className='display-5 mb-4'>About</h2>
					</div>
				)}
				{contact && (
					<div className=''>
						<h2 className='display-5 mb-4'>Contact Us</h2>
					</div>
				)}
			</main>
		</div>
	);
};

export default GetingStarted;
