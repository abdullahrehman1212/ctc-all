/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-unused-vars */
import React from 'react';
import Cookies from 'js-cookie';
import { useMeasure } from 'react-use';
import classNames from 'classnames';
import useDarkMode from '../../hooks/useDarkMode';

const Footer = () => {
	const [ref, { height }] = useMeasure();

	const root = document.documentElement;
	root.style.setProperty('--footer-height', `${height}px`);

	const { darkModeStatus } = useDarkMode();

	let data = null;
	try {
		data = Cookies?.get('Data1') ? JSON.parse(Cookies?.get('Data1')) : null;
	} catch (error) {
		console.error('Error parsing cookies data:', error);
	}
	// console.log('The data of the logo is:', data?.user?.company_name);

	return (
		<footer ref={ref} className='footer'>
			<div className='container-fluid'>
				<div className='row'>
					<div className='col'>
						<span className='fw-light'>
							Copyright © 2025 -{' '}
							<a
								target='_blank'
								href='https://koncept-solutions.com'
								className={classNames('text-decoration-none', {
									'link-dark': !darkModeStatus,
									'link-light': darkModeStatus,
								})}
								rel='noreferrer'>
								<small className='fw-bold'>Koncept Solutions</small>
							</a>
						</span>
					</div>
					<div className='col-auto'>
						<a
							href='/'
							className={classNames('text-decoration-none', {
								'link-dark': !darkModeStatus,
								'link-light': darkModeStatus,
							})}>
							<small className='fw-bold'>Sparepart360 Theme</small>
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
