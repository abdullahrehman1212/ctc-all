// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { ThemeProvider } from 'react-jss';
import { ReactNotifications } from 'react-notifications-component';

import { useFullscreen } from 'react-use';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';

import { ToastProvider } from 'react-toast-notifications';
import { TourProvider } from '@reactour/tour';
// eslint-disable-next-line import/no-extraneous-dependencies
import Cookies from 'js-cookie';
import ThemeContext from '../contexts/themeContext';
import GetingStarted from '../pages/presentation/auth/GettingStarted';
import Aside from '../layout/Aside/Aside';
import Wrapper from '../layout/Wrapper/Wrapper';
import Portal from '../layout/Portal/Portal';
import { demoPages, layoutMenu } from '../menu';
import { Toast, ToastContainer } from '../components/bootstrap/Toasts';
import useDarkMode from '../hooks/useDarkMode';
import COLORS from '../common/data/enumColors';
import { getOS } from '../helpers/helpers';
import steps, { styles } from '../steps';
import ProtectedRoute from '../components/ProtectedRoute';

const App = () => {
	getOS();
	const navigate = useNavigate();
	const location = useLocation();

	/**
	 * Dark Mode
	 */
	const { themeStatus, darkModeStatus } = useDarkMode();
	const theme = {
		theme: themeStatus,
		primary: COLORS.PRIMARY.code,
		secondary: COLORS.SECONDARY.code,
		success: COLORS.SUCCESS.code,
		info: COLORS.INFO.code,
		warning: COLORS.WARNING.code,
		danger: COLORS.DANGER.code,
		dark: COLORS.DARK.code,
		light: COLORS.LIGHT.code,
	};

	useEffect(() => {
		if (location.pathname === '/sparepart360/auth-pages/get-started') {
			navigate(`../${demoPages.getStarted.path}`, { replace: true });
		}
		


		if (darkModeStatus) {
			document.documentElement.setAttribute('theme', 'dark');
		}
		return () => {
			document.documentElement.removeAttribute('theme');
		};
	}, [darkModeStatus, navigate, location.pathname]);

	/**
	 * Full Screen
	 */
	const { fullScreenStatus, setFullScreenStatus } = useContext(ThemeContext);
	const ref = useRef(null);
	useFullscreen(ref, fullScreenStatus, {
		onClose: () => setFullScreenStatus(false),
	});

	/**
	 * Modern Design
	 */
	useLayoutEffect(() => {
		if (process.env.REACT_APP_MODERN_DESGIN === 'true') {
			document.body.classList.add('modern-design');
		} else {
			document.body.classList.remove('modern-design');
		}
	});

	//	Add paths to the array that you don't want to be "Aside".
	const withOutAsidePages = [
		demoPages.login.path,
		demoPages.getStarted.path,
		demoPages.signUp.path,
		demoPages.register.path,
		demoPages.otp.path,
		layoutMenu.blank.path,
	];

	return (
		<ThemeProvider theme={theme}>
			<ToastProvider components={{ ToastContainer, Toast }}>
				<TourProvider
					steps={steps}
					styles={styles}
					showNavigation={false}
					showBadge={false}>
					<div
						ref={ref}
						className='app'
						style={{
							backgroundColor: fullScreenStatus && 'var(--bs-body-bg)',
							zIndex: fullScreenStatus && 1,
							overflow: fullScreenStatus && 'scroll',
						}}>
						<Routes>
							{withOutAsidePages.map((path) => (
								<Route key={path} path={path} />
							))}
							<Route path='*' element = {<ProtectedRoute  element={<Aside />} />}/>
							{/* {location.pathname === '/Swatti_Autos/auth-pages/get-started' ? (
								<Route path='*' element={<GetingStarted />} />
							) : (
								<Route path='*' element={<Aside />} />
							)} */}
						</Routes>
						<Wrapper />
					</div>
					<Portal id='portal-notification'>
						<ReactNotifications />
					</Portal>
				</TourProvider>
			</ToastProvider>
		</ThemeProvider>
	);
};

export default App;
