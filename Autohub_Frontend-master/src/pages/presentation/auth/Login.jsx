/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
import React, { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
// eslint-disable-next-line import/no-duplicates
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useCookies } from 'react-cookie';
// eslint-disable-next-line import/no-duplicates
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
import Logo1 from '../../../components/logo/logo3.png';
// import useDarkMode from '../../../hooks/useDarkMode';
import baseURL from '../../../baseURL/baseURL';
import Spinner from '../../../components/bootstrap/Spinner';
import Cropper from './Cropper';
import { StyledButton1 } from '../../../components/styledComponents';

const Login = () => {
	// eslint-disable-next-line no-unused-vars
	const [cookies, setCookie, removeCookie] = useCookies(['userToken1']);

	// const { darkModeStatus } = useDarkMode();

	const [lastSave, setLastSave] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	// eslint-disable-next-line no-unused-vars
	const navigate = useNavigate();

	const handleOnClick = async (e) => {
		setIsLoading(true);

		e.preventDefault();

		// eslint-disable-next-line no-lonely-if
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
					console.log("The response of login api's is:", data);

					setIsLoading(false);
					if (data?.status === 'ok') {
						setCookie('userToken1', data.token, { path: '/' });
						// eslint-disable-next-line no-unused-vars
						// await setAuthToken(data.token);

						Cookies.set('name1', data.role.name);
						Cookies.set('role_name1', data.role.role);
						Cookies.set('role_id1', data.role.user.role.id);
						Cookies.set('id1', data.role.id);
						Cookies.set('last_login1', data.role.last_login);
						Cookies.set('Data1', JSON.stringify(data.role));
						// const base64Logo = await blobToBase64(companyLogo);
						// localStorage.setItem('logo_url', JSON.stringify(base64Logo));
						// Cookies.set('userID', data.user_id);
						showNotification(_titleSuccess, 'Login Success', 'Success');
						localStorage.setItem('newUser1', 0);
						console.log('The role id is:', data?.role?.user?.role.id);
						if (data?.role?.user?.role.id === 3) {
							navigate(`${subDirForNavigation}inventory/parts`, {
								replace: true,
							});
						} else {
							navigate(`${subDirForNavigation}`, { replace: true });
						}

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

	return (
		<PageWrapper title='Login' className='bg-black'>
			<Page className='p-3'>
				<div className='row h-100 align-items-center justify-content-center'>
					<div className='col-xl-4 col-lg-6 col-md-8 shadow-3d-container'>
						<Card className='shadow-3d-light' data-tour='login-page'>
							<CardBody>
								<div className='text-center my-4'>
									<img alt='Logo' src={Logo1} width={300} />
								</div>

								<>
									<div
										className='text-center h1 fw-bold mt-5'
										style={{ color: 'red' }}>
										Welcome,
									</div>
									<div className='text-center h4 text-muted mb-5'>
										Sign in to continue!
									</div>
								</>

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
										<FormGroup id='login-password' isFloating label='Password'>
											<Input
												type='password'
												autoComplete='password'
												onChange={(e) => setPassword(e.target.value)}
											/>
										</FormGroup>
									</div>

									<div className='col-12'>
										<StyledButton1
											disabled={isLoading}
											type='submit'
											className='w-100 py-3'
											onClick={handleOnClick}>
											{isLoading && <Spinner isSmall inButton />}
											{isLoading
												? (lastSave && 'Signing in') || 'Signing in'
												: (lastSave && 'Sign in') || 'Sign in'}
										</StyledButton1>
									</div>
									<div className='col-12'>
										<Link
											to='/sparepart360/auth-pages/get-started'
											// onClick={handleSignUpClick}
											className='link-danger'>
											<div className='text-center h5'>Geting started!</div>
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

export default Login;
