/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import moment from 'moment';

// ** apiClient Imports

import PropTypes from 'prop-types';
// import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

import Spinner from '../../../../components/bootstrap/Spinner';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';
// import Icon from '../../../../components/icon/Icon';
import showNotification from '../../../../components/extras/showNotification';
import { _titleSuccess, _titleError } from '../../../../notifyMessages/erroSuccess';

import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardLabel,
} from '../../../../components/bootstrap/Card';
import apiClient from '../../../../baseURL/apiClient';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import InputGroup from '../../../../components/bootstrap/forms/InputGroup';
import Input from '../../../../components/bootstrap/forms/Input';

import Button from '../../../../components/bootstrap/Button';
import AddModal from './modals/addModal';
import AddMachine from './modals/addMachine';
import AddMake from './modals/addMake';
import AddItem from './modals/addItem';
import PartModel from './modals/partModel';
import AddDimension from './modals/addDimension';
import AddBrand from './modals/addBrand';

const validate = (values) => {
	let errors = {};

	if (!values.number1) {
		errors.number1 = 'Required';
	}
	if (values.from_year && values.to_year) {
		if (values.from_year > values.to_year) {
			errors.from_year = 'Required';
			errors.to_year = 'Required';
		}
	}

	if (!values.machine_model_id) {
		errors.machine_model_id = 'Required';
	}

	// if (!values.machine_part_oem_part.machine_part_id) {
	// 	errors.machine_part_oem_part.machine_part_id = 'Required';
	// }
	if (!values.brand_id) {
		errors.brand_id = 'Required';
	}
	values.dimension?.forEach((data, index) => {
		if (!data.id) {
			errors = {
				...errors,
				[`dimension[${index}]id`]: 'Required!',
			};
		}

		if (!data.pivot.value) {
			errors = {
				...errors,
				[`dimension[${index}]pivot.value`]: 'Required',
			};
		}
	});
	return errors;
};

