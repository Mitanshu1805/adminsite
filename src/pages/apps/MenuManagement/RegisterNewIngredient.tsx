import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { recipeIngredientAdd } from '../../../redux/actions';

interface RegisterIngredientModalProps {
    show: boolean;
    onClose: () => void;
    business_id: string;
}

const RegisterIngredientModal: React.FC<RegisterIngredientModalProps> = ({ show, onClose, business_id }) => {
    const [ingredient_name, setName] = useState('');
    const [unit, setUnit] = useState('');
    const [ingredientNameError, setIngredientNameError] = useState('');
    const [unitError, setUnitError] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        if (!show) {
            setName('');
            setUnit('');
            setIngredientNameError('');
            setUnitError('');
        }
    }, [show]);

    const handleSubmit = () => {
        let valid = true;

        if (!ingredient_name.trim()) {
            setIngredientNameError('Ingredient name is required.');
            valid = false;
        } else {
            setIngredientNameError('');
        }

        if (!unit.trim()) {
            setUnitError('Unit is required.');
            valid = false;
        } else {
            setUnitError('');
        }

        if (!valid) return;

        dispatch(recipeIngredientAdd(ingredient_name, business_id, unit));

        setName('');
        setUnit('');
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Register New Ingredient</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="ingredientName" className="mb-3">
                        <Form.Label>
                            Ingredient Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="e.g., Tomato, Cheese"
                            value={ingredient_name}
                            onChange={(e) => setName(e.target.value)}
                            isInvalid={!!ingredientNameError}
                        />
                        <Form.Control.Feedback type="invalid">{ingredientNameError}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="ingredientUnit" className="mb-3">
                        <Form.Label>
                            Unit <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select value={unit} onChange={(e) => setUnit(e.target.value)} isInvalid={!!unitError}>
                            <option value="">-- Select Unit --</option>
                            <option value="gm">gm</option>
                            <option value="kg">kg</option>
                            <option value="ml">ml</option>
                            <option value="l">l</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{unitError}</Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Add Ingredient
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RegisterIngredientModal;
