import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { categoryItemList, categoryUpdateIsActive } from '../../../redux/menuManagementCategory/actions';
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
    const { business_id } = useParams<{ business_id: string }>();

    const { dispatch, appSelector } = useRedux();
    const [showCategoryRegistrationModal, setShowCategoryRegistrationModal] = useState(false);
    const [showCategoryUpdateModal, setShowCategoryUpdateModal] = useState(false);
    const [toggleStates, setToggleStates] = useState<{ [key: string]: boolean }>({});
    const [isToggled, setIsToggled] = useState(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editItem, setEditItem] = useState<CategoryItem['items'][number] | null>(null);
    const [message, setMessage] = useState<string>('');
    const categories = appSelector((state: RootState) => state.category.categories || []);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (business_id) {
            dispatch(categoryItemList(business_id));
        }
    }, [dispatch, business_id]);

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
        setSelectedCategoryId(category_id === selectedCategoryId ? null : category_id);
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

    const handleCategoryRegister = () => {
        console.log('Category Register Clicked');

        if (!showCategoryRegistrationModal) {
            setShowCategoryRegistrationModal(true);
        }
    };

    const handleCategoryUpdate = () => {
        console.log('Category Update Clicked');

        if (!showCategoryUpdateModal) {
            setShowCategoryUpdateModal(true);
        }
    };

    const handleCloseCategoryRegistrationModal = () => {
        console.log('Category Register Closed');
        setShowCategoryRegistrationModal(false);
    };

    const handleCloseCategoryUpdateModal = () => {
        console.log('Category Update Clicked');
        setShowCategoryUpdateModal(false);
    };

    const handleDeleteItem = (item_id: string) => {
        const confirmDeleteitem = window.confirm('Are you sure you want to delete this Item?');
        if (confirmDeleteitem) {
            dispatch(deleteItem(item_id));
            setMessage('Item deleted successfully');
        }
    };

    const handleDeleteCategory = (category_id: string) => {
        const confirmDeletecategory = window.confirm('Are you sure you want to delete this Category?');
        if (confirmDeletecategory) {
            dispatch(deleteCategory(category_id));
            setMessage('Category deleted successfully');
        }
    };

    const handleEditItem = (item_id: string, category_id: string) => {
        navigate(`/apps/edit-item/${item_id}/${selectedCategoryId}/${business_id}`);
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
                <button
                    className="add-item-button"
                    onClick={() => navigate(`/apps/item-register/${business_id!}/${selectedCategoryId}`)}>
                    + Add Item
                </button>
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
                        <td>
                            <FaRegEdit
                                size={20}
                                style={{ cursor: 'pointer', marginRight: '10px' }}
                                onClick={handleCategoryUpdate}
                            />
                            {showCategoryUpdateModal && (
                                <EditCategory show={showCategoryUpdateModal} onClose={handleCloseCategoryUpdateModal} />
                            )}
                        </td>
                        <td>
                            <FaTrash
                                size={20}
                                style={{ cursor: 'pointer', color: 'red' }}
                                onClick={() => handleDeleteCategory(category.category_id)}
                            />
                        </td>
                    </div>
                ))}
                <button
                    className="add-category-button"
                    onClick={() => navigate(`/apps/category-register/${business_id}`)}>
                    + Add Category
                </button>
                {showCategoryRegistrationModal && (
                    <RegisterCategory
                        show={showCategoryRegistrationModal}
                        onClose={handleCloseCategoryRegistrationModal}
                    />
                )}
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
                                        className="edit-button"
                                        onClick={() => handleEditItem(item.item_id, item.category_id)}>
                                        Edit
                                    </button>
                                </div>

                                <div className="item-actions">
                                    <button className="delete-button" onClick={() => handleDeleteItem(item.item_id)}>
                                        Delete
                                    </button>
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
