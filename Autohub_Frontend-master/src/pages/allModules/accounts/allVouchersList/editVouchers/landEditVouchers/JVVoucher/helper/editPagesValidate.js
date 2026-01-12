const validate = (values) => {
	let errors = {};
	const fileRequiredWithSubGroups = [1, 20, 22, 29, 48, 49, 59, 56];
	const paymentHeadRequiredWithSubGroups = [1, 22, 53, 58, 56, 29];
	// let listErrors = [];
	if (!values.name) {
		errors.name = 'Please provide paid To.';
	}
	if (!values.date) {
		errors.date = 'Date is Required.';
	}

	if (values.list.length < 1) {
		errors.list = 'list is Required.';
	}
	console.log(values.list);

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
		if (fileRequiredWithSubGroups.find((val) => val === data.account?.coa_sub_group_id)) {
			if (!data.file_id) {
				errors = {
					...errors,
					[`list[${index}]file_id`]: 'Required',
				};
			}
		}
		if (
			paymentHeadRequiredWithSubGroups.find((val) => val === data.account?.coa_sub_group_id)
		) {
			if (!data.land_payment_head_id) {
				errors = {
					...errors,
					[`list[${index}]land_payment_head_id`]: 'Required',
				};
			}
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
