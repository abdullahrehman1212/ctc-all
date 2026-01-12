import React from 'react';
import Modal, { ModalBody, ModalHeader } from '../../../../../../components/bootstrap/Modal';
import Button from '../../../../../../components/bootstrap/Button';

const AlternateBrandsModal = ({ isOpen, toggle, setIsOpen, data }) => {
	const handleClose = setIsOpen || toggle || (() => {});
	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen || toggle || (() => {})}>
			<ModalHeader setIsOpen={setIsOpen || toggle || (() => {})}>
				Brands Available
				<Button color='secondary' onClick={handleClose}>
					Close
				</Button>
			</ModalHeader>
			<ModalBody>
				<table className='table'>
					<thead>
						<tr>
							<th>Name</th>
							<th>Part Number</th>
						</tr>
					</thead>
					<tbody>
						{data?.map((brand) => {
							return (
								<tr key={brand.id}>
									<td>{brand.name}</td>
									<td>{brand.number3}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</ModalBody>
		</Modal>
	);
};

export default AlternateBrandsModal;
