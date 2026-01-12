// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** apiClient Imports
import Select from 'react-select';
import moment from 'moment';
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-unresolved
import Spinner from '../../../../components/bootstrap/Spinner';
import { _titleError, _titleSuccess } from '../../../../notifyMessages/erroSuccess';

import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardHeader,
	CardLabel,
} from '../../../../components/bootstrap/Card';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
import apiClient from '../../../../baseURL/apiClient';
import Button from '../../../../components/bootstrap/Button';
// import showNotification from '../../../../components/extras/showNotification';

const validate = (values) => {
	const errors = {};
	if (!values.shelf_number) {
		errors.shelf_number = 'Required';
	}
	return errors;
};

// eslint-disable-next-line react/prop-types
const Edit = ({ editingItem, handleStateEdit }) => {
	console.log('editing data:', editingItem);
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const [rackOptions, setRackOptions] = useState([]);
	console.log('racks data: ', rackOptions);
	const [rackOptionsLoading, setRackOptionsLoading] = useState(false);

	useEffect(() => {
		setRackOptionsLoading(true);
		apiClient
			/* eslint-disable camelcase */
			.get(`/getRackDropDown`)
			.then((response) => {
				const rec = response.data.racks.map(({ id, rack_number }) => ({
					id,
					value: id,
					label: rack_number,
				}));
				setRackOptions(rec);

				setRackOptionsLoading(false);
			})
			/* eslint-enable camelcase */
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
	}, []);

	const formik = useFormik({
		initialValues: editingItem,
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});

	const submitForm = (data) => {
		apiClient
			.post(`/updateShelves`, data)
			.then((res) => {
				if (res.data.status === 'ok') {
					formik.resetForm();
					// showNotification(_titleSuccess, res.data.message, 'success');
					handleStateEdit(false);
					setIsLoading(false);
					setLastSave(moment());
				} else {
					setIsLoading(false);
					// showNotification(_titleError, res.message, 'Danger');
				}
			})
			.catch((err) => {
				setIsLoading(false);
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
				setIsLoading(false);
			});
	};

	const handleChange = (e) => {
        const newValue = e.target.value;

        // Update only the rack_number property
        formik.setValues({
            ...formik.values,
            shelf_number: newValue,
        });
    };

	const handleSave = () => {
		submitForm(formik.values);
		setLastSave(moment());
	};
	return (
		<div className='col-12'>
			<Card stretch tag='form' onSubmit={formik.handleSubmit}>
				<CardBody>
					<div className='row g-2'>
						<div className='col-md-12'>
							<FormGroup label='Racks' id='rack_number'>
								<Select
									className='col-md-10'
									classNamePrefix='select'
									options={rackOptions}
									isLoading={rackOptionsLoading}
									isClearable
									value={
										formik.values.rack_id
											? rackOptions?.find(
													(c) => c.value === formik.values.rack_id,
											  )
											: null
									}
									onChange={(val) => {
										console.log('Selected Value:', val); // Log selected value
										formik.setFieldValue('rack_id', val ? val.id : null);
									}}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									isTouched={formik.touched.rack_id}
									invalidFeedback={formik.errors.rack_id}
									validFeedback='Looks good!'
									onFocus={() => {
										console.log('Rack Options:', rackOptions); // Log rackOptions
									}}
								/>
							</FormGroup>
						</div>
						<div className='col-md-12'>
							<FormGroup id='shelf' label='Shelf' className='col-md-12'>
								<Input
									onChange={handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.shelf_number}
									isValid={formik.isValid}
									isTouched={formik.touched.shelf_number}
									invalidFeedback={formik.errors.shelf_number}
									validFeedback='Looks good!'
								/>
							</FormGroup>
						</div>
					</div>
				</CardBody>
				<CardFooter>
					<CardFooterLeft>
						<Button type='reset' color='info' isOutline onClick={formik.resetForm}>
							Reset
						</Button>
					</CardFooterLeft>
					<CardFooterRight>
						<Button
							className='me-3'
							icon={isLoading ? null : 'Update'}
							isLight
							color={lastSave ? 'info' : 'success'}
							isDisable={isLoading}
							onClick={formik.handleSubmit}>
							{isLoading && <Spinner isSmall inButton />}
							{isLoading
								? (lastSave && 'Updating') || 'Updating'
								: (lastSave && 'Update') || 'Update'}
						</Button>
					</CardFooterRight>
				</CardFooter>
			</Card>
		</div>
	);
};
Edit.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	editingItem: PropTypes.object.isRequired,
	// handleStateEdit: PropTypes.function.isRequired,
};

export default Edit;
