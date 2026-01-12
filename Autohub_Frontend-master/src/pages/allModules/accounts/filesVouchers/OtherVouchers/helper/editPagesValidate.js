const validate = (values) => {
	let errors = {};
	// let listErrors = [];
	if (!values.name) {
		errors.name = 'Please provide paid To.';
	}
	if (!values.date) {
		errors.date = 'Date is Required.';
	}

	// if (!values.voucher_no) {
	// 	errors.voucher_no = 'Please provide voucher No';
	// }
	values.list.forEach((data, index) => {
		if (!data.description) {
			errors = {
				...errors,
				[`list[${index}]description`]: 'Please provide description',
			};
		}
		if (!data.account) {
			errors = {
				...errors,
				[`list[${index}]account`]: 'Required',
			};
		}
		if (!data.file_id && data?.account?.label !== '501003-Lands Equity') {
			errors = {
				...errors,
				[`list[${index}]file_id`]: 'Required',
			};
		}
		if (!data.land_payment_head_id) {
			errors = {
				...errors,
				[`list[${index}]land_payment_head_id`]: 'Required',
			};
		}
		if (!data.dr && data.dr !== 0) {
			errors = {
				...errors,
				[`list[${index}]dr`]: 'Please provide dr Amount',
			};
		}
		if (!data.cr && data.cr !== 0) {
			errors = {
				...errors,
				[`list[${index}]cr`]: 'Please provide cr Amount',
			};
		}
		if (values.total_amount_cr !== values.total_amount_dr) {
			errors.total_amount_cr = 'Not Balanced';
			errors.total_amount_dr = 'Not Balanced';
		} else {
			values.total_amount = values.total_amount_cr;
		}
	});

	return errors;
};

export default validate;
