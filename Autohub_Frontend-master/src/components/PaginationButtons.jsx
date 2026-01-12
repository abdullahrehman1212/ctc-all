import React from 'react';
import PropTypes from 'prop-types';
import { CardFooter, CardFooterLeft, CardFooterRight } from './bootstrap/Card';
import Select from './bootstrap/forms/Select';
import Option from './bootstrap/Option';

export const PER_COUNT = {
	2: 2,
	10: 10,
	25: 25,
	50: 50,
	100: 100,
	500: 500,
	1000: 1000,
};

export const dataPagination = (data, currentPage, perPage) =>
	data.filter(
		(i, index) => index + 1 > (currentPage - 1) * perPage && index + 1 <= currentPage * perPage,
	);

const PaginationButtons = ({ from, to, total, perPage, setPerPage }) => {
	const getInfo = () => {
		return (
			<span className='pagination__desc'>
				Showing {from} to {to} of {total} Records
			</span>
		);
	};

	return (
		<CardFooter>
			<CardFooterLeft>
				<span className='text-muted'>{getInfo()}</span>
			</CardFooterLeft>

			<CardFooterRight className='d-flex'>
				<Select
					size='sm'
					ariaLabel='Per'
					onChange={(e) => setPerPage(Number(e.target.value))}
					value={perPage.toString()}>
					{Object.keys(PER_COUNT).map((i) => (
						<Option key={i} value={i}>
							{i}
						</Option>
					))}
				</Select>
			</CardFooterRight>
		</CardFooter>
	);
};

PaginationButtons.propTypes = {
	from: PropTypes.number.isRequired,
	to: PropTypes.number.isRequired,
	total: PropTypes.number.isRequired,
	perPage: PropTypes.number.isRequired,
	setPerPage: PropTypes.func.isRequired,
};

export default PaginationButtons;
