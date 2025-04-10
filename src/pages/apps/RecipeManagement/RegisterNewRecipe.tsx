import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { recipeAdd, recipeList, recipeIngredientList } from '../../../redux/actions';
import { RootState } from '../../../redux/store';

interface RegisterNewRecipeModalProps {
    show: boolean;
    onClose: () => void;
    business_id: string;
    item_id: string;
}

interface Ingredient {
    ingredient_id: string;
    name: string;
}

interface SelectedIngredient {
    ingredient_id: string;
    quantity: number;
    unit: string;
}

const RegisterNewRecipeModal: React.FC<RegisterNewRecipeModalProps> = ({ show, onClose, business_id, item_id }) => {
    const dispatch = useDispatch();
    const ingredients = useSelector((state: RootState) => state.ingredient.ingredients || []);

    const [preparationTime, setPreparationTime] = useState('');
    const [cookingTime, setCookingTime] = useState('');
    const [preparationType, setPreparationType] = useState('');
    const [instructions, setInstructions] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);

    // Fetch ingredients when modal opens
    useEffect(() => {
        if (show) {
            dispatch(recipeIngredientList(business_id));
        }
    }, [show, dispatch, business_id]);

    // Reset form when modal is closed
    useEffect(() => {
        if (!show) {
            setPreparationTime('');
            setCookingTime('');
            setPreparationType('');
            setInstructions('');
            setIsActive(false);
            setSelectedIngredients([]);
        }
    }, [show]);

    // Handle multi-select ingredient selection
    const handleIngredientChange = (e: React.ChangeEvent<EventTarget>) => {
        const target = e.target as unknown as HTMLSelectElement; // 👈 Type assertion to HTMLSelectElement
        const selectedIds = Array.from(target.selectedOptions, (option) => option.value);

        const updatedIngredients = selectedIds.map((id) => ({
            ingredient_id: id,
            quantity: 1,
            unit: 'g',
        }));

        setSelectedIngredients(updatedIngredients);
    };

    // Handle quantity change
    const handleQuantityChange = (ingredient_id: string, value: number) => {
        setSelectedIngredients(
            selectedIngredients.map((ing) => (ing.ingredient_id === ingredient_id ? { ...ing, quantity: value } : ing))
        );
    };

    // Handle unit change
    const handleUnitChange = (ingredient_id: string, value: string) => {
        setSelectedIngredients(
            selectedIngredients.map((ing) => (ing.ingredient_id === ingredient_id ? { ...ing, unit: value } : ing))
        );
    };

    // Handle form submission
    const handleSubmit = () => {
        const newRecipe = {
            item_id,
            business_id,
            preparation_time: Number(preparationTime),
            cooking_time: Number(cookingTime),
            preparation_type: preparationType,
            instructions,
            is_active: isActive,
            ingredients: selectedIngredients,
        };

        dispatch(recipeAdd(newRecipe));
        setTimeout(() => {
            dispatch(recipeList(business_id, item_id));
            onClose();
        }, 500);
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Register New Recipe</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Preparation Time (minutes)</Form.Label>
                        <Form.Control
                            type="number"
                            value={preparationTime}
                            onChange={(e) => setPreparationTime(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Cooking Time (minutes)</Form.Label>
                        <Form.Control
                            type="number"
                            value={cookingTime}
                            onChange={(e) => setCookingTime(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Preparation Type</Form.Label>
                        <Form.Control
                            type="text"
                            value={preparationType}
                            onChange={(e) => setPreparationType(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Instructions</Form.Label>
                        <Form.Control
                            as="textarea"
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Is Active?"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                        />
                    </Form.Group>

                    {/* Multi-Select Ingredient List */}
                    <Form.Group>
                        <Form.Label>Select Ingredients</Form.Label>
                        <Form.Control
                            as="select"
                            multiple
                            onChange={(e: React.ChangeEvent<EventTarget>) => handleIngredientChange(e)}>
                            {ingredients.map((ingredient: Ingredient) => (
                                <option key={ingredient.ingredient_id} value={ingredient.ingredient_id}>
                                    {ingredient.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    {/* Selected Ingredients List */}
                    <div className="mt-3">
                        {selectedIngredients.map((ing) => (
                            <div key={ing.ingredient_id} className="d-flex align-items-center mb-2">
                                <span className="me-3">
                                    {ingredients.find((i: Ingredient) => i.ingredient_id === ing.ingredient_id)?.name}
                                </span>
                                <Form.Control
                                    type="number"
                                    value={ing.quantity}
                                    onChange={(e) => handleQuantityChange(ing.ingredient_id, Number(e.target.value))}
                                    style={{ width: '80px', marginRight: '10px' }}
                                />
                                <Form.Control
                                    type="text"
                                    value={ing.unit}
                                    onChange={(e) => handleUnitChange(ing.ingredient_id, e.target.value)}
                                    style={{ width: '80px' }}
                                />
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() =>
                                        setSelectedIngredients(
                                            selectedIngredients.filter((i) => i.ingredient_id !== ing.ingredient_id)
                                        )
                                    }
                                    className="ms-2">
                                    X
                                </Button>
                            </div>
                        ))}
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Add Recipe
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RegisterNewRecipeModal;

// import React, { useState, useEffect } from 'react';
// import { Modal, Button, Form } from 'react-bootstrap';
// import { useDispatch } from 'react-redux';
// import { recipeAdd, recipeList } from '../../../redux/actions';
// import { useNavigate, useLocation } from 'react-router-dom';

// interface RegisterNewRecipeModalProps {
//     show: boolean;
//     onClose: () => void;
//     business_id: string;
//     item_id: string;
// }

// interface Ingredient {
//     ingredient_id: string;
//     quantity: number;
//     unit: string;
// }

// interface AddRecipe {
//     item_id: string;
//     business_id: string;
//     preparation_time: number;
//     cooking_time: number;
//     preparation_type: string;
//     instructions: string;
//     is_active: boolean;
//     ingredients: Ingredient[];
// }

// const RegisterNewRecipeModal: React.FC<RegisterNewRecipeModalProps> = ({ show, onClose, business_id, item_id }) => {
//     const location = useLocation();
//     // const item_id = location.state?.item_id;

//     const [preparationTime, setPreparationTime] = useState('');
//     const [cookingTime, setCookingTime] = useState('');
//     const [preparationType, setPreparationType] = useState('');
//     const [instructions, setInstructions] = useState('');
//     const [isActive, setIsActive] = useState(false);

//     const dispatch = useDispatch();

//     useEffect(() => {
//         if (!show) {
//             setPreparationTime('');
//             setCookingTime('');
//             setPreparationType('');
//             setInstructions('');
//             setIsActive(false);
//         }
//     }, [show]);

//     const handleSubmit = () => {
//         const newRecipe: AddRecipe = {
//             item_id: item_id, // Replace with actual item ID
//             business_id: business_id,
//             preparation_time: Number(preparationTime), // Convert string to number
//             cooking_time: Number(cookingTime), // Convert string to number
//             preparation_type: preparationType,
//             instructions: instructions,
//             is_active: isActive,
//             ingredients: [
//                 { ingredient_id: '30a182cd-f875-46fb-95f1-3e6cace51a1b', quantity: 1, unit: 'gm' }, // Corrected
//             ],
//         };

//         dispatch(recipeAdd(newRecipe));
//         // setTimeout(() => {dispatch(recipeList(business_id));
//         setTimeout(() => {
//             dispatch(recipeList(business_id));

//             setPreparationTime('');
//             setCookingTime('');
//             setPreparationType('');
//             setInstructions('');
//             setIsActive(false);

//             onClose();
//         }, 500);

//         onClose(); // Close modal after submitting
//     };

//     return (
//         <Modal show={show} onHide={onClose} centered>
//             <Modal.Header closeButton>
//                 <Modal.Title>Register New Recipe</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <Form>
//                     <Form.Group>
//                         <Form.Label>Preparation Time (minutes)</Form.Label>
//                         <Form.Control
//                             type="number"
//                             value={preparationTime}
//                             onChange={(e) => setPreparationTime(e.target.value)}
//                         />
//                     </Form.Group>

//                     <Form.Group>
//                         <Form.Label>Cooking Time (minutes)</Form.Label>
//                         <Form.Control
//                             type="number"
//                             value={cookingTime}
//                             onChange={(e) => setCookingTime(e.target.value)}
//                         />
//                     </Form.Group>

//                     <Form.Group>
//                         <Form.Label>Preparation Type</Form.Label>
//                         <Form.Control
//                             type="text"
//                             value={preparationType}
//                             onChange={(e) => setPreparationType(e.target.value)}
//                         />
//                     </Form.Group>

//                     <Form.Group>
//                         <Form.Label>Instructions</Form.Label>
//                         <Form.Control
//                             as="textarea"
//                             value={instructions}
//                             onChange={(e) => setInstructions(e.target.value)}
//                         />
//                     </Form.Group>

//                     <Form.Group className="mb-3">
//                         <Form.Check
//                             type="checkbox"
//                             label="Is Active?"
//                             checked={isActive}
//                             onChange={(e) => setIsActive(e.target.checked)}
//                         />
//                     </Form.Group>
//                 </Form>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={onClose}>
//                     Cancel
//                 </Button>
//                 <Button variant="primary" onClick={handleSubmit}>
//                     Add Recipe
//                 </Button>
//             </Modal.Footer>
//         </Modal>
//     );
// };

// export default RegisterNewRecipeModal;
