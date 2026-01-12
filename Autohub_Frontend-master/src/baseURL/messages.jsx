import React from 'react';
import Icon from '../components/icon/Icon';
// import { _titleError, _titleSuccess } from '../../../../../baseURL/messages';

const _titleSuccess = (
	<span className='d-flex align-items-center'>
		<Icon icon='Info' size='lg' className='me-1' />
		<span>Record Saved Successfully</span>
	</span>
);

const _titleError = (
	<span className='d-flex align-items-center'>
		<Icon icon='red' size='lg' className='me-1' />
		<span>Error Saving Record </span>
	</span>
);
// eslint-disable-next-line react/prop-types, no-unused-vars
const _titleCustom = ({ title, icon }) => (
	<span className='d-flex align-items-center'>
		<div className='col-auto'>
			<Icon icon={icon} className='h1' />
		</div>
		<span>{title} </span>
		{/* <span>...</span> */}
	</span>
);
const _titleWarning = (
	<span className='d-flex align-items-center'>
		<Icon icon='red' size='lg' className='me-1' />
		<span>Warning </span>
	</span>
);

export { _titleSuccess, _titleError, _titleCustom, _titleWarning };
