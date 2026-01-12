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
import { TagsInput } from 'react-tag-input-component';

// ** apiClient Imports

import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
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
import Icon from '../../../../components/icon/Icon';
// import showNotification from '../../../../components/extras/showNotification';
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
import AddBrand from './modals/addBrand';
import AddOrigin from './modals/addOrigin';
import AddDimension from './modals/addDimension';

const validate = (values) => {
	let errors = {};

	if (!values.number1) {
		errors.number1 = 'Required';
	}

	if (!values.machine_model_id) {
		errors.machine_model_id = 'Required';
	}
	if (values.from_year && values.to_year) {
		if (values.from_year > values.to_year) {
			errors.from_year = 'From Date should be less than To Date';
			errors.to_year = 'To Date should be greater than From Date';
		}
	}

	if (!values.machine_part_id) {
		errors.machine_part_id = 'Required';
	}
	if (!values.brand_id) {
		errors.brand_id = 'Required';
	}
	values.dimensions.forEach((data, index) => {
		if (!data.dimension_id) {
			errors = {
				...errors,
				[`dimensions[${index}]dimension_id`]: 'Required!',
			};
		}

		if (!data.value) {
			errors = {
				...errors,
				[`dimensions[${index}]value`]: 'Required',
			};
		}
	});
	return errors;
};

