/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
// import { useCookies } from 'react-cookie';

// eslint-disable-next-line import/no-extraneous-dependencies, no-unused-vars
import Cookies from 'js-cookie';

import moment from 'moment';
// import { setAuthToken } from '../../../baseURL/jwtUtils';
// eslint-disable-next-line no-unused-vars
import subDirForNavigation from '../../../baseDirectory/subDirForNavigation';
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
import Logo from '../../../components/Logo.png';
// import useDarkMode from '../../../hooks/useDarkMode';
import baseURL from '../../../baseURL/baseURL';
import Spinner from '../../../components/bootstrap/Spinner';

// eslint-disable-next-line react/prop-types
const LoginHeader = ({ isNewUser }) => {
	if (isNewUser) {
		return (
			<>
				<div className='text-center h1 fw-bold mt-5'>Create Account,</div>
				<div className='text-center h4 text-muted mb-5'>Sign up to get started!</div>
			</>
		);
	}
	return (
		<>
			<div className='text-center h1 fw-bold mt-5'>Welcome,</div>
			<div className='text-center h4 text-muted mb-5'>Sign in to continue!</div>
		</>
	);
};

const Login = () => {
	// eslint-disable-next-line no-unused-vars
	const [cookies, setCookie, removeCookie] = useCookies(['userToken']);

	// eslint-disable-next-line no-unused-vars

	// const { darkModeStatus } = useDarkMode();

	// eslint-disable-next-line no-unused-vars
	const [usernameInput, setUsernameInput] = useState(false);
	// eslint-disable-next-line no-unused-vars
	const [isNewUser, setIsNewUser] = useState(() => {
		const storedValue = localStorage.getItem('newUser1');
		return storedValue !== null ? JSON.parse(storedValue) : 0;
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
	const handleOnClick = (e) => {
		setIsLoading(true);

		e.preventDefault();

		if (email === '') {
			showNotification(_titleWarning, 'Please Provide Email Address', 'Warning');

			setIsLoading(false);
		} else if (password === '') {
			showNotification(_titleWarning, 'Please Provide Password', 'Warning');

			setIsLoading(false);
		} else if (email !== '' && password !== '') {
			fetch(`${baseURL}/login`, {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
					password,
				}),
			})
				.then((res) => res.json())
				.then(async (data) => {
					setIsLoading(false);
					if (data?.status === 'ok') {
						setCookie('userToken', data.token, { path: '/' });
						// eslint-disable-next-line no-unused-vars
						// await setAuthToken(data.token);

						Cookies.set('name', data.role.name);
						Cookies.set('role_name', data.role.role_name);
						Cookies.set('role_id', data.role.user.role.id);

						// Cookies.set('userID', data.user_id);
						showNotification(_titleSuccess, 'Login Success', 'Success');

						navigate(`${subDirForNavigation}`, { replace: true });
						// window.location.reload();
						setLastSave(moment());
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
		localStorage.setItem('newUser1', 0);
		setIsNewUser(0);
	};
	console.log('The isNewUser is:', isNewUser);

	return (
		<PageWrapper title={isNewUser ? 'Sign Up' : 'Login'} className='bg-success'>
			{/* className={classNames({ 'bg-success': !isNewUser, 'bg-info': !!isNewUser })}> */}
			<Page className='p-0'>
				<div className='row h-100 align-items-center justify-content-center'>
					{isNewUser ? (
						<div className='col-xl-8 col-lg-6 col-md-8 shadow-3d-container'>
							<Card className='shadow-3d-dark' data-tour='login-page'>
								<CardBody>
									<div className='text-center my-5'>
										<img alt='Logo' src={Logo} width={300} />
									</div>

									<LoginHeader isNewUser={isNewUser} />

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
										<div className='col-6'>
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
										<div className='col-6'>
											<FormGroup
												id='signup-companyLogo'
												isFloating
												label='Company Logo'>
												<Input
													type='file'
													accept='image/*'
													onChange={(e) =>
														setCompanyLogo(e.target.files[0])
													}
												/>
											</FormGroup>
										</div>
										<div className='col-12'>
											<Button
												color='success'
												className='w-100 py-3'
												onClick={handleOnClick}>
												Sign Up
											</Button>
										</div>
										<div className='col-12'>
											<Link to='/' onClick={handleSignInClick}>
												<div className='text-center h5'>
													Sign here in to continue!
												</div>
											</Link>
										</div>
									</form>
								</CardBody>
							</Card>
							<div className='text-center'>
								<a href='https://koncept-solutions.com/' className='link-dark'>
									Powered by Koncept Solutions
								</a>
							</div>
						</div>
					) : (
						<div className='col-xl-4 col-lg-6 col-md-8 shadow-3d-container'>
							<Card className='shadow-3d-dark' data-tour='login-page'>
								<CardBody>
									<div className='text-center my-5'>
										<img alt='Logo' src={Logo} width={300} />
									</div>

									<LoginHeader isNewUser={isNewUser} />

									<form className='row g-4'>
										<div className='col-12'>
											<FormGroup
												id='login-username'
												isFloating
												label='Your email or username'>
												<Input
													autoComplete='username'
													onChange={(e) => setEmail(e.target.value)}
												/>
											</FormGroup>
										</div>
										<div className='col-12'>
											<FormGroup
												id='login-password'
												isFloating
												label='Password'>
												<Input
													type='password'
													autoComplete='password'
													onChange={(e) => setPassword(e.target.value)}
												/>
											</FormGroup>
										</div>

										<div className='col-12'>
											<Button
												icon={isLoading ? null : 'Login'}
												isDisable={isLoading}
												color='success'
												type='submit'
												className='w-100 py-3'
												onClick={handleOnClick}>
												{isLoading && <Spinner isSmall inButton />}
												{isLoading
													? (lastSave && 'Signing in') || 'Signing in'
													: (lastSave && 'Sign in') || 'Sign in'}
											</Button>
										</div>
										<div className='col-12'>
											<Link
												to='/sparepart360/auth-pages/get-started'
												// onClick={handleSignUpClick}
											>
												<div className='text-center h5'>
													Geting started!
												</div>
											</Link>
										</div>
									</form>
								</CardBody>
							</Card>
							<div className='text-center'>
								<a href='https://koncept-solutions.com/' className='link-dark'>
									Powered by Koncept Solutions
								</a>
							</div>
						</div>
					)}
				</div>
			</Page>
		</PageWrapper>
	);
};

Login.defaultProps = {
	isSignUp: false,
};

export default Login;
