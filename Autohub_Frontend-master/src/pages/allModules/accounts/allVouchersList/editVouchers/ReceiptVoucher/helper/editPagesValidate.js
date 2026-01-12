const validate = (values) => {
	let errors = {};

	if (!values.name) {
		errors.name = 'Please provide paid To.';
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
