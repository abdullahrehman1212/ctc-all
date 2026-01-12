// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import React, { useState } from 'react';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import moment from 'moment';
import Spinner from '../../../../components/bootstrap/Spinner';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '../../../../components/bootstrap/Modal';
import Card, {
  CardTitle,
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

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  }

  return errors;
};

const AddSupplier = ({ refreshTableData, setCounter1, counter1 }) => {
  const [state, setState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSave, setLastSave] = useState(null);
  const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
  const [scrollableStatus, setScrollableStatus] = useState(false);
  const [centeredStatus, setCenteredStatus] = useState(false);
  const [sizeStatus, setSizeStatus] = useState(null);
  const [fullScreenStatus, setFullScreenStatus] = useState(null);
  const [animationStatus, setAnimationStatus] = useState(true);
  const [headerCloseStatus, setHeaderCloseStatus] = useState(true);

  const formatChars = {
    q: '[0123456789]',
  };

  const submitForm = (myFormik) => {
    apiClient
      .post(`/addPerson`, myFormik.values)
      .then((res) => {
        if (res.data.status === 'ok') {
          formik.resetForm();
          setState(false);
          refreshTableData();
          setIsLoading(false);
          setCounter1(counter1 + 1);
        } else {
          setIsLoading(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const initialStatus = () => {
    setStaticBackdropStatus(false);
    setScrollableStatus(false);
    setCenteredStatus(false);
    setSizeStatus(null);
    setFullScreenStatus(null);
    setAnimationStatus(true);
    setHeaderCloseStatus(true);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      phone_no: '',
      cnic: '',
      email: '',
      address: '',
      father_name: '',
      person_type_id: 2,
      date: '',
      opening_balance: '',
    },
    validate,
    onSubmit: () => {
      setIsLoading(true);
      setTimeout(handleSave, 2000);
    },
  });

  const handleSave = () => {
    submitForm(formik);
    setLastSave(moment());
  };

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
        size={sizeStatus}
        fullScreen={fullScreenStatus}
        isAnimation={animationStatus}>
        <ModalHeader setIsOpen={headerCloseStatus ? setState : null}>
          <ModalTitle id='exampleModalLabel'>Add Supplier</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className='col-12'>
            <Card stretch tag='form' onSubmit={formik.handleSubmit}>
              <CardHeader>
                <CardLabel icon='CheckBox' iconColor='info'>
                  <CardTitle>Supplier</CardTitle>
                </CardLabel>
              </CardHeader>
              <CardBody>
                <div className='row g-4'>
                  <FormGroup id='name' label='Name' className='col-md-12'>
                    <Input
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.name}
                      isValid={formik.isValid}
                      isTouched={formik.touched.name}
                      invalidFeedback={formik.errors.name}
                      validFeedback='Looks good!'
                    />
                  </FormGroup>
                  <FormGroup id='father_name' label='Company Name' className='col-lg-12'>
                    <Input
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.father_name}
                      isValid={formik.isValid}
                      isTouched={formik.touched.father_name}
                      invalidFeedback={formik.errors.father_name}
                      validFeedback='Looks good!'
                    />
                  </FormGroup>
                  <FormGroup id='phone_no' label='Phone number' className='col-md-12'>
                    <Input
                      formatChars={formatChars}
                      placeholder='03111111111'
                      mask='03qqqqqqqqq'
                      onWheel={(e) => e.target.blur()}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.phone_no}
                      isValid={formik.isValid}
                      isTouched={formik.touched.phone_no}
                      invalidFeedback={formik.errors.phone_no}
                      validFeedback='Looks good!'
                    />
                  </FormGroup>
                  <FormGroup id='email' label='Email' className='col-lg-12'>
                    <Input
                      type='email'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      isValid={formik.isValid}
                      isTouched={formik.touched.email}
                      invalidFeedback={formik.errors.email}
                      validFeedback='Looks good!'
                    />
                  </FormGroup>
                  <FormGroup id='cnic' label='CNIC' className='col-md-12'>
                    <Input
                      formatChars={formatChars}
                      placeholder='#####-#######-#'
                      mask='qqqqq-qqqqqqq-q'
                      onWheel={(e) => e.target.blur()}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.cnic}
                      isValid={formik.isValid}
                      isTouched={formik.touched.cnic}
                      invalidFeedback={formik.errors.cnic}
                      validFeedback='Looks good!'
                    />
                  </FormGroup>
                  <FormGroup id='address' label='Address' className='col-lg-12'>
                    <Input
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.address}
                      isValid={formik.isValid}
                      isTouched={formik.touched.address}
                      invalidFeedback={formik.errors.address}
                      validFeedback='Looks good!'
                    />
                  </FormGroup>
                  <FormGroup id='date' label='Date' className='col-lg-12'>
                    <Input
                      type='date'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.date}
                      isValid={formik.isValid}
                      isTouched={formik.touched.date}
                      invalidFeedback={formik.errors.date}
                      validFeedback='Looks good!'
                    />
                  </FormGroup>
                  <FormGroup id='opening_balance' label='Opening Balance' className='col-lg-12'>
                    <Input
                      type='number'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.opening_balance}
                      isValid={formik.isValid}
                      isTouched={formik.touched.opening_balance}
                      invalidFeedback={formik.errors.opening_balance}
                      validFeedback='Looks good!'
                    />
                  </FormGroup>
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
                    color={lastSave ? 'info' : 'success'}
                    isDisable={isLoading}
                    onClick={formik.handleSubmit}>
                    {isLoading && <Spinner isSmall inButton />}
                    {isLoading
                      ? (lastSave && 'Saving') || 'Saving'
                      : (lastSave && 'Save') || 'Save'}
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

AddSupplier.propTypes = {
  refreshTableData: PropTypes.func.isRequired,
  setCounter1: PropTypes.func.isRequired,
  counter1: PropTypes.number.isRequired,
};

export default AddSupplier;