const Add = ({ refreshTableData }) => {
	const [counter, setCounter] = useState(0);
	const [tableData, setTableData] = useState([]);
	const [tableData2, setTableData2] = useState([]);
	const [tableDataLoading, setTableDataLoading] = useState(true);

	const [state, setState] = useState(false);
	const [brandOptions, setBrandOptions] = useState();

	const [isLoading, setIsLoading] = useState(false);

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

	const [itemOptions1, setItemOptions1] = useState([]);
	const [itemOptions1Loading, setItemOptions1Loading] = useState(false);

	const [brandOptionsLoading, setBrandOptionsLoading] = useState(false);
	const [originOptionsLoading, setOriginOptionsLoading] = useState(true);
	const [partModelsOptions, setPartModelsOptions] = useState([]);
	const [partModelsOptionsLoading, setPartModelsOptionsLoading] = useState(false);
	const [dimensionsOptions, setDimensionsOptions] = useState([]);
	const [dimensionsOptionsLoading, setDimensionsOptionsLoading] = useState(true);

	const [selectedRack, setSelectedRack] = useState([]);
	const [selectedShelf, setSelectedShelf] = useState([]);
	// const [selectedMachine, setSelectedMachine] = useState({
	// 	id: `${0}`,
	// 	label: '',
	// });

	
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
	const initialStatus = () => {
		setStaticBackdropStatus(false);
		setScrollableStatus(false);
		setCenteredStatus(false);
		setFullScreenStatus(null);
		setAnimationStatus(true);

		setHeaderCloseStatus(true);
	};

	const formik = useFormik({
		initialValues: {
			number2: '',
			number1: '',
			machine_id: '',
			make_id: '',
			machine_model_id: '',
			brand_id: '',
			origin_id: '',
			machine_part_id: '',
			machine_part_model_id: '',
			number3: '',
			number4: '',
			from_year: '',
			// rack_number: [],
			// shelf_number: [],
			to_year: '',
			rows: [],
			dimensions: [],
			alternateParts: [],
			alternativeBrands: [],
		},
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});
	const handleSave = () => {
		submitForm(formik.values);
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
				console.log(response.data.companies, 'jjjjjjj');

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

				setBrandOptionsLoading(false);
			})

			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
			});
		if (formik.values.machine_part_id) {
			// console.log(formik.values.machine_part_id, 'two');

			setPartModelsOptionsLoading(true);

			getMachine_part_model_id_on_machine_part_id();
		}
	};
	useEffect(() => {
		refreshDropdowns1();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const refreshDropdowns1 = () => {
		setItemOptions1(true);

		apiClient
			.get(
				`/getItemOemDropDown?category_id=${
					formik.values.category_id ? formik.values.category_id : ''
				}&sub_category_id=${
					formik.values.sub_category_id ? formik.values.sub_category_id : ''
				}&item_id=${
					formik.values.machine_part_id ? formik.values.machine_part_id : ''
				}&part_model_id=${formik.values.part_model_id ? formik.values.part_model_id : ''}`,
			)
			.then((response) => {
				console.log(response);

				const rec1 = response.data.data.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));

				setItemOptions1(rec1);
				setItemOptions1Loading(false);
			});
	};

	const submitForm = (myFormik) => {
		apiClient
			.post(`/addModelItemOem`, myFormik)
			.then((res) => {
				if (res.data.status === 'ok') {
					formik.resetForm();
					// showNotification(_titleSuccess, res.data.message, 'success');
					setState(false);
					refreshTableData();
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
		if (formik.values.machine_id && formik.values.make_id) {
			setModelOptionsLoading(true);

			apiClient
				.get(
					`/getMachineModelsDropDown?machine_id=${
						formik.values.machine_id ? formik.values.machine_id : ''
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
						// showNotification(_titleError, err.response.data.message, 'Danger');
					}
				});
		}
	}, [formik.values.machine_id, formik.values.make_id, counter]);
	const getMachine_part_model_id_on_machine_part_id = () => {
		// formik.setFieldValue('machine_part_model_id', '');
		if (formik.values.machine_part_id || formik.values.make_id) {
			console.log(formik.values.machine_part_id, 'four');

			setPartModelsOptionsLoading(true);

			apiClient
				.get(
					`/getMachinePartsModelsDropDown?machine_part_id=${
						formik.values.machine_part_id ? formik.values.machine_part_id : ''
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
		formik.setFieldValue('machine_part_model_id', '');
		getMachine_part_model_id_on_machine_part_id();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.machine_part_id]);
	const removeRow = (i) => {
		formik.setFieldValue('dimensions', [
			...formik.values.dimensions.slice(0, i),
			...formik.values.dimensions.slice(i + 1),
		]);
		formik.setFieldValue('alternateParts', [
			...formik.values.alternateParts.slice(0, i),
			...formik.values.alternateParts.slice(i + 1),
		]);
		formik.setFieldValue('alternativeBrands', [
			...formik.values.alternativeBrands.slice(0, i),
			...formik.values.alternativeBrands.slice(i + 1),
		]);
	};

	useEffect(() => {
		// Create a style element
		const style = document.createElement('style');
		style.innerHTML = `
		  .rdtPicker td,
		  .rdtPicker th {
			color: black !important;
		  }
		`;
		// Append the style element to the head
		document.head.appendChild(style);
	
		// Clean up by removing the style element on component unmount
		return () => {
		  document.head.removeChild(style);
		};
	  }, []);
	
	return (
		<div className='col-auto'>
			<div className='col-auto'>
				<Button
					color='danger'
					isLight
					icon='Add'
					hoverShadow='default'
					onClick={() => {
						initialStatus();

						setState(true);

						setStaticBackdropStatus(true);
					}}>
					Add New
				</Button>
			</div>

			<Modal
				isOpen={state}
				setIsOpen={setState}
				titleId='exampleModalLabel'
				isStaticBackdrop={staticBackdropStatus}
				isScrollable={scrollableStatus}
				isCentered={centeredStatus}
				size='xl'
				fullScreen={fullScreenStatus}
				isAnimation={animationStatus}>
				<ModalHeader setIsOpen={headerCloseStatus ? setState : null}>
					<CardLabel icon='Add'>
						<ModalTitle id='exampleModalLabel'>Add Item Part</ModalTitle>
					</CardLabel>
				</ModalHeader>
				<ModalBody>
					<div className='col-12'>
						<Card stretch tag='form' onSubmit={formik.handleSubmit}>
							<CardBody>
								<div className='row g-4 '>
									<div className='col-md-3'>
										<FormGroup label='Make' id='make_id'>
											<InputGroup>
												<Select
													className='col-md-10'
													classNamePrefix='select'
													options={makeOptions}
													isMulti
													isLoading={makeOptionsLoading}
													isClearable
													value={
														formik.values.make_id
															? makeOptions?.filter((c) =>
																	formik.values.make_id.some(
																		(selectedId) =>
																			selectedId === c.value,
																	),
															  )
															: null
													}
													onChange={(selectedOptions) => {
														formik.setFieldValue(
															'make_id',
															selectedOptions
																? selectedOptions.map(
																		(option) => option.id,
																  )
																: [],
														);

														// Clear machine_model_id when make_id changes
														formik.setFieldValue('make_model_id', ''); // Clear machine_model_id when make_id changes

														if (
															!selectedOptions ||
															selectedOptions.length === 0
														) {
															formik.setFieldValue(
																'make_id',
																'make_name',
																[],
															);
														}
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
											<p
												style={{
													color: 'red',
												}}>
												{formik.errors.make_id}
											</p>
										)}
									</div>

									<div className='col-md-3'>
										<FormGroup label='Machine' id='machine_id'>
											<InputGroup>
												<Select
													className='col-md-10'
													classNamePrefix='select'
													options={machineOptions}
													isMulti
													isLoading={machineOptionsLoading}
													isClearable
													value={
														formik.values.machine_id
															? machineOptions?.filter((c) =>
																	formik.values.machine_id.some(
																		(selectedId) =>
																			selectedId === c.value,
																	),
															  )
															: null
													}
													onChange={(selectedOptions) => {
														formik.setFieldValue(
															'machine_id',
															selectedOptions
																? selectedOptions.map(
																		(option) => option.id,
																  )
																: [],
														);
														// formik.setFieldValue(
														// 	'machine_id',
														// 	'',
														// ); // Clear machine_model_id when machine_id changes
														if (
															!selectedOptions ||
															selectedOptions.length === 0
														) {
															formik.setFieldValue('machine_id', []);
														}
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
											<p
												style={{
													color: 'red',
												}}>
												{formik.errors.machine_id}
											</p>
										)}
									</div>

									<div className='col-md-3'>
										<FormGroup label='Model' id='machine_model_id'>
											<InputGroup>
												<Select
													className='col-md-10'
													classNamePrefix='select'
													options={modelOptions}
													isMulti
													isLoading={modelOptionsLoading}
													isClearable
													value={
														formik.values.machine_model_id
															? modelOptions?.filter((c) =>
																	formik.values.machine_model_id.some(
																		(selectedId) =>
																			selectedId === c.value,
																	),
															  )
															: null
													}
													onChange={(selectedOptions) => {
														formik.setFieldValue(
															'machine_model_id',
															selectedOptions
																? selectedOptions.map(
																		(option) => option.id,
																  )
																: [],
														);

														// Clear machine_model_id only when no options are selected
														if (
															!selectedOptions ||
															selectedOptions.length === 0
														) {
															formik.setFieldValue(
																'machine_model_id',
																[],
															);
														}
													}}
													onBlur={formik.handleBlur}
													isValid={formik.isValid}
													isTouched={formik.touched.machine_model_id}
													invalidFeedback={formik.errors.machine_model_id}
													validFeedback='Looks good!'
													styles={customStyles}
												/>

												<AddModal
													counter={counter}
													setCounter={setCounter}
													refreshDropdowns={refreshDropdowns}
													machineOptions={machineOptions}
													makeOptions={makeOptions}
												/>
											</InputGroup>
										</FormGroup>

										{formik.errors.machine_model_id && (
											<p style={{ color: 'red' }}>
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
																	(c) =>
																		c.value ===
																		formik.values.origin_id,
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
												<AddOrigin refreshDropdowns={refreshDropdowns} />
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
																	(c) =>
																		c.value ===
																		formik.values.brand_id,
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
														formik.values.machine_part_id
															? itemOptions?.find(
																	(c) =>
																		c.value ===
																		formik.values
																			.machine_part_id,
															  )
															: null
													}
													onChange={(val) => {
														formik.setFieldValue(
															'machine_part_id',
															val !== null && val.id,
														);
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
																		formik.values
																			.machine_part_model_id,
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
											<div className='col-md-6' >
												<FormGroup label='From' id='from_year' >
													<Datetime
														dateFormat='YYYY'
														timeFormat={false}
														value={formik.values.from_year}
														onChange={(date) => {
															formik.setFieldValue(
																'from_year',
																moment(date, 'YYYY', true).isValid()
																	? moment(date).format('YYYY')
																	: '',
															);
														}}
													
													
													/>
												</FormGroup>

												{formik.errors.from_year && (
													<p style={{ color: 'red' }}>
														{formik.errors.from_year}
													</p>
												)}
											</div>

											<div className='col-md-6' >
												<FormGroup label='To' id='to_year' >
													<Datetime
														dateFormat='YYYY'
														timeFormat={false}
														value={formik.values.to_year}
														onChange={(date) => {
															formik.setFieldValue(
																'to_year',
																moment(date, 'YYYY', true).isValid()
																	? moment(date).format('YYYY')
																	: '',
															);
														}}
													
													/>
												</FormGroup>

												{formik.errors.to_year && (
													<p style={{ color: 'red' }}>
														{formik.errors.to_year}
													</p>
												)}
											</div>
										</div>
									</div>
									{/* <div className='col-md-6'>
										<div className='row'>
											<div className='col-md-6'>
												<FormGroup label='Rack' id='rack_number'>
													<TagsInput
														value={formik.values.rack_number} // Use formik.values directly
														onChange={(values) => {
															formik.setFieldValue(
																'rack_number',
																values,
															);
														}}
														name='Rack'
														placeHolder='Enter Rack..'
													/>
												</FormGroup>
											</div>

											<div className='col-md-6'>
												<FormGroup label='Shelf' id='shelf_number'>
												<TagsInput
														value={formik.values.shelf_number} // Use formik.values directly
														onChange={(values) => {
															formik.setFieldValue(
																'shelf_number',
																values,
															);
														}}
														name='Shelf'
														placeHolder='Enter Shelf..'
													/>
												</FormGroup>

												{formik.errors.shelf_number && (
													<p style={{ color: 'red' }}>
														{formik.errors.shelf_number}
													</p>
												)}
											</div>
										</div>
									</div> */}
								</div>
								<div className='row d-flex justify-content-center align-items-center mt-2'>
									<div className='col-md-3'>
										<FormGroup
											id='number1'
											label='OEM Number'
											className='col-md-12'>
											<Input
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.number1}
												isValid={formik.isValid}
												isTouched={formik.touched.number1}
												invalidFeedback={formik.errors.number1}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
									<div className='col-md-3'>
										<FormGroup
											id='number2'
											label='Part Number'
											className='col-md-12'>
											<Input
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.number2}
												isValid={formik.isValid}
												isTouched={formik.touched.number2}
												invalidFeedback={formik.errors.number2}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>

									{/* <div className='col-md-3'>
										<FormGroup
											id='number3'
											label='Tertiary'
											className='col-md-12'>
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
										<FormGroup
											id='number4'
											label='Quaternary'
											className='col-md-12'>
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
												{formik.values.dimensions.map((item, index) => (
													<tr className='row' key={item.id}>
														<td className='col-md-6'>
															<FormGroup
																label=''
																id={`dimensions[${index}].dimension_id`}>
																<Select
																	className='col-md-12'
																	classNamePrefix='select'
																	options={dimensionsOptions}
																	isLoading={
																		dimensionsOptionsLoading
																	}
																	isClearable
																	value={
																		formik.values.dimensions[
																			index
																		].dimension_id
																			? dimensionsOptions.find(
																					(c) =>
																						c.value ===
																						formik
																							.values
																							.dimensions[
																							index
																						]
																							.dimension_id,
																			  )
																			: null
																	}
																	onChange={(val) => {
																		formik.setFieldValue(
																			`dimensions[${index}].dimension_id`,
																			val !== null && val.id,
																		);
																	}}
																	isValid={formik.isValid}
																	isTouched={
																		formik.touched.dimensions
																	}
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
																	type='text'
																	onChange={(val) => {
																		const alphanumericValue =
																			val.target.value.replace(
																				/[^a-zA-Z0-9]/g,
																				'',
																			); // Filter out non-alphanumeric characters
																		formik.setFieldValue(
																			`dimensions[${index}].value`,
																			alphanumericValue,
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
																onClick={() => removeRow(index)}
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

								{/* <div className='row d-flex justify-content-center'>
									<div className='col-md-8'>
										<table className='table  text-center '>
											<thead>
												<tr className='row'>
													<th className='col-md-5'>Alternate Part</th>
													<th className='col-md-2'>Remove</th>
												</tr>
											</thead>
											<tbody>
												{formik.values.alternateParts.map(
													(item, index) => (
														<tr className='row' key={item.index}>
															<td className='col-md-5'>
																<FormGroup
																	label=''
																	id={`childArray[${index}].brand_id`}>
																	<Select
																		className='col-md-10'
																		classNamePrefix='select'
																		options={itemOptions1}
																		isLoading={
																			itemOptions1Loading
																		}
																		isClearable
																		value={
																			formik.values
																				.alternateParts[
																				index
																			].items_id
																				? itemOptions1.find(
																						(c) =>
																							c.value ===
																							formik
																								.values
																								.alternateParts[
																								index
																							]
																								.items_id,
																				  )
																				: null
																		}
																		onChange={(val) => {
																			formik.setFieldValue(
																				`alternateParts[${index}].items_id`,
																				val !== null &&
																					val.id,
																			);
																			formik.setFieldValue(
																				`alternateParts[${index}].name`,
																				val !== null &&
																					val.label,
																			)
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
															
															<td className='col-md-2'>
																<Button
																	// isDisable={
																	// 	formik.values.dimensions.length ===
																	// 	1
																	// }
																	icon='cancel'
																	color='danger'
																	onClick={() => removeRow(index)}
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
											// Create a new brand object with unique identifiers for each selection
											formik.setFieldValue('alternateParts', [
												...formik.values.alternateParts,
												{
													items_id: '',
												},
											]);

											refreshDropdowns();
										}}>
										Add Alternate Part
									</Button>
								</div> */}

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
												{formik.values.alternativeBrands.map(
													(item, index) => (
														<tr className='row' key={item.index}>
															<td className='col-md-5'>
																<FormGroup
																	label=''
																	id={`childArray[${index}].brand_id`}>
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
																				? brandOptions.find(
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
																				`alternativeBrands[${index}].number1`,
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
																				`alternativeBrands[${index}]number1`
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
																	onClick={() => removeRow(index)}
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
									<Button
										type='reset'
										color='info'
										isOutline
										onClick={formik.resetForm}>
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
				</ModalBody>
				<ModalFooter>
					<Button
						color='info'
						isOutline
						className='border-0'
						onClick={() => setState(false)}>
						Close
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};
Add.propTypes = {
	refreshTableData: PropTypes.func.isRequired,
};

export default Add;
