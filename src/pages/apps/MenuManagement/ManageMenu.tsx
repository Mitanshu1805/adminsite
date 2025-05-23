import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { categoryItemList, categoryUpdateIsActive } from '../../../redux/menuManagementCategory/actions';
import { businessList } from '../../../redux/actions';
import { deleteItem, updateItem } from '../../../redux/menuManagementItem/actions';
import { deleteCategory } from '../../../redux/menuManagementCategory/actions';
import RegisterCategory from './RegisterCategory';
import { useRedux } from '../../../hooks';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import { RootState } from '../../../redux/store';
import './ManageMenu.css';
import EditCategory from './EditCategory';
import ToggleSwitch from './ToggleSwitch';
import { itemUpdateIsActive } from '../../../redux/menuManagementItem/actions';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteItem';

interface CategoryItem {
    business_id: string;
    category_id: string;
    is_active: boolean;
    category_name: string;
    category_names: { [key: string]: string };
    logo_image: string;
    items: Array<{
        category_id: string;
        item_id: string;
        item_name: string;
        price: number;
        is_active: boolean;
        dietary: string;
        logo_image: string;
        available_order_type: string[];
    }>;
}

const ManageMenu: React.FC = () => {
    // const { business_id } = useParams<{ business_id: string }>();
    const location = useLocation();
    console.log('LOCATION>>>>>>', location);
    const business_id = location.state?.business_id;
    // const business_id = localStorage.getItem('business_id') || '';

    const { dispatch, appSelector } = useRedux();
    // const [showCategoryRegistrationModal, setShowCategoryRegistrationModal] = useState(false);
    // const [showCategoryUpdateModal, setShowCategoryUpdateModal] = useState(false);
    const [toggleStates, setToggleStates] = useState<{ [key: string]: boolean }>({});
    const [isToggled, setIsToggled] = useState(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editItem, setEditItem] = useState<CategoryItem['items'][number] | null>(null);
    const [message, setMessage] = useState<string>('');
    const categories = appSelector((state: RootState) => state.category.categories || []);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [categoryDelete, setCategoryDelete] = useState<string | null>(null);
    const [showCategoryDeleteModal, setShowCategoryDeleteModal] = useState(false);
    const [itemDelete, setItemDelete] = useState<string | null>(null);
    const [showItemDeleteModal, setShowItemDeleteModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        dispatch(businessList());
        // if (business_id) {
        dispatch(categoryItemList(business_id));
        // }
    }, [dispatch]);

    useEffect(() => {
        if (categories.length > 0 && !selectedCategoryId) {
            setSelectedCategoryId(categories[0].category_id);
        }
    }, [categories, selectedCategoryId]);
    useEffect(() => {
        if (categories.length > 0) {
            const initialToggleStates: { [key: string]: boolean } = {};
            categories.forEach((category: CategoryItem) => {
                initialToggleStates[category.category_id] = category.is_active;
                // Update toggle states for each item inside the category
                category.items.forEach((item) => {
                    initialToggleStates[item.item_id] = item.is_active;
                });
            });
            setToggleStates(initialToggleStates);
        }
    }, [categories]); // Ensures sync when categories are updated

    const handleCategoryClick = (category_id: string) => {
        console.log('Category Clicked:', category_id); // Debugging log
        // setSelectedCategoryId(category_id === selectedCategoryId ? null : category_id);
        setSelectedCategoryId(category_id);
    };

    const handleCategoryToggle = (category_id: string, is_active: boolean) => {
        setToggleStates((prev) => ({
            ...prev,
            [category_id]: is_active,
        }));
        dispatch(categoryUpdateIsActive(category_id, is_active));

        setTimeout(() => {
            setMessage('');
            dispatch(categoryItemList(business_id!));
        }, 100);
        // setSelectedBusinessUser(editedBusinessUser);
    };

    const handleItemToggle = (item_id: string, is_active: boolean) => {
        setToggleStates((prev) => ({
            ...prev,
            [item_id]: is_active,
        }));

        // Dispatch action to update the item status
        dispatch(itemUpdateIsActive(item_id, is_active));

        setTimeout(() => {
            setMessage('');
            dispatch(categoryItemList(business_id!));
        }, 100);
    };
    const handleRecipe = (business_id: string, item_id: string) => {
        navigate('/apps/recipe', {
            state: { business_id: business_id, item_id: item_id },
        });
    };

    // const handleCategoryRegister = () => {
    //     console.log('Category Register Clicked');

    //     if (!showCategoryRegistrationModal) {
    //         setShowCategoryRegistrationModal(true);
    //     }
    // };

    // const handleCategoryUpdate = () => {
    //     console.log('Category Update Clicked');

    //     if (!showCategoryUpdateModal) {
    //         setShowCategoryUpdateModal(true);
    //     }
    // };

    // const handleCloseCategoryRegistrationModal = () => {
    //     console.log('Category Register Closed');
    //     setShowCategoryRegistrationModal(false);
    // };

    // const handleCloseCategoryUpdateModal = () => {
    //     console.log('Category Update Clicked');
    //     setShowCategoryUpdateModal(false);
    // };

    const handleDeleteItem = (item_id: string) => {
        const confirmDeleteitem = window.confirm('Are you sure you want to delete this Item?');
        if (confirmDeleteitem) {
            dispatch(deleteItem(item_id));
            setMessage('Item deleted successfully');
            setTimeout(() => {
                setMessage('');
                dispatch(categoryItemList(business_id!));
            }, 500);
        }
    };
    const handleItemDelete = (item_id: string) => {
        setItemDelete(item_id);
        setShowItemDeleteModal(true);
    };

    const confirmItemDelete = () => {
        if (itemDelete) {
            dispatch(deleteItem(itemDelete));
        }
        setTimeout(() => {
            dispatch(categoryItemList(business_id));
        }, 500);
        setShowItemDeleteModal(false);
    };

    const handleDeleteCategory = (category_id: string) => {
        const confirmDeletecategory = window.confirm('Are you sure you want to delete this Category?');
        if (confirmDeletecategory) {
            dispatch(deleteCategory(category_id));
            setMessage('Category deleted successfully');
            setTimeout(() => {
                setMessage('');
                dispatch(categoryItemList(business_id!));
            }, 500);
        }
    };

    const handleCategoryDelete = (category_id: string) => {
        setCategoryDelete(category_id);
        setShowCategoryDeleteModal(true);
    };

    const confirmCategoryDelete = () => {
        if (categoryDelete) {
            dispatch(deleteCategory(categoryDelete));
        }
        setTimeout(() => {
            dispatch(categoryItemList(business_id));
        }, 500);
        setShowCategoryDeleteModal(false);
    };

    const handleEditItem = (item_id: string, category_id: string) => {
        navigate(`/apps/edit-item`, {
            state: { business_id: business_id, category_id: selectedCategoryId, item_id: item_id },
        });
        console.log('category_id: ', category_id);
        console.log('selectedCategoryId: ', selectedCategoryId);
        console.log('setSelectedCategoryId: ', setSelectedCategoryId);
    };

    // const handleSaveChanges = () => {
    //     if (editItem) {
    //         // Create a FormData object
    //         const formData = new FormData();

    //         // Append each field of the editItem to the FormData
    //         formData.append('item_id', editItem.item_id);
    //         formData.append('item_name', editItem.item_name);
    //         formData.append('price', editItem.price.toString()); // Ensure the price is a string
    //         formData.append('dietary', editItem.dietary);
    //         formData.append('available_order_type', JSON.stringify(editItem.available_order_type)); // Serialize array

    //         console.log('Dispatching update with FormData payload', formData);

    //         // Dispatch the updateItem action with the FormData
    //         dispatch(updateItem(formData));
    //     } else {
    //         setMessage('No item to save.');
    //     }
    // };

    const filteredItems = categories
        .filter((category: CategoryItem) => !selectedCategoryId || category.category_id === selectedCategoryId)
        .flatMap((category: CategoryItem) => category.items);

    console.log('Filtered Items:', filteredItems); // Debugging log

    return (
        <div className="manage-menu-container">
            <div className="header">
                <h2>Item List</h2>
                <div className="button-group">
                    <button
                        className="add-item-button"
                        onClick={() =>
                            navigate(`/apps/item-register`, {
                                state: { business_id: business_id, category_id: selectedCategoryId },
                            })
                        }>
                        + Add Item
                    </button>
                    {/* <button className="add-item-button" onClick={handleRecipe}>
                        Recipe
                    </button> */}
                </div>
            </div>

            <div className="category-tabs">
                {categories.map((category: CategoryItem) => (
                    <div
                        className={`category-tab ${selectedCategoryId === category.category_id ? 'active' : ''}`}
                        key={category.category_id}
                        onClick={() => handleCategoryClick(category.category_id)}>
                        <img src={category.logo_image} alt={category.category_name} />
                        <p>{category.category_name}</p>
                        <div>
                            <div onClick={(e) => e.stopPropagation()}>
                                <ToggleSwitch
                                    checked={toggleStates[category.category_id] || false}
                                    onChange={(checked) => handleCategoryToggle(category.category_id, checked)}
                                />
                            </div>
                        </div>
                        <div>
                            <FaRegEdit
                                size={20}
                                style={{ cursor: 'pointer', marginRight: '10px' }}
                                onClick={() =>
                                    navigate(`/apps/category-update`, {
                                        state: {
                                            business_id: business_id,
                                            category_id: selectedCategoryId,
                                        },
                                    })
                                }
                            />
                            {/* {showCategoryUpdateModal && (
                                <EditCategory show={showCategoryUpdateModal} onClose={handleCloseCategoryUpdateModal} />
                            )} */}

                            <FaTrash
                                size={20}
                                style={{ cursor: 'pointer', color: 'red' }}
                                onClick={() => handleCategoryDelete(category.category_id)}
                            />
                            <ConfirmDeleteModal
                                show={showCategoryDeleteModal}
                                onClose={() => setShowCategoryDeleteModal(false)}
                                onConfirm={confirmCategoryDelete}
                                title="Delete this Category"
                                message="Are you sure you want to delete this Category? This action cannot be undone."
                            />
                        </div>
                    </div>
                ))}
                <button
                    className="add-category-button"
                    onClick={() => navigate(`/apps/category-register`, { state: { business_id: business_id } })}>
                    + Add Category
                </button>
                {/* {showCategoryRegistrationModal && (
                    <RegisterCategory
                        show={showCategoryRegistrationModal}
                        onClose={handleCloseCategoryRegistrationModal}
                    /> */}
            </div>

            <div className="item-list">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item: CategoryItem['items'][number]) => {
                        return (
                            <div className="item-card" key={item.item_id}>
                                <img src={item.logo_image} alt={item.item_name} className="item-image" />
                                <div className="item-details">
                                    <h3>{item.item_name}</h3>
                                    <p>Price: {item.price}</p>
                                    <p>Total Amount: 0</p>
                                </div>

                                <div className="item-actions">
                                    <button
                                        className="add-recipe-button"
                                        onClick={() => handleRecipe(business_id, item.item_id)}>
                                        + Recipe
                                    </button>
                                </div>
                                <div className="item-actions">
                                    {/* <button
                                        className="edit-button"
                                        onClick={() => handleEditItem(item.item_id, item.category_id)}>
                                        Edit
                                    </button> */}
                                    <FaRegEdit
                                        size={20}
                                        style={{ cursor: 'pointer', marginRight: '10px' }}
                                        onClick={() => handleEditItem(item.item_id, item.category_id)}
                                    />
                                </div>

                                <div className="item-actions">
                                    {/* <button className="delete-button" onClick={() => handleDeleteItem(item.item_id)}>
                                        Delete
                                    </button> */}
                                    <FaTrash
                                        size={20}
                                        style={{ cursor: 'pointer', color: 'red' }}
                                        onClick={() => handleItemDelete(item.item_id)}
                                    />
                                    <ConfirmDeleteModal
                                        show={showItemDeleteModal}
                                        onClose={() => setShowItemDeleteModal(false)}
                                        onConfirm={confirmItemDelete}
                                        title="Delete this Item"
                                        message="Are you sure you want to delete this Item? This action cannot be undone."
                                    />
                                </div>
                                <ToggleSwitch
                                    checked={toggleStates[item.item_id] || false}
                                    onChange={(checked) => handleItemToggle(item.item_id, checked)}
                                />
                            </div>
                        );
                    })
                ) : (
                    <p className="no-items-message">No items available</p>
                )}
            </div>
        </div>
    );
};

const ManageMenuWithBoundary: React.FC = () => (
    <ErrorBoundary>
        <ManageMenu />
    </ErrorBoundary>
);

export default ManageMenuWithBoundary;

{
    /* <Row>
<Col md={6}>
    <Form.Group>
        <Form.Label>Item Order Type</Form.Label>
        <div>
            {['delivery', 'pick_up', 'dine_in', 'online'].map((type) => (
                <Form.Check
                    key={type}
                    type="checkbox"
                    label={type.replace('_', ' ').toUpperCase()}
                    name="available_order_type"
                    value={type}
                    checked={formData.available_order_type.includes(type)}
                    onChange={(e) => {
                        const { value, checked } = e.target;
                        const updatedOrderTypes = checked
                            ? [...formData.available_order_type, value]
                            : formData.available_order_type.filter((t) => t !== value);

                        handleChange({
                            target: { name: 'available_order_type', value: updatedOrderTypes },
                        } as any);
                    }}
                />
            ))}
        </div>
        {errors.available_order_type && (
            <small className="text-danger">{errors.available_order_type}</small>
        )}
    </Form.Group>
</Col>
</Row> */
}
