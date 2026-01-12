import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import ReactRoundedImage from 'react-rounded-image';
import Icon from '../../components/icon/Icon';

// import Logo from '../../components/Logo';
// import Logo from '../../components/logo/meelu.png';
import Logo from '../../components/logo/logo.png';


const Brand = ({ asideStatus, setAsideStatus }) => {
	// Parse cookies data safely
	let data = null;
	let logoUser= null;
	try {
		const dataString = Cookies.get('Data1');
		data = dataString ? JSON.parse(dataString) : null;
		if (data && data.user && data.user.logo_url) {
		  logoUser = data.user.logo_url; 
		} else {
		  logoUser = Logo; 
		}
	  } catch (error) {
		console.error('Error parsing Data1 from localStorage:', error);
	  }
	
	// console.log('the logo url is:', logoUrl);
	return (
		<div className='brand '>
			<div className='brand-logo'>
				<h1 className='brand-title '>
					<Link to='/sparepart360' aria-label='Logo' alt='Sparepart360'>
					<ReactRoundedImage
							roundedColor='#66A5CC'
							imageWidth='55'
							imageHeight='55'
							roundedSize='3'
							borderRadius='45'
							image={logoUser}
						/>
					</Link>
				</h1>
			</div>
			<button
				type='button'
				className='btn brand-aside-toggle'
				aria-label='Toggle Aside'
				onClick={() => setAsideStatus(!asideStatus)}>
				<Icon icon='FirstPage' className='brand-aside-toggle-close' />
				<Icon icon='LastPage' className='brand-aside-toggle-open' />
			</button>
		</div>
	);
};
Brand.propTypes = {
	asideStatus: PropTypes.bool.isRequired,
	setAsideStatus: PropTypes.func.isRequired,
};

export default Brand;