const Edit = ({ editingItem, handleStateEdit }) => {
	// const [tableData, setTableData] = useState([]);
	// const [tableData2, setTableData2] = useState([]);
	// const [tableDataLoading, setTableDataLoading] = useState(true);

	const [state, setState] = useState(false);

	const [staterefresh, setStateRefresh] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);

	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);

	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);
	const [machineOptions, setMachineOptions] = useState();
	const [machineOptionsLoading, setMachineOptionsLoading] = useState(false);
	const [makeOptions, setMakeOptions] = useState();
	const [makeOptionsLoading, setMakeOptionsLoading] = useState(false);
	const [modelOptions, setModelOptions] = useState();
	const [originOptions, setOriginOptions] = useState();

	const [modelOptionsLoading, setModelOptionsLoading] = useState(false);
	const [itemOptions, setItemOptions] = useState();
	const [itemOptionsLoading, setItemOptionsLoading] = useState(false);
	const [brandOptions, setBrandOptions] = useState();
	const [brandOptionsLoading, setBrandOptionsLoading] = useState(false);
	const [originOptionsLoading, setOriginOptionsLoading] = useState(true);
	const [partModelsOptions, setPartModelsOptions] = useState([]);
	const [partModelsOptionsLoading, setPartModelsOptionsLoading] = useState(false);
	const [dimensionsOptions, setDimensionsOptions] = useState([]);
	const [dimensionsOptionsLoading, setDimensionsOptionsLoading] = useState(true);
	// const [selectedMachine, setSelectedMachine] = useState({
	// 	id: `${0}`,
	// 	label: '',
	// });

	const initialStatus = () => {
		setStaticBackdropStatus(false);
		setScrollableStatus(false);
		setCenteredStatus(false);
		setFullScreenStatus(null);
		setAnimationStatus(true);

		setHeaderCloseStatus(true);
	};


	const customStyles = {
		option: (provided) => ({
			...provided,
			color: 'black !important',
		}),
		singleValue: (provided) => ({
			...provided,
			color: 'black !important',
		}),
	};

	const formik = useFormik({
		initialValues: editingItem,
		// validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});
	const handleSave = () => {
		submitForm(formik.values);
		setLastSave(moment());
	};

	const submitForm = (data) => {
		const vehiclePart = itemOptions?.find(
			(opt) => opt.id === (data.machinePartOemPart?.machine_part_id || data.machine_part_id),
		);
		const brand = brandOptions?.find((opt) => opt.id === data.brand_id);
		const vehiclePartName = vehiclePart?.label || '';
		const oemNumber = data.machinePartOemPart?.number1 || '';
		const brandName = brand?.label || '';
		const partNumber = data.machinePartOemPart?.number2 || '';

		const newName = `${vehiclePartName}/${oemNumber}/${brandName}/${partNumber}`;
		const payload = { ...data, name: newName };

		// console.log(data, 'data');
		apiClient
			.post(`/updateModelItemOem`, payload)
			.then((res) => {
				if (res.data.status === 'ok') {
					formik.resetForm();
					// showNotification(_titleSuccess, res.data.message, 'success');
					setState(false);
					handleStateEdit(false);
					setIsLoading(false);
				} else {
					setIsLoading(false);
					// showNotification(_titleError, res.data.message, 'Danger');
				}
			})
			.catch((err) => {
				setIsLoading(false);
				// showNotification(_titleError, err.message, 'Danger');

				setIsLoading(false);
			});
	};

	useEffect(() => {
		setModelOptionsLoading(true);

		apiClient
			.get(
				`/getMachineModelsDropDown?machine_id=${formik.values.machine_id ? formik.values.machine_id : ''
				}&make_id=${formik.values.make_id ? formik.values.make_id : ''}`,
			)
			.then((response) => {
				const rec = response.data.machineModels.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setModelOptions(rec);
				setModelOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');/
				}
			});
	}, [formik.values.machine_id, formik.values.make_id]);
	const getMachine_part_model_id_on_machine_part_id = () => {
		// console.log(formik.values.machine_part_id, 'three');

		if (formik.values.machine_part_id) {
			// console.log(formik.values.machine_part_id, 'four');

			setPartModelsOptionsLoading(true);

			apiClient
				.get(
					`/getMachinePartsModelsDropDown?machine_part_id=${formik.values.machine_part_id ? formik.values.machine_part_id : ''
					}`,
				)
				.then((response) => {
					const rec = response.data.machinepartmodel?.map(({ id, name }) => ({
						id,
						value: id,
						label: name,
					}));
					setPartModelsOptions(rec);
					setPartModelsOptionsLoading(false);
				})
				// eslint-disable-next-line no-console
				.catch((err) => {
					// showNotification(_titleError, err.message, 'Danger');
					if (err.response.status === 401) {
						// showNotification(_titleError, err.response.data.message, 'Danger');
					}
				});
		} else {
			setPartModelsOptions([]);
		}
	};
	useEffect(() => {
		getMachine_part_model_id_on_machine_part_id();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.machine_part_id]);
	const removeDimensionsRow = (i) => {
		formik.setFieldValue('dimensions', [
			...formik.values.dimensions.slice(0, i),
			...formik.values.dimensions.slice(i + 1),
		]);

	};
	const removealternativeBrandsRow = (i) => {
		formik.setFieldValue('alternativeBrands', [
			...formik.values.alternativeBrands.slice(0, i),
			...formik.values.alternativeBrands.slice(i + 1),
		]);
	};
	useEffect(() => {
		refreshDropdowns();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const refreshDropdowns = () => {
		setOriginOptionsLoading(true);
		setDimensionsOptionsLoading(true);
		setMachineOptionsLoading(true);
		setMakeOptionsLoading(true);
		// setPartModelsOptionsLoading(true);
		setBrandOptionsLoading(true);

		apiClient
			.get(`/getDropDownsOptionsForItemPartsAdd`)
			.then((response) => {
				const rec = response.data.machines.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setMachineOptions(rec);
				setMachineOptionsLoading(false);
				const rec2 = response.data.machine_Parts.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setItemOptions(rec2);
				setItemOptionsLoading(false);
				const rec3 = response.data.dimensions.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setDimensionsOptions(rec3);
				setDimensionsOptionsLoading(false);
				const rec4 = response.data.makes.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setMakeOptions(rec4);
				setMakeOptionsLoading(false);
				const rec5 = response.data.origin.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setOriginOptions(rec5);
				setOriginOptionsLoading(false);
				// const rec6 = response.data.machinepartmodel?.map(({ id, name }) => ({
				// 	id,
				// 	value: id,
				// 	label: name,
				// }));
				// setPartModelsOptions(rec6);
				// setPartModelsOptionsLoading(false);
				const rec7 = response.data.companies.map(({ id, name }) => ({
					id,
					company_id: id,
					value: id,
					label: name,
				}));
				setBrandOptions(rec7);
				// const rec8 = response.data.companies.map(({ id, name }) => ({
				// 	id,
				// 	company_id: id,
				// 	value: id,
				// 	label: name,
				// 	number1: '',
				// 	number2: '',
				// 	number3: '',
				// 	number4: '',
				// }));
				// formik.setFieldValue('rows', rec8);
				setBrandOptionsLoading(false);
			})

			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
			});

		// console.log(formik.values.machine_part_id, 'one');
		if (formik.values.machine_part_id) {
			// console.log(formik.values.machine_part_id, 'two');

			setPartModelsOptionsLoading(true);

			getMachine_part_model_id_on_machine_part_id();
		}
	};


	// eslint-disable-next-line no-console
	console.log('dimensionsOptions', dimensionsOptions);


	return (
		<div className='col-12'>
			<Card stretch tag='form' onSubmit={formik.handleSubmit}>
				<CardBody>
					<div className='row g-4 '>
						<div className='col-md-3'>
							<FormGroup label='Machine' id='machine_id'>
								<InputGroup>
									<Select
										className='col-md-10'
										classNamePrefix='select'
										options={machineOptions}
										isLoading={machineOptionsLoading}
										isMulti
										isClearable
										value={
											formik.values?.machine_id
												? machineOptions?.filter(option =>
													formik.values?.machine_id.some(id => id === option.id)
												)
												: []
										}
										onChange={(selectedOptions) => {
											formik.setFieldValue(
												'machine_id',
												selectedOptions ? selectedOptions.map(option => option.id) : []
											);
										}}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.machine_id}
										invalidFeedback={formik.errors.machine_id}
										validFeedback='Looks good!'
										styles={customStyles}
									/>




									<AddMachine refreshDropdowns={refreshDropdowns} />
								</InputGroup>
							</FormGroup>

							{formik.errors.machine_id && (
								// <div className='invalid-feedback'>
								<p
									style={{
										color: 'red',
									}}>
									{formik.errors.machine_id}
								</p>
							)}
						</div>

						<div className='col-md-3'>
							<FormGroup label='Make' id='make_id'>
								<InputGroup>
									<Select
										className='col-md-10'
										classNamePrefix='select'
										options={makeOptions}
										isLoading={makeOptionsLoading}
										isMulti
										isClearable
										value={
											formik.values?.make_id
												? makeOptions?.filter(option =>
													formik.values?.make_id.some(id => id === option.id)
												)
												: []
										}


										onChange={(selectedOptions) => {
											formik.setFieldValue(
												'make_id',
												selectedOptions ? selectedOptions.map(option => option.id) : []
											);
										}}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.make_id}
										invalidFeedback={formik.errors.make_id}
										validFeedback='Looks good!'
										styles={customStyles}
									/>




									<AddMake refreshDropdowns={refreshDropdowns} />
								</InputGroup>
							</FormGroup>
							{formik.errors.make_id && (
								// <div className='invalid-feedback'>
								<p
									style={{
										color: 'red',
									}}>
									{formik.errors.make_id}
								</p>
							)}
						</div>
						<div className='col-md-3'>
							<FormGroup label='Model' id='machine_model'>
								<InputGroup>
									<Select
										className='col-md-10'
										classNamePrefix='select'
										options={modelOptions}
										isLoading={modelOptionsLoading}
										isMulti
										isClearable
										value={
											formik.values?.machine_model
												? modelOptions?.filter(option =>
													formik.values?.machine_model.some(id => id === option.id)
												)
												: []
										}
										onChange={(selectedOptions) => {
											formik.setFieldValue(
												'machine_model',
												selectedOptions ? selectedOptions.map(option => option.id) : []
											);
										}}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.machine_model}
										invalidFeedback={formik.errors.machine_model}
										validFeedback='Looks good!'
										styles={customStyles}
									/>



									<AddModal refreshDropdowns={refreshDropdowns} />
								</InputGroup>
							</FormGroup>
							{formik.errors.machine_model_id && (
								// <div className='invalid-feedback'>
								<p
									style={{
										color: 'red',
									}}>
									{formik.errors.machine_model_id}
								</p>
							)}
						</div>
						<div className='col-md-3'>
							<FormGroup label='Origin' id='origin_id'>
								<InputGroup>
									<Select
										className='col-md-10'
										classNamePrefix='select'
										options={originOptions}
										isLoading={originOptionsLoading}
										isClearable
										value={
											formik.values.origin_id
												? originOptions?.find(
													(c) => c.value === formik.values.origin_id,
												)
												: null
										}
										onChange={(val) => {
											formik.setFieldValue(
												'origin_id',
												val !== null && val.id,
											);
										}}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.origin_id}
										invalidFeedback={formik.errors.origin_id}
										validFeedback='Looks good!'
										styles={customStyles}
									/>
								</InputGroup>
							</FormGroup>
							{formik.errors.origin_id && (
								// <div className='invalid-feedback'>
								<p
									style={{
										color: 'red',
									}}>
									{formik.errors.origin_id}
								</p>
							)}
						</div>
					</div>
					<div className='row g-4'>
						<div className='col-md-3'>
							<FormGroup label='Brand' id='brand_id'>
								<InputGroup>
									<Select
										className='col-md-10'
										classNamePrefix='select'
										options={brandOptions}
										isLoading={brandOptionsLoading}
										isClearable
										value={
											formik.values.brand_id
												? brandOptions?.find(
													(c) => c.value === formik.values.brand_id,
												)
												: null
										}
										onChange={(val) => {
											formik.setFieldValue(
												'brand_id',
												val !== null && val.id,
											);
										}}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.brand_id}
										invalidFeedback={formik.errors.brand_id}
										validFeedback='Looks good!'
										styles={customStyles}
									/>
									<AddBrand refreshDropdowns={refreshDropdowns} />
								</InputGroup>
							</FormGroup>
							{formik.errors.brand_id && (
								// <div className='invalid-feedback'>
								<p
									style={{
										color: 'red',
									}}>
									{formik.errors.brand_id}
								</p>
							)}
						</div>
						<div className='col-md-3'>
							<FormGroup label='Vehicle Part' id='machine_part_id'>
								<InputGroup>
									<Select
										className='col-md-10'
										classNamePrefix='select'
										options={itemOptions}
										isLoading={itemOptionsLoading}
										isClearable
										value={
											formik.values.machinePartOemPart.machine_part_id
												? itemOptions?.find(
													(c) =>
														c.value ===
														formik.values.machinePartOemPart.machine_part_id,
												)
												: null
										}

										onChange={(val) => {
											formik.setFieldValue(
												'machine_part_id',
												val !== null && val.id,
											);
											formik.setFieldValue('machine_part_model_id', '');
										}}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.machine_part_id}
										invalidFeedback={formik.errors.machine_part_id}
										validFeedback='Looks good!'
										styles={customStyles}
									/>
									<AddItem refreshDropdowns={refreshDropdowns} />
								</InputGroup>
							</FormGroup>
							{formik.errors.machine_part_id && (
								// <div className='invalid-feedback'>
								<p
									style={{
										color: 'red',
									}}>
									{formik.errors.machine_part_id}
								</p>
							)}
						</div>

						{/* <div className='col-md-3'>
							<FormGroup id='machine_part_model_id' label='Part Model'>
								<InputGroup>
									<Select
										className='col-md-10'
										isLoading={partModelsOptionsLoading}
										options={partModelsOptions}
										isClearable
										value={
											formik.values.machine_part_model_id
												? partModelsOptions?.find(
													(c) =>
														c.value ===
														formik.values.machine_part_model_id,
												)
												: null
										}
										onChange={(val) => {
											formik.setFieldValue(
												'machine_part_model_id',
												val ? val.id : '',
											);

											// getSubCategoriesByCategory(val.id);
										}}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										validFeedback='Looks good!'
										styles={customStyles}
									/>
									<PartModel
										refreshDropdowns={refreshDropdowns}
										itemOptions={itemOptions}
									/>
								</InputGroup>
							</FormGroup>
							{formik.errors.machine_part_model_id && (
								// <div className='invalid-feedback'>
								<p
									style={{
										color: 'red',
									}}>
									{formik.errors.machine_part_model_id}
								</p>
							)}
						</div> */}
						<div className='col-md-3'>
							<div className='row'>
								<div className='col-md-6'>
									<FormGroup label='From' id='from_year'>
										<Datetime
											dateFormat='YYYY'
											timeFormat={false}
											// open
											// input={false}
											value={formik.values.from_year}
											onChange={(date) => {
												formik.setFieldValue(
													'from_year',
													moment(date, 'YYYY', true).isValid()
														? // moment('Decimal128', 'YYYY').isValid()
														moment(date).format('YYYY')
														: '',
												);
											}}

										/>
									</FormGroup>

									{formik.errors.from_year && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors.from_year}
										</p>
									)}
								</div>
								<div className='col-md-6'>
									<FormGroup label='To' id='to_year'>
										<Datetime
											dateFormat='YYYY'
											timeFormat={false}
											// open
											// input={false}
											value={formik.values.to_year}
											onChange={(date) => {
												formik.setFieldValue(
													'to_year',
													moment(date, 'YYYY', true).isValid()
														? // moment('Decimal128', 'YYYY').isValid()
														moment(date).format('YYYY')
														: '',
												);
											}}
										/>
									</FormGroup>

									{formik.errors.to_year && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors.to_year}
										</p>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className='row d-flex justify-content-center align-items-center mt-2'>
						<div className='col-md-3'>
							<FormGroup id='number1' label='OEM Number' className='col-md-12'>
								<Input
									name="machinePartOemPart.number1"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.machinePartOemPart?.number1}
									isValid={formik.isValid}
									isTouched={formik.touched.machinePartOemPart?.number1}
									invalidFeedback={formik.errors.machinePartOemPart?.number1}
									validFeedback='Looks good!'
								/>
							</FormGroup>
						</div>
						<div className='col-md-3'>
							<FormGroup id='number2' label='Part number' className='col-md-12'>
								<Input
									name="machinePartOemPart.number2"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.machinePartOemPart?.number2}
									isValid={formik.isValid}
									isTouched={formik.touched.machinePartOemPart?.number2}
									invalidFeedback={formik.errors.machinePartOemPart?.number2}
									validFeedback='Looks good!'
								/>
							</FormGroup>
						</div>

						{/* <div className='col-md-3'>
							<FormGroup id='number3' label='Tertiary' className='col-md-12'>
								<Input
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.number3}
									isValid={formik.isValid}
									isTouched={formik.touched.number3}
									invalidFeedback={formik.errors.number3}
									validFeedback='Looks good!'
								/>
							</FormGroup>
						</div>
						<div className='col-md-3'>
							<FormGroup id='number4' label='Quaternary' className='col-md-12'>
								<Input
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.number4}
									isValid={formik.isValid}
									isTouched={formik.touched.number4}
									invalidFeedback={formik.errors.number4}
									validFeedback='Looks good!'
								/>
							</FormGroup>
						</div> */}
					</div>
					<br />
					<div className='row d-flex justify-content-center'>
						<div className='col-md-8'>
							<table className='table  text-center '>
								<thead>
									<tr className='row'>
										<th className='col-md-6'>Dimension</th>
										<th className='col-md-4'>Value</th>
										<th className='col-md-2'>Remove</th>
									</tr>
								</thead>
								<tbody>
									{formik.values?.dimensions?.map((item, index) => (
										<tr className='row' key={item.id}>
											<td className='col-md-6'>
												<FormGroup
													label=''
													id={`dimensions[${index}].dimension_id`}>
													<Select
														className='col-md-12'
														classNamePrefix='select'
														options={dimensionsOptions}
														isLoading={dimensionsOptionsLoading}
														isClearable
														value={
															formik.values.dimensions[index]
																.dimension_id
																? dimensionsOptions.find(
																	(c) =>
																		c.value ===
																		formik.values
																			.dimensions[index]
																			.dimension_id,
																)
																: null
														}
														onChange={(val) => {
															formik.setFieldValue(
																`dimensions[${index}].dimension_id`,
																val !== null &&
																val.id,
															);
														}}
														isValid={formik.isValid}
														isTouched={formik.touched.dimensions}
														invalidFeedback={
															formik.errors[
															`dimensions[${index}].dimension_id`
															]
														}
														styles={customStyles}
													/>
												</FormGroup>
												{formik.errors[
													`dimensions[${index}]dimension_id`
												] && (
														<p
															style={{
																color: 'red',
																textAlign: 'center',
																marginTop: 3,
															}}>
															{
																formik.errors[
																`dimensions[${index}]dimension_id`
																]
															}
														</p>
													)}
											</td>
											<td className='col-md-4'>
												<FormGroup id='value'>
													<Input
														type='number'
														onChange={(val) => {
															formik.setFieldValue(
																`dimensions[${index}].value`,
																val.target.value,
															);
														}}

														isTouched
														invalidFeedback={
															formik.errors[
															`dimensions[${index}]value`
															]
														}
														value={item.value}
													/>
												</FormGroup>
											</td>
											<td className='col-md-2'>
												<Button
													// isDisable={
													// 	formik.values.dimensions.length ===
													// 	1
													// }
													icon='cancel'
													color='danger'
													onClick={() => removeDimensionsRow(index)}
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
					<div className='row d-flex justify-content-center align-items-center mt-2'>
						<Button
							color='primary'
							icon='add'
							className='col-md-3'
							onClick={() => {
								formik.setFieldValue('dimensions', [
									...formik.values.dimensions,
									{
										value: 0,
										dimension_id: '',
									},
								]);
							}}>
							Add New Dimension
						</Button>
						<AddDimension refreshDropdowns={refreshDropdowns} />
					</div>


					<div className='row d-flex justify-content-center'>
						<div className='col-md-8'>
							<table className='table  text-center '>
								<thead>
									<tr className='row'>
										<th className='col-md-5'>Brand</th>
										<th className='col-md-2'>Part Number</th>
										<th className='col-md-2'>Remove</th>
									</tr>
								</thead>
								<tbody>
									{formik.values.alternativeBrands?.map(
										(item, index) => (
											<tr className='row' key={item.index}>
												<td className='col-md-5'>
													<FormGroup
														label=''
														id={`childArray[${index}].brands_id`}>
														<Select
															className='col-md-10'
															classNamePrefix='select'
															options={brandOptions}
															isLoading={
																brandOptionsLoading
															}
															isClearable
															value={
																formik.values
																	.alternativeBrands[
																	index
																].brands_id
																	? brandOptions?.find(
																		(c) =>
																			c.value ===
																			formik
																				.values
																				.alternativeBrands[
																				index
																			]
																				.brands_id,
																	)
																	: null
															}
															onChange={(val) => {
																formik.setFieldValue(
																	`alternativeBrands[${index}].brands_id`,
																	val !== null &&
																	val.id,
																);
															}}
															onBlur={formik.handleBlur}
															isValid={formik.isValid}
															isTouched={
																formik.touched.brands_id
															}
															invalidFeedback={
																formik.errors[
																`alternativeBrands[${index}].brands_id`
																]
															}
															validFeedback='Looks good!'
															styles={customStyles}
														/>
													</FormGroup>
													{formik.errors[
														`alternativeBrands[${index}]brands_id`
													] && (
															<p
																style={{
																	color: 'red',
																	textAlign: 'center',
																	marginTop: 3,
																}}>
																{
																	formik.errors[
																	`alternativeBrands[${index}]brands_id`
																	]
																}
															</p>
														)}
												</td>
												{/* <td className='col-md-2'>
																<FormGroup id='number1'>
																	<Input
																		// type='text'
																		onChange={(val) => {
																			formik.setFieldValue(
																				`brands_id[${index}].number1`,
																				val.target.value,
																			);
																		}}
																		value={item.value}
																		// />
																		// onChange={
																		// 	formik.handleChange
																		// }

																		onBlur={formik.handleBlur}
																		// value={
																		// 	formik.values.number1
																		// }
																		isValid={formik.isValid}
																		isTouched={
																			formik.touched.number1
																		}
																		invalidFeedback={
																			formik.errors[
																				`brands_id[${index}]number1`
																			]
																		}
																		validFeedback='Looks good!'
																	/>
																</FormGroup>
															</td> */}
												<td className='col-md-2'>
													<FormGroup id='number3'>
														<Input
															// type='number'
															onChange={(val) => {
																formik.setFieldValue(
																	`alternativeBrands[${index}].number3`,
																	val.target.value,
																);
															}}
															// onChange={formik.handleChange}
															isTouched
															invalidFeedback={
																formik.errors[
																`alternativeBrands[${index}]number3`
																]
															}
															value={item.number3}
														/>
													</FormGroup>
												</td>
												<td className='col-md-2'>
													<Button
														// isDisable={
														// 	formik.values.dimensions.length ===
														// 	1
														// }
														icon='cancel'
														color='danger'
														onClick={() => removealternativeBrandsRow(index)}
													/>
												</td>
											</tr>
										),
									)}
								</tbody>
							</table>
						</div>
					</div>
					<div className='row d-flex justify-content-center align-items-center mt-2'>
						<Button
							color='primary'
							icon='add'
							className='col-md-3'
							onClick={() => {
								formik.setFieldValue('alternativeBrands', [
									...formik.values.alternativeBrands,
									{
										brands_id: '',
										number3: '',
									},
								]);
							}}>
							Add Alternate Brand
						</Button>
						{/* <AddDimension refreshDropdowns={refreshDropdowns} /> */}
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
							icon={isLoading ? null : 'Save'}
							isLight
							color='success'
							isDisable={isLoading}
							onClick={formik.handleSubmit}>
							{isLoading && <Spinner isSmall inButton />}
							{isLoading ? 'Saving' : 'Save'}
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
};

export default Edit;
