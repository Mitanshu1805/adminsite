import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoryItemList, categoryUpdateIsActive } from '../../../redux/menuManagementCategory/actions';
import { useRedux } from '../../../hooks';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import { RootState } from '../../../redux/store';
import './ManageMenu.css';

interface CategoryItem {
    category_id: string;
    category_name: string;
    logo_image: string;
}

const OutletMenu: React.FC = () => {
    const { business_id, outlet_id } = useParams<{ business_id: string; outlet_id: string }>();
    const { dispatch, appSelector } = useRedux();

    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [toggleStates, setToggleStates] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        // Check if both business_id and outlet_id are defined before dispatching the action
        if (business_id && outlet_id) {
            dispatch(categoryItemList(business_id, outlet_id));
        }
    }, [business_id, outlet_id, dispatch]);

    // useEffect(() => {
    //     // You can update the categories from the Redux store or prop here if needed
    //     setCategories(appSelector((state: RootState) => state.menuManagement.categories));
    // }, [appSelector]);

    const handleCategoryClick = (categoryId: string) => {
        setSelectedCategoryId(categoryId);
    };

    const handleCategoryToggle = (categoryId: string, checked: boolean) => {
        setToggleStates((prevState) => ({
            ...prevState,
            [categoryId]: checked,
        }));

        // Dispatch the action to update the category's active status
        // dispatch(categoryUpdateIsActive(business_id, outlet_id, categoryId, checked));
    };

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
        </div>
    );
};

export default OutletMenu;
