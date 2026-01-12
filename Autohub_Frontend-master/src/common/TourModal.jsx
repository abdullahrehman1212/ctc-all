import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useTour } from '@reactour/tour';
import { useNavigate } from 'react-router-dom';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../components/bootstrap/Modal';
import Button from '../components/bootstrap/Button';

import Logo from '../components/Logo';
import Img from '../assets/img/wanna/susy/susy9.png';
import Icon from '../components/icon/Icon';

const TourModal = () => {
	const navigate = useNavigate();
	let data = null;
	try {
		data = Cookies?.get('Data1') ? JSON.parse(Cookies?.get('Data1')) : null;
	} catch (error) {
		console.error('Error parsing cookies data:', error);
	}
	const [isOpenModal, setIsOpenModal] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => setIsOpenModal(true), 3000);
		return () => {
			setIsOpenModal(false);
			clearTimeout(timeout);
		};
	}, []);

	const { setIsOpen } = useTour();

	return (
		<Modal isOpen={isOpenModal} setIsOpen={setIsOpenModal} titleId='tour-title'>
			<ModalHeader setIsOpen={setIsOpenModal}>
				<ModalTitle id='tour-title' className='d-flex align-items-end'>
					<Logo height={28} /> <span className='ps-2'>Assistant</span>
					<span className='ps-2'>
						<Icon icon='Verified' color='info' />
					</span>
				</ModalTitle>
			</ModalHeader>
			<ModalBody>
				<div className='row'>
					<div className='col-md-3'>
						<img src={Img} alt='' width='100%' />
					</div>
					<div className='col-md-9 d-flex align-items-center'>
						<div>
							<h2>Hi 👋🏻, I'm Susy.</h2>
							<p className='lead'>
								Would you like me to introduce {data?.user?.company_name} to you in
								a few steps?
							</p>
						</div>
					</div>
				</div>
			</ModalBody>
			<ModalFooter>
				<Button icon='Close' color='danger' isLink onClick={() => setIsOpenModal(false)}>
					No
				</Button>
				<Button
					icon='DoneOutline'
					color='success'
					isLight
					onClick={() => {
						setIsOpenModal(false);
						navigate('/');
						setTimeout(() => setIsOpen(true), 1000);
					}}>
					Yes
				</Button>
			</ModalFooter>
		</Modal>
	);
};

export default TourModal;
