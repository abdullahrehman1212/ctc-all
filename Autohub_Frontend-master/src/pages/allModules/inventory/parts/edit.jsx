// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/jsx-no-bind */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import moment from 'moment';
import ReactSelect, { createFilter } from 'react-select';
import PropTypes from 'prop-types';
import Spinner from '../../../../components/bootstrap/Spinner';
import { _titleError, _titleSuccess } from '../../../../notifyMessages/erroSuccess';
import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
} from '../../../../components/bootstrap/Card';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Button from '../../../../components/bootstrap/Button';
import apiClient from '../../../../baseURL/apiClient';
import Input from '../../../../components/bootstrap/forms/Input';
import Add from '../Racks/add';
import AddShelf from '../Shelves/add';
import customStyles from '../../../customStyles/ReactSelectCustomStyle';

const validate = (values) => {
	const errors = {};
	if (!values.racks || values.racks.length === 0) {
		errors.racks = 'At least one rack is required';
	}
	return errors;
};

// ... (other imports)

const Edit = ({ editingItem, handleStateEdit }) => {
	const [triggerCalculateExpenses, setTriggerCalculateExpenses] = useState(0);
	const [reload, setReload] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const [shelfOptionsLoading, setShelfOptionsLoading] = useState(false);
	const [rackOptions, setRackOptions] = useState([]);
	const [rackOptionsLoading, setRackOptionsLoading] = useState(false);
	const formik = useFormik({
		initialValues: {
			...editingItem,
			racks: editingItem?.racks || [],
			shelves: editingItem?.shelves || [],
		},

		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});

	const submitForm = (data) => {
		const payload = {
			racks: data.racks,
			shelves: data.shelves,
			purchase_order_id: data.purchase_order_id,
			id: data.id,
			item_id: data.item.id,
			store_id: data.store.id,
			rack_id: data.racks.id,
		};

		apiClient
			.post(`/updateItemInventory`, payload)
			.then((res) => {
				if (res.data.status === 'ok') {
					formik.resetForm();
					handleStateEdit(false);
					setIsLoading(false);
					setLastSave(moment());
				} else {
					setIsLoading(false);
				}
			})
			.catch((err) => {
				setIsLoading(false);
			});
	};

	const handleSave = () => {
		submitForm(formik.values);
		setLastSave(moment());
	};

	const [allShelves, setAllShelves] = useState([]);

	useEffect(() => {
		// Fetch shelves data once
		apiClient
			.get(`/getShelvesDropdown`)
			.then((response) => {
				const shelves = response?.data?.shelves?.map((shelf) => ({
					id: shelf.id,
					value: shelf.id,
					label: shelf.shelf_number,
				}));
				setAllShelves(shelves);
				// console.log(shelves);
			})
			.catch((error) => {
				// console.error('Error fetching shelves data:', error);
			});
	}, []);
	function getRacks(storeId) {
		setRackOptionsLoading(true);

		// formik.setFieldValue('rackShelf', []);
		formik.setFieldValue('shelf_numbers', []); // Clear shelf_numbers field when new storeId is selected
		formik.setFieldValue('shelfOptions', []); // Clear shelf_numbers field when new storeId is selected

		apiClient
			.get(`/getRackDropDown`, { params: { store_id: editingItem?.store_id } })
			.then((response) => {
				const filteredRacks = response.data.racks.filter(
					(rack) => rack.store_id === storeId,
				);
				const rec = filteredRacks?.map((rack) => ({
					id: rack.id,
					value: rack.id,
					label: rack.rack_number,
				}));
				console.log(rec);
				setRackOptions(rec);
				setRackOptionsLoading(false);
			})
			.catch((error) => {
				// console.error('Error fetching rack data:', error);
				setRackOptions([]);
				setRackOptionsLoading(false);
			});
	}

	useEffect(() => {
		getRacks(formik.values?.store_id);
	}, []);

	// useEffect(() => {
	// 	getShelves(formik.values?.store_id);
	// }, []);

	// useEffect(() => {
	// 	formik.values.childArray.forEach((child, index) => {
	// 		if (child.rackShelf && child.rackShelf.length > 0) {
	// 			child.rackShelf.forEach((rack, rackIndex) => {
	// 				console.log('we are here');

	// 				if (rack.rack_id) {
	// 					console.log('we are here');
	// 					getShelves(rack.rack_id, index, rackIndex);
	// 				}
	// 			});
	// 		}
	// 	});
	// }, []);

	function getShelves(rackId, rackIndex) {
		formik.setFieldValue('shelfOptions', []);

		apiClient
			.get(`/getShelvesDropdown`, { params: { id: rackId } })
			.then((response) => {
				const shelves = response?.data?.shelves?.map((shelf) => ({
					id: shelf.id,
					value: shelf.id,
					label: shelf.shelf_number,
				}));

				// if (shelves.length > 0) {
				formik
					.setFieldValue(`childArray.rackShelf[${rackIndex}]shelves`, shelves)
					.then(() => {
						// console.log(formik.values);
					});
				// }
				// console.log(formik.values);
			})
			.catch((error) => {
				// console.error('Error fetching shelf data:', error);
			});
	}

	const addRow = (childIndex) => {
		const updatedChildArray = formik?.values?.childArray?.map((item, index) => {
			if (index === childIndex) {
				const newRackNumbers = [
					...item.rackShelf,
					{ rack_id: '', shelf_id: '', quantity: 0 },
				];
				return {
					...item,
					rackShelf: newRackNumbers,
				};
			}
			return item;
		});

		formik.setFieldValue('childArray', updatedChildArray);
		setReload(reload + 1);
		setTriggerCalculateExpenses(triggerCalculateExpenses + 1);
	};
	const removeRackRow = (rackIndex) => {
		const updatedChildArray = formik?.values?.childArray?.map((item, index) => {
			// eslint-disable-next-line no-constant-condition
			if (1) {
				return {
					...item,
					rackShelf: item.rackShelf.filter((rack, idx) => idx !== rackIndex),
				};
			}
			return item;
		});

		formik.setFieldValue('childArray', updatedChildArray);
		setReload(reload + 1);
		setTriggerCalculateExpenses(triggerCalculateExpenses + 1);
	};
	return (
		<div className='col-12'>
			<Card stretch tag='form' onSubmit={formik.handleSubmit}>
				<CardBody>
					{/* <div className='row g-2'>
						<h5>Racks</h5>
						<div className='col-md-6'>
							<ReactSelect
								placeholder='Select Racks'
								isMulti
								isClearable
								options={rackOptions}
								value={formik.values.racks}
								onChange={(selectedRacks) => {
									formik.setFieldValue('racks', selectedRacks);
								}}
							/>

							<div className='row g-2 mt-3'>
								<div className='col-md-6'>
									<Input
										type='text'
										value={formik.values.newRack || ''}
										onChange={(e) =>
											formik.setFieldValue('newRack', e.target.value)
										}
										placeholder='New Rack Number'
									/>
								</div>
								<div className='col-md-6 mt-1'>
									<Button
										color='primary'
										onClick={() => {
											const {
												values: { newRack },
											} = formik;

											if (
												newRack &&
												!formik.values.racks.find(
													(rack) => rack.value === newRack,
												)
											) {
												formik.setFieldValue('racks', [
													...formik.values.racks,
													{
														value: newRack,
														rack_number: newRack,
														label: newRack,
													},
												]);
												formik.setFieldValue('newRack', '');
											}
										}}>
										Add New Rack
									</Button>
								</div>
							</div>
						</div>
					</div>

					<div className='row g-4 mt-4'>
						<div className='col-md-6'>
							<h5>Shelves</h5>

							<ReactSelect
								isMulti
								isClearable
								placeholder='Select Shelves'
								options={
									formik.values?.item?.shelves.map((shelf) => ({
										id: shelf.id,
										shelf_number: shelf.shelf_number,
										label: shelf.shelf_number, 
										value: shelf.id,
									})) || []
								}
								value={formik.values.shelves}
								onChange={(selectedShelves) => {
									formik.setFieldValue('shelves', selectedShelves);
								}}
							/>

							<div className='row g-2 mt-3'>
								<div className='col-md-6'>
									<Input
										type='text'
										value={formik.values.newShelf || ''}
										onChange={(e) =>
											formik.setFieldValue('newShelf', e.target.value)
										}
										placeholder='New Shelf Number'
									/>
								</div>
								<div className='col-md-6 mt-2'>
									<Button
										color='primary'
										onClick={() => {
											const {
												values: { newShelf },
											} = formik;

											if (
												newShelf &&
												!formik.values.shelves.find(
													(shelf) => shelf.value === newShelf,
												)
											) {
												formik.setFieldValue('shelves', [
													...formik.values.shelves,
													{
														value: newShelf,
														shelf_number: newShelf,
														label: newShelf,
													},
												]);
												formik.setFieldValue('newShelf', '');
											}
										}}>
										Add New Shelf
									</Button>
								</div>
							</div>
						</div>
					</div> */}

					{formik?.values?.childArray?.map((items, index) => (
						<tr className='row mt-2 ' key={items.index}>
							<div className='row justify-content-between mt-5'>
								<div className='col'>
									<h4>Rack and Shelves</h4>
								</div>
								<div className='col-auto'>
									<div className='d-flex justify-content-end'>
										<Add
											getRacks={getRacks}
											storeId={formik.values?.store_id}
											show={1}
										/>
										<AddShelf
											getShelves={getShelves}
											storeId={formik.values?.store_id}
											show={1}
										/>
									</div>
								</div>
							</div>
							<table>
								{1 &&
									formik?.values?.childArray.rackShelf?.map((rack, rackIndex) => (
										<tr className='row mt-2 '>
											<td className='col-md-4 border-start border-end'>
												<div>
													<FormGroup
														size='sm'
														label='Rack'
														id={`childArray.rackShelf[${rackIndex}].rack_id`}>
														<ReactSelect
															className='col-md-12'
															// menuIsOpen={false}
															styles={customStyles}
															classNamePrefix='select'
															options={rackOptions}
															isLoading={rackOptionsLoading}
															value={
																rack.rack_id
																	? rackOptions.find(
																			(c) =>
																				c.value ===
																				rack.rack_id,
																	  )
																	: null
															}
															onChange={(val) => {
																formik.setFieldValue(
																	`childArray.rackShelf[${rackIndex}].rack_id`,
																	val !== null ? val.id : '',
																);
																getShelves(val?.id, rackIndex);
															}}
															isValid={formik.isValid}
															isTouched={
																formik.touched[
																	`childArray.rackShelf[${rackIndex}].rack_id`
																]
															}
															invalidFeedback={
																formik.errors[
																	`childArray.rackShelf[${rackIndex}].rack_id`
																]
															}
															filterOption={createFilter({
																matchFrom: 'start',
															})}
														/>
													</FormGroup>
													{formik.errors[
														`childArray.rackShelf[${rackIndex}].rack_id`
													] && (
														<div
															style={{
																color: '#ef4444',
																textAlign: 'center',
																fontSize: '0.875em',
																marginTop: '0.25rem',
															}}>
															{
																formik.errors[
																	`childArray.rackShelf[${rackIndex}].rack_id`
																]
															}
														</div>
													)}
												</div>
											</td>
											<td className='col-md-4 border-start border-end'>
												<div>
													<FormGroup
														size='sm'
														label='Shelf'
														id={`childArray.rackShelf[${rackIndex}].shelf_id`}>
														<ReactSelect
															className='col-md-12'
															styles={customStyles}
															classNamePrefix='select'
															options={allShelves
																?.filter(
																	(item) =>
																		item.id === rack.rack_id,
																)
																?.map((item) => ({
																	value: item.id,
																	label: item.label,
																}))}
															isLoading={shelfOptionsLoading}
															value={
																rack.shelf_id
																	? allShelves.find(
																			(item) =>
																				item.id ===
																				rack.shelf_id,
																	  )
																	: null
															}
															onChange={(val) => {
																formik.setFieldValue(
																	`childArray.rackShelf[${rackIndex}].shelf_id`,
																	val !== null ? val.value : '',
																);
															}}
															isValid={formik.isValid}
															isTouched={
																formik.touched[
																	`childArray.rackShelf[${rackIndex}].shelf_id`
																]
															}
															invalidFeedback={
																formik.errors[
																	`childArray.rackShelf[${rackIndex}].shelf_id`
																]
															}
															filterOption={createFilter({
																matchFrom: 'start',
															})}
														/>
													</FormGroup>

													{formik.errors[
														`childArray.rackShelf[${rackIndex}].shelf_id`
													] && (
														<div
															style={{
																color: '#ef4444',
																textAlign: 'center',
																fontSize: '0.875em',
																marginTop: '0.25rem',
															}}>
															{
																formik.errors[
																	`childArray.rackShelf[${rackIndex}].shelf_id`
																]
															}
														</div>
													)}
												</div>
												{/* )} */}
											</td>

											<td className='col-md-3'>
												<div className='col-md-12'>
													<FormGroup
														size='sm'
														id={`childArray.rackShelf[${rackIndex}].quantity`}
														label='Quantity'>
														<Input
															type='number'
															onWheel={(e) => e.target.blur()}
															onChange={(e) => {
																formik.handleChange(e); // Call formik.handleChange with the event
															}}
															onBlur={formik.handleBlur}
															value={rack.quantity}
															invalidFeedback={
																formik.errors[
																	`childArray.rackShelf[${rackIndex}].quantity`
																]
															}
														/>
													</FormGroup>
													{formik.errors[
														`childArray.rackShelf[${rackIndex}].quantity`
													] && (
														<div
															style={{
																color: '#ef4444',
																textAlign: 'center',
																fontSize: '0.875em',
																marginTop: '0.25rem',
															}}>
															{
																formik.errors[
																	`childArray.rackShelf[${rackIndex}].quantity`
																]
															}
														</div>
													)}
												</div>
											</td>

											<td className='col-md-1 mt-4'>
												<Button
													isDisable={
														formik.values.childArray?.rackShelf
															?.length === 1
													}
													icon='cancel'
													color='danger'
													onClick={() => removeRackRow(rackIndex)}
												/>
											</td>
										</tr>
									))}
							</table>
							<div className='col-m row  d-flex  justify-content-end  mt-1'>
								<Button
									className='col-md-2 '
									isDisable={formik.values.childArray?.rackShelf?.length === 1}
									icon='add'
									color='success'
									onClick={() => addRow(index)}>
									Add
								</Button>
							</div>
						</tr>
					))}
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
	editingItem: PropTypes.shape({
		id: PropTypes.number,
		racks: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.number,
				rack_number: PropTypes.string,
			}),
		),
	}).isRequired,
	handleStateEdit: PropTypes.func.isRequired,
};

export default Edit;

// Function to generate a unique ID for the new rack_number
function generateUniqueId() {
	return `_${Math.random().toString(36).substr(2, 9)}`;
}
