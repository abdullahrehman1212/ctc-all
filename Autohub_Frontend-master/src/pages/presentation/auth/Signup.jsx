/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
import React, { useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
// import { useCookies } from 'react-cookie';
import Cookies from 'js-cookie';
// eslint-disable-next-line import/no-extraneous-dependencies, no-unused-vars

import moment from 'moment';
// import { setAuthToken } from '../../../baseURL/jwtUtils';
// eslint-disable-next-line no-unused-vars
import showNotification from '../../../components/extras/showNotification';
// eslint-disable-next-line no-unused-vars
import { _titleSuccess, _titleError, _titleWarning } from '../../../baseURL/messages';

// import subDirForNavigation from '../../../baseDirectory/subDirForNavigation';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Logo1 from '../../../components/logo/logo1.png';
// import useDarkMode from '../../../hooks/useDarkMode';
import baseURL from '../../../baseURL/baseURL';
import Cropper from './Cropper';
import { StyledButton1 } from '../../../components/styledComponents';


const Signup = () => {
	// eslint-disable-next-line no-unused-vars
	const [cookies, setCookie, removeCookie] = useCookies(['userToken1']);
	// eslint-disable-next-line no-unused-vars

	// const { darkModeStatus } = useDarkMode();

	// eslint-disable-next-line no-unused-vars
	const [usernameInput, setUsernameInput] = useState(false);
	// eslint-disable-next-line no-unused-vars
	const [isNewUser, setIsNewUser] = useState(() => {
		const storedValue = localStorage.getItem('newUser1');
		return storedValue !== null ? JSON.parse(storedValue) : 0;
	});
	const [packageType, setpackageType] = useState(() => {
		const storedValue = localStorage.getItem('packageType');
		return storedValue !== null ? storedValue : 'monthly';
	});
	const [packageId, setPackageId] = useState(() => {
		const storedValue = localStorage.getItem('packageId1');
		if (storedValue == null) {
			localStorage.setItem('packageId1', 1);
			localStorage.setItem('newUser1', 1);
			localStorage.setItem('packageType', 'monthly')
		}
		else {
			return JSON.parse(storedValue);
		}
		const cookieValue = Cookies.get('packageId1');
		return cookieValue !== undefined ? cookieValue : null;
	});


	const [lastSave, setLastSave] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [address, setAddress] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [city, setCity] = useState('');
	const [password, setPassword] = useState('');
	const [companyLogo, setCompanyLogo] = useState('');
	const [companyName, setCompanyName] = useState('');
	const [userName, setUserName] = useState('');
	const [invoiceNote, setInvoiceNote] = useState('');
	const [ntn, setNtn] = useState('');
	const [gst, setGst] = useState('');
	// eslint-disable-next-line no-unused-vars
	const navigate = useNavigate();


	const handleOnClick = async (e) => {
		setIsLoading(true);

		e.preventDefault();


		if (name === '') {
			showNotification(_titleWarning, 'Please Provide Name', 'Warning');

			setIsLoading(false);
		} else if (userName === '') {
			showNotification(_titleWarning, 'Please Provide User Name', 'Warning');

			setIsLoading(false);
		} else if (address === '') {
			showNotification(_titleWarning, 'Please Provide Address', 'Warning');

			setIsLoading(false);
		} else if (city === '') {
			showNotification(_titleWarning, 'Please Provide City ', 'Warning');

			setIsLoading(false);
		} else if (phoneNumber === '') {
			showNotification(_titleWarning, 'Please Provide Phone Number', 'Warning');

			setIsLoading(false);
		} else if (email === '') {
			showNotification(_titleWarning, 'Please Provide Email', 'Warning');

			setIsLoading(false);
		} else if (password === '') {
			showNotification(_titleWarning, 'Please Provide Password', 'Warning');

			setIsLoading(false);
		} else if (companyName === '') {
			showNotification(_titleWarning, 'Please Provide Company Name', 'Warning');

			setIsLoading(false);
		} else if (invoiceNote === '') {
			showNotification(_titleWarning, 'Please Provide Invoice Note', 'Warning');

			setIsLoading(false);
		}
		// else if (companyLogo === '') {
		// 	showNotification(_titleWarning, 'Please Provide Company Logo', 'Warning');

		// 	setIsLoading(false);
		// }
		else if (
			name !== '' &&
			address !== '' &&
			city !== '' &&
			phoneNumber !== '' &&
			email !== '' &&
			companyName !== '' &&
			invoiceNote !== '' &&
			// companyLogo !== '' &&
			userName !== ''
		) {
			const formData = new FormData();
			formData.append('city', city);
			formData.append('role_id', 2);
			formData.append('phone', phoneNumber);
			formData.append('address', address);
			formData.append('company_name', companyName);
			formData.append('name', name);
			formData.append('username', userName);
			formData.append('email', email);
			formData.append('password', password);
			formData.append('invoice_note', invoiceNote);
			formData.append('ntn', ntn);
			formData.append('gst', gst);
			formData.append('package_id', packageId);
			formData.append('type', packageType);
			formData.append('duration', 1);
			formData.append('logo', companyLogo);

			fetch(`${baseURL}/register`, {
				method: 'POST',
					body: formData, // Send formData instead of JSON
			})
				.then((res) => res.json())
				.then(async (data) => {
						console.log("The response of sign up api's is:", data);

					setIsLoading(false);
					if (data?.status === 'ok') {
						showNotification(_titleSuccess, 'Register successfully', 'Success');
						navigate(`/sparepart360/auth-pages/login`, { replace: true });
						setLastSave(moment());
						setIsNewUser(0);
					} else {
						showNotification(_titleError, data.message, 'Danger');
					}

					setIsLoading(false);
				})

				.catch((err) => {
					console.log(err, '	 Error');
					setIsLoading(false);
					showNotification(_titleError, 'Network Error', 'Danger');
				});
		} else {
			showNotification(_titleWarning, 'Fill out fields', 'Warning');

			setIsLoading(false);
		}

	};

	const handleSignInClick = () => {
		navigate("/login");
	};


	return (
		<PageWrapper title='Sign Up' className='bg-dark'>
			<Page className='p-3'>
				<div className='row h-100 align-items-center justify-content-center'>

					<div className='col-xl-8 col-lg-6 col-md-8 shadow-3d-container'>
						<Card className='shadow-3d-light' data-tour='login-page'>
							<CardBody>
								<div className='text-center my-4'>
									<img alt='Logo' src={Logo1} width={300} />
								</div>

								<>
									<div className='text-center h1 fw-bold mt-5' style={{ color: 'red' }}>Create Account,</div>
									<div className='text-center h4 text-muted mb-5'>Sign up to get started!</div>
								</>

								<form className='row g-4'>
									<div className='col-6'>
										<FormGroup id='signup-name' isFloating label='Name'>
											<Input
												autoComplete='given-name'
												onChange={(e) => setName(e.target.value)}
											/>
										</FormGroup>
									</div>
									<div className='col-6'>
										<FormGroup
											id='signup-userName'
											isFloating
											label='User Name'>
											<Input
												autoComplete='given-userName'
												onChange={(e) => setUserName(e.target.value)}
											/>
										</FormGroup>
									</div>
									<div className='col-6'>
										<FormGroup id='signup-email' isFloating label='Email'>
											<Input
												type='email'
												autoComplete='email'
												onChange={(e) => setEmail(e.target.value)}
											/>
										</FormGroup>
									</div>
									<div className='col-6'>
										<FormGroup
											id='signup-phoneNumber'
											isFloating
											label='Phone Number'>
											<Input
												autoComplete='given-phoneNumber'
												type='number'
												onChange={(e) => setPhoneNumber(e.target.value)}
											/>
										</FormGroup>
									</div>
									<div className='col-6'>
										<FormGroup id='signup-city' isFloating label='City'>
											<Input
												autoComplete='given-address'
												onChange={(e) => setCity(e.target.value)}
											/>
										</FormGroup>
									</div>
									<div className='col-6'>
										<FormGroup
											id='signup-address'
											isFloating
											label='Address'>
											<Input
												autoComplete='given-address'
												onChange={(e) => setAddress(e.target.value)}
											/>
										</FormGroup>
									</div>

									<div className='col-6'>
										<FormGroup
											id='signup-password'
											isFloating
											label='Password'>
											<Input
												type='password'
												autoComplete='password'
												onChange={(e) => setPassword(e.target.value)}
											/>
										</FormGroup>
									</div>
									<div className='col-6'>
										<FormGroup
											id='signup-companyName'
											isFloating
											label='Company Name'>
											<Input
												type='text'
												onChange={(e) => setCompanyName(e.target.value)}
											/>
										</FormGroup>
									</div>
									<div className='col-6'>
										<FormGroup
											id='signup-password'
											isFloating
											label='Invoice Note'>
											<Input
												type='text'
												onChange={(e) => setInvoiceNote(e.target.value)}
											/>
										</FormGroup>
									</div>
									<div className='col-6'>
										<FormGroup
											id='signup-password'
											isFloating
											label='NTN(optional)'>
											<Input
												type='text'
												onChange={(e) => setNtn(e.target.value)}
											/>
										</FormGroup>
									</div>
									<div className='col-12'>
										<FormGroup
											id='signup-password'
											isFloating
											label='GST(optional)'>
											<Input
												type='text'
												onChange={(e) => setGst(e.target.value)}
											/>
										</FormGroup>
									</div>
									{/* <div className='col-6'>
											<FormGroup
												id='signup-companyLogo'
												isFloating
												label='Company Logo(optional)'>
												<Input
													type='file'
													accept='image/*'
													onChange={handleFileChange}
												/>
											</FormGroup>
										</div> */}
									<div className='col-12'>
										{/* <div className='col-12'>
												<div
													style={{
														display: 'flex',
														justifyContent: 'center',
														alignItems: 'center',
													}}>
													Show the image and the crop picture here
												</div>
											</div> */}
										<Cropper setCompanyLogo={setCompanyLogo} />
									</div>
									<div className='col-12'>
										<StyledButton1
											className='w-100 py-3'
											onClick={handleOnClick}>
											Sign Up
										</StyledButton1>
									</div>
									<div className='col-12'>
										<Link to='/sparepart360/auth-pages/login' onClick={handleSignInClick}>
											<div className='text-center h5'>
												Sign here in to continue!
											</div>
										</Link>
									</div>
								</form>
							</CardBody>
						</Card>
						<div className='text-center'>
							<a href='https://koncept-solutions.com/' className='link-light'>
								Powered by Koncept Solutions
							</a>
						</div>
					</div>

				</div>
			</Page>
		</PageWrapper>
	);
};


export default Signup;
