// import React from 'react';
// import Modal, { ModalBody, ModalHeader } from '../../../../../../components/bootstrap/Modal';
// import Button from '../../../../../../components/bootstrap/Button';


// const ItemEditModal = ({ show, handleClose, item, updateItem }) => {
//     const [rackNumber, setRackNumber] = useState(item.purchase_order?.racks.map((rack) => rack.rack_number).join(', '));
//     const [shelfNumber, setShelfNumber] = useState(item.purchase_order?.shelves.map((shelf) => shelf.shelf_number).join(', '));
  
//     const handleSave = () => {
//       // Perform the logic to update the item with new rackNumber and shelfNumber
//       // ...
  
//       // Close the modal
//       handleClose();
//     };
  
//     return (
//       <Modal show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Item</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group controlId="formRackNumber">
//               <Form.Label>Rack Number</Form.Label>
//               <Form.Control type="text" value={rackNumber} onChange={(e) => setRackNumber(e.target.value)} />
//             </Form.Group>
//             <Form.Group controlId="formShelfNumber">
//               <Form.Label>Shelf Number</Form.Label>
//               <Form.Control type="text" value={shelfNumber} onChange={(e) => setShelfNumber(e.target.value)} />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleSave}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     );
//   };
  
//   export default ItemEditModal;