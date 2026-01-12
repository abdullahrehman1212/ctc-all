import React from 'react';

import Icon from '../components/icon/Icon';

const _titleSuccess = (
	<span className='d-flex align-items-center'>
		<Icon icon='Info' size='lg' className='me-1' />
		<span>Success</span>
	</span>
);
const _titleError = (
	<span className='d-flex align-items-center'>
		<Icon icon='Warning' size='lg' className='me-1' />
		<span>Error </span>
	</span>
);

export { _titleError, _titleSuccess };
