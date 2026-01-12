// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** apiClient Imports
import apiClient from '../../../../../baseURL/apiClient';
import moment from 'moment';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import baseURL from '../../../../../baseURL/baseURL';
import 'flatpickr/dist/themes/light.css';

import Button, { ButtonGroup } from '../../../../../components/bootstrap/Button';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../../../components/bootstrap/Dropdown';

import validate from './helper/editPagesValidate';
import showNotification from '../../../../../components/extras/showNotification';
import Icon from '../../../../../components/icon/Icon';
import {
	CardBody,
	CardHeader,
	CardFooter,
	CardLabel,
	CardActions,
	CardTitle,
} from '../../../../../components/bootstrap/Card';

import useDarkMode from '../../../../../hooks/useDarkMode';
import Spinner from '../../../../../components/bootstrap/Spinner';
import FormGroup from '../../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../../components/bootstrap/forms/Input';
import AddPersonAccount from '../modals/AddPersonAccount';

const EditModernPage = () => {
	return (
		<>
			<CardHeader className='px-0 pt-0'>
				<CardLabel icon='Engineering' iconColor='danger'>
					<CardTitle>Income Statement</CardTitle>
				</CardLabel>
				<CardActions>
					<ButtonGroup>
						<Dropdown>
							<DropdownToggle hasIcon={false}>
								<Button
									color='danger'
									isLight
									hoverShadow='default'
									icon='MoreVert'
								/>
							</DropdownToggle>
							<DropdownMenu isAlignmentEnd>
								<DropdownItem>
									<Button isOutline color='dark' icon='Preview'>
										View Income Statement
									</Button>
								</DropdownItem>
								<DropdownItem>
									<Button isOutline color='dark' icon='FilePdfFill'>
										Save to pdf
									</Button>
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</ButtonGroup>
				</CardActions>
			</CardHeader>
			<div className='row'>
				<div className='col-12'>
					<div className='col-12'>
						<div className='row g-4'>ddd</div>
						<br />
					</div>
				</div>
			</div>
			<CardFooter>dd</CardFooter>
		</>
	);
};

export default EditModernPage;
