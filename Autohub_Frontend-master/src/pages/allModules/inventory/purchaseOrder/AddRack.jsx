// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
// ** apiClient Imports

import moment from 'moment';
import Select from 'react-select';

import PropTypes from 'prop-types';
import apiClient from '../../../../baseURL/apiClient';
import Spinner from '../../../../components/bootstrap/Spinner';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';
// import showNotification from '../../../../components/extras/showNotification';
import { _titleSuccess, _titleError } from '../../../../notifyMessages/erroSuccess';

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

import Button from '../../../../components/bootstrap/Button';

const validate = (values) => {
	const errors = {};
	if (!values.rack_number) {
		errors.rack_number = 'Required';
	}
	return errors;
};

const AddRack = ({ refreshTableData }) => {
	const [state, setState] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [storeOptions, setStoreOptions] = useState([]);
	const [storeOptionsLoading, setStoreOptionsLoading] = useState(false);

	const formik = useFormik({
		initialValues: {
			rack_number: '',
			store_id: '',
		},
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});
	
	useEffect(() => {
		setStoreOptionsLoading(true);
		apiClient
			.get(`/storeDropdown`)
			.then((response) => {
				const rec = response.data.store.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setStoreOptions(rec);
				setStoreOptionsLoading(false);
			})
			.catch((err) => {
				// Handle error
			});
	}, []);

	const handleSave = () => {
		submitForm(formik);
	};

	const submitForm = (myFormik) => {
		apiClient
			.post(`/addRack`, myFormik.values)
			.then((res) => {
				if (res.data.status === 'ok') {
					formik.resetForm();
					setState(false);
					refreshTableData();
					setIsLoading(false);
				} else {
					setIsLoading(false);
					// Handle error
				}
			})
			.catch((err) => {
				setIsLoading(false);
				// Handle error
			});
	};

	return (
		<div className='col-auto'>
			{/* Your modal JSX here */}
		</div>
	);
};

AddRack.propTypes = {
	refreshTableData: PropTypes.func.isRequired,
};

export default AddRack;
