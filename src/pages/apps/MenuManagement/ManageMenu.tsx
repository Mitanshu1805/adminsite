import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { categoryItemList } from '../../../redux/menuManagementCategory/actions';
import { useRedux } from '../../../hooks';
import { RootState } from '../../../redux/store';
import './ManageMenu.css';

interface CategoryItem {
    business_id: string;
    category_id: string;
    category_name: string;
    category_names: { [key: string]: string };
    logo_image: string;
    items: Array<{
        item_id: string;
        item_name: string;
        price: number;
        dietary: string;
        logo_image: string;
        available_order_type: string[];
    }>;
}

const ManageMenu: React.FC = () => {
    const { business_id } = useParams<{ business_id: string }>();
    const { dispatch, appSelector } = useRedux();
    const categories = appSelector((state: RootState) => state.category.categories || []);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (business_id) {
            dispatch(categoryItemList(business_id));
        }
    }, [dispatch, business_id]);

    const handleCategoryClick = (category_id: string) => {
        console.log('Category Clicked:', category_id); // Debugging log
        setSelectedCategoryId(category_id === selectedCategoryId ? null : category_id);
    };

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
                    </div>
                ))}
            </div>

            <div className="item-list">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item: CategoryItem['items'][number]) => (
                        <div className="item-card" key={item.item_id}>
                            <img src={item.logo_image} alt={item.item_name} className="item-image" />
                            <div className="item-details">
                                <h3>{item.item_name}</h3>
                                <p>Price: {item.price}</p>
                                <p>Total Amount: 0</p>
                            </div>
                            <div className="item-actions">
                                <button className="edit-button">Edit</button>
                                <button className="delete-button">Delete</button>
                            </div>
                        </div>
                    ))
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
