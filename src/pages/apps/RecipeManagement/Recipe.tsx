import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Table, Button, Modal, Form } from 'react-bootstrap';
import { useRedux } from '../../../hooks';
import { recipeIngredientList, recipeIngredientAdd } from '../../../redux/actions';
import { RootState } from '../../../redux/store';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import ToggleSwitch from '../MenuManagement/ToggleSwitch';

interface IngredientList {
    business_id: string;
    ingredient_id: string;
    name: string;
    is_active: boolean;
}

const Recipe = () => {
    const { dispatch, appSelector } = useRedux();
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [ingredientName, setIngredientName] = useState('');
    const ingredients = appSelector((state: RootState) => state.ingredient.ingredients || []);

    const business_id = location.state?.business_id;

    useEffect(() => {
        if (business_id) {
            dispatch(recipeIngredientList(business_id));
        }
    }, [dispatch, business_id]);

    const handleAddIngredient = () => {
        if (ingredientName.trim() && business_id) {
            dispatch(recipeIngredientAdd(ingredientName, business_id));
            setShowModal(false);
            setIngredientName('');
        }
    };

    return (
        <Card>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="header-title">Ingredient List</h4>
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        Add New Ingredient
                    </Button>
                </div>

                <div className="table-responsive">
                    <Table className="mb-0">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Is Active?</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ingredients.length > 0 ? (
                                ingredients.map((ingredient: IngredientList) => (
                                    <tr key={ingredient.ingredient_id}>
                                        <td>{ingredient.name}</td>
                                        <td>
                                            <ToggleSwitch checked={ingredient.is_active} />
                                        </td>
                                        <td>
                                            <FaRegEdit size={20} style={{ cursor: 'pointer', marginRight: '10px' }} />
                                            <FaTrash size={20} style={{ cursor: 'pointer', color: 'red' }} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center">
                                        No ingredients found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>

            {/* Modal for Adding Ingredient */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Ingredient</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Ingredient Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={ingredientName}
                                onChange={(e) => setIngredientName(e.target.value)}
                                placeholder="Enter ingredient name"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddIngredient}>
                        Add Ingredient
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
};

export default Recipe;
