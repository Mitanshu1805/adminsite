import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { businessList, languageList } from '../../../redux/business/actions';
import { registerBusinessUser } from '../../../redux/business/actions';

interface RegisterBusinessUserModalProps {
    show: boolean;
    onClose: () => void;
    businessId: string;
}

const RegisterBusinessUserModal: React.FC<RegisterBusinessUserModalProps> = ({ show, onClose, businessId }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        if (!show) {
            // Reset form fields when modal closes
            setFirstName('');
            setLastName('');
            setEmail('');
            setPhoneNumber('');
            setAddress('');
        }
    }, [show]);

    const handleSubmit = () => {
        const newBusinessUser = {
            business_id: businessId,
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            email: email,
            address: address,
        };

        dispatch(registerBusinessUser(newBusinessUser));
        setTimeout(() => {
            dispatch(businessList());

            setFirstName('');
            setLastName('');
            setEmail('');
            setPhoneNumber('');
            setAddress('');

            onClose();
        }, 500);
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Register New Business Owner</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="firstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="lastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="phoneNumber">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Register Business Owner
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RegisterBusinessUserModal;
