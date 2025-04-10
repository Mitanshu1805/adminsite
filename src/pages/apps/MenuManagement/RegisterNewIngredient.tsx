import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { recipeIngredientAdd } from '../../../redux/actions';

interface RegisterIngredientModalProps {
    show: boolean;
    onClose: () => void;
    business_id: string;
}

const RegisterIngredientModal: React.FC<RegisterIngredientModalProps> = ({ show, onClose, business_id }) => {
    const [ingredient_name, setName] = useState('');
    const [unit, setUnit] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        if (!show) {
            setName('');
            setUnit('');
        }
    }, [show]);

    const handleSubmit = () => {
        // const newIngredient = {
        //     business_id: business_id,
        //     name: name,
        // };

        dispatch(recipeIngredientAdd(ingredient_name, business_id, unit));

        setName('');
        setUnit('');

        onClose();
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Register New Ingredient</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="name">
                        <Form.Label>Ingredient Name</Form.Label>
                        <Form.Control type="text" value={ingredient_name} onChange={(e) => setName(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="unit">
                        <Form.Label>Ingredient Unit</Form.Label>
                        <Form.Control type="text" value={unit} onChange={(e) => setUnit(e.target.value)} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Register Ingredient
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RegisterIngredientModal;
