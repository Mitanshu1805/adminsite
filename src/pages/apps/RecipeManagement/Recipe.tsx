import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Table, Button, Modal, Form } from 'react-bootstrap';
import { useRedux } from '../../../hooks';
import { recipeIngredientList, recipeIngredientAdd, recipeList, recipeAdd } from '../../../redux/actions';
import { RootState } from '../../../redux/store';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import ToggleSwitch from '../MenuManagement/ToggleSwitch';
import RegisterNewRecipeModal from './RegisterNewRecipe';

interface IngredientList {
    business_id: string;
    ingredient_id: string;
    name: string;
    is_active: boolean;
}

const Recipe = () => {
    const { dispatch, appSelector } = useRedux();
    const location = useLocation();
    const item_id = location.state?.item_id;
    const [showRecipeModal, setShowRecipeModal] = useState(false);
    const ingredients = appSelector((state: RootState) => state.ingredient.ingredients || []);

    const business_id = location.state?.business_id;

    console.log('business_id', business_id);
    console.log('item_id', item_id);

    useEffect(() => {
        if (business_id) {
            console.log('Dispatching recipeIngredientList and recipeList');
            dispatch(recipeIngredientList(business_id));
            console.log('Dispatching recipeList with business_id:', business_id);
            dispatch(recipeList(business_id));
        }
    }, [dispatch, business_id]);

    const handleAddRecipe = () => {
        console.log('RECIPE ADD CLICKED');
        if (!showRecipeModal) {
            setShowRecipeModal(true);
        }
    };

    const handleCloseRecipeModal = () => {
        console.log('CloseRecipeModal');
        setShowRecipeModal(false);
    };

    return (
        <Card>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="header-title">Recipe List</h4>
                    <Button variant="primary" onClick={handleAddRecipe}>
                        Add New Recipe
                    </Button>
                    <RegisterNewRecipeModal
                        show={showRecipeModal}
                        onClose={handleCloseRecipeModal}
                        business_id={business_id}
                        item_id={item_id}
                    />
                </div>

                <div className="table-responsive">
                    <Table className="mb-0">
                        <thead>
                            <tr>
                                {/* <th>Preparation Time</th>
                                <th>Cooking Time</th>
                                <th>Preparation Type</th>
                                <th>Instructions</th>
                                <th>Is Active?</th>
                                <th>Ingredients</th> */}

                                <th>Name</th>
                                <th>Is Active?</th>
                                <th>Actions</th>
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
        </Card>
    );
};

export default Recipe;
