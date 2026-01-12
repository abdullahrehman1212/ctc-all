const validate = (values) => {
	// let count = 0;
	// eslint-disable-next-line no-unused-vars

	let errors = {};
	// let listErrors = [];
	if (!values.name) {
		errors.name = 'Please provide paid To.';
	}
	if (!values.date) {
		errors.date = 'Date is Required.';
	}
	if (!values.account) {
		errors.account = 'Please choose Cr account';
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
		if (!data.dr) {
			errors = {
				...errors,
				[`list[${index}]dr`]: 'Please provide Amount',
			};
		}
	});
	// eslint-disable-next-line no-console
	console.log('::::', values);
	// eslint-disable-next-line no-console
	console.log('::::', errors);
	return errors;
};

export default validate;
