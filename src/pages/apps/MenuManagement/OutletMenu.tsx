import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { categoryItemList, categoryUpdateIsActive } from '../../../redux/menuManagementCategory/actions';
import { useRedux } from '../../../hooks';
import { RootState } from '../../../redux/store';
import ToggleSwitch from './ToggleSwitch';
import './ManageMenu.css';

interface Item {
    item_id: string;
    item_name: string;
    price: number;
    logo_image: string;
}

interface CategoryItem {
    category_id: string;
    category_name: string;
    logo_image: string;
    items: Item[];
}

const OutletMenu: React.FC = () => {
    // const { business_id, outlet_id } = useParams<{ business_id: string; outlet_id: string }>();
    const location = useLocation();
    const business_id = location.state?.business_id;
    const outlet_id = location.state?.outlet_id;
    const { dispatch, appSelector } = useRedux();

    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [toggleStates, setToggleStates] = useState<{ [key: string]: boolean }>({});

    const categories = appSelector((state: RootState) => state.category.categories) || [];

    useEffect(() => {
        if (business_id && outlet_id) {
            dispatch(categoryItemList(business_id, outlet_id));
        }
    }, [business_id, outlet_id, dispatch]);

    useEffect(() => {
        if (categories.length > 0 && !selectedCategoryId) {
            setSelectedCategoryId(categories[0].category_id);
        }
    }, [categories, selectedCategoryId]);

    const handleCategoryClick = (categoryId: string) => {
        setSelectedCategoryId(categoryId);
    };

    // const handleCategoryToggle = (categoryId: string, checked: boolean) => {
    //     setToggleStates((prevState) => ({
    //         ...prevState,
    //         [categoryId]: checked,
    //     }));

    //     if (business_id && outlet_id) {
    //         dispatch(categoryUpdateIsActive(business_id, outlet_id, categoryId, checked));
    //     }
    // };

    const handleEditItem = (itemId: string, categoryId: string) => {
        console.log(`Edit item ${itemId} in category ${categoryId}`);
    };

    const handleDeleteItem = (itemId: string) => {
        console.log(`Delete item ${itemId}`);
    };

    const handleItemToggle = (itemId: string, checked: boolean) => {
        setToggleStates((prevState) => ({
            ...prevState,
            [itemId]: checked,
        }));
    };

    const filteredItems = categories.find((cat: CategoryItem) => cat.category_id === selectedCategoryId)?.items || [];

    return (
        <div className="manage-menu-container">
            <div className="header">
                <h2>Item List</h2>
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
                                {/* <ToggleSwitch
                                    checked={toggleStates[category.category_id] || false}
                                    onChange={(checked) => handleCategoryToggle(category.category_id, checked)}
                                /> */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="item-list">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item: Item) => (
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
                                    onClick={() => handleEditItem(item.item_id, selectedCategoryId!)}>
                                    Edit
                                </button>
                                <button className="delete-button" onClick={() => handleDeleteItem(item.item_id)}>
                                    Delete
                                </button>
                            </div>
                            {/* <ToggleSwitch
                                checked={toggleStates[item.item_id] || false}
                                onChange={(checked) => handleItemToggle(item.item_id, checked)}
                            /> */}
                        </div>
                    ))
                ) : (
                    <p className="no-items-message">No items available</p>
                )}
            </div>
        </div>
    );
};

export default OutletMenu;
