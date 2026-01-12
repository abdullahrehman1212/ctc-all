const validate = (values) => {
	let errors = {};

	if (!values.name) {
		errors.name = 'Please provide paid To.';
	}
	if (!values.date) {
		errors.date = 'Date is Required.';
	}
	if (!values.account) {
		errors.account = 'Please choose Dr account';
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
		if (!data.file_id) {
			errors = {
				...errors,
				[`list[${index}]file_id`]: 'Please Chosose File no',
			};
		}
		if (!data.land_payment_head_id) {
			errors = {
				...errors,
				[`list[${index}]land_payment_head_id`]: 'Please choose details',
			};
		}
		if (!data.account) {
			errors = {
				...errors,
				[`list[${index}]account`]: 'Please provide Account',
			};
		}
		if (!data.cr) {
			errors = {
				...errors,
				[`list[${index}]cr`]: 'Please provide Amount',
			};
		}
	});

	return errors;
};

export default validate;
