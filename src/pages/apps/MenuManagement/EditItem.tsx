import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRedux } from '../../../hooks';
import { RootState } from '../../../redux/store';
import './ManageMenu.css';
import { updateItem } from '../../../redux/menuManagementItem/actions';

interface CategoryItem {
    item_id: string;
    item_name: {
        hindi: string;
        english: string;
        gujarati: string;
    };
    price: number;
    dietary: string;
    available_order_type: string[];
    online_display_name: string;
    description: string;
    gst_type: string;
    category_id: string;
    business_id: string;
    logo_image?: File;
    swiggy_image?: File;
    banner_image?: File;
    is_loose: boolean;
    quantity_type: string;
    quantity_params: string;
    quantity_value: number;
    outlet_prices: { outlet_id: string; price: number }[]; // Example structure for outlet prices
}

interface Category {
    category_id: string;
    category_name: string;
    items: CategoryItem[];
}

const EditItemPage: React.FC = () => {
    const { item_id } = useParams<{ item_id: string }>(); // Get item_id from URL
    const { dispatch, appSelector } = useRedux();
    const [editItem, setEditItem] = useState<CategoryItem | null>(null);
    const [message, setMessage] = useState<string>('');
    const categories = appSelector((state: RootState) => state.category.categories || []);
    const navigate = useNavigate();

    useEffect(() => {
        if (item_id) {
            const itemToEdit = categories
                .flatMap((category: Category) => category.items)
                .find((item: CategoryItem) => item.item_id === item_id);

            if (itemToEdit) {
                setEditItem(itemToEdit);
            } else {
                setMessage('Item not found.');
            }
        }
    }, [item_id, categories]);

    const handleSaveChanges = () => {
        if (editItem) {
            // Create a FormData object and append the item data
            const formData = new FormData();
            formData.append('item_name', JSON.stringify(editItem.item_name));
            formData.append('online_display_name', editItem.online_display_name);
            formData.append('price', editItem.price.toString());
            formData.append('description', editItem.description);
            formData.append('dietary', editItem.dietary);
            formData.append('available_order_type', JSON.stringify(editItem.available_order_type));
            formData.append('gst_type', editItem.gst_type);
            formData.append('category_id', editItem.category_id);
            formData.append('business_id', editItem.business_id);

            // Handle optional files
            if (editItem.logo_image) {
                formData.append('logo_image', editItem.logo_image);
            }
            if (editItem.swiggy_image) {
                formData.append('swiggy_image', editItem.swiggy_image);
            }
            if (editItem.banner_image) {
                formData.append('banner_image', editItem.banner_image);
            }

            // Example: filter outlet prices
            const validOutletPrices = editItem.outlet_prices.filter(
                (price) => price.outlet_id !== '' && price.price !== 0
            );

            if (validOutletPrices.length > 0) {
                formData.append('outlet_prices', JSON.stringify(validOutletPrices));
            }

            // Handle additional fields
            formData.append('is_loose', editItem.is_loose.toString());
            formData.append('quantity_type', editItem.quantity_type);
            formData.append('quantity_params', editItem.quantity_params);
            formData.append('quantity_value', editItem.quantity_value.toString());

            // Dispatch the update action
            dispatch(updateItem(formData));
            navigate('/manage-menu'); // Navigate back to the menu list after saving
        } else {
            setMessage('No item to save.');
        }
    };

    return (
        <div className="edit-item-page">
            <h2>Edit Item</h2>
            {message && <p>{message}</p>}
            {editItem ? (
                <div>
                    <div>
                        <label>Item Name (English)</label>
                        <input
                            type="text"
                            value={editItem.item_name.english}
                            onChange={(e) =>
                                setEditItem({
                                    ...editItem,
                                    item_name: { ...editItem.item_name, english: e.target.value },
                                })
                            }
                        />
                    </div>
                    <div>
                        <label>Item Name (Hindi):</label>
                        <input
                            type="text"
                            value={editItem.item_name.hindi}
                            onChange={(e) =>
                                setEditItem({
                                    ...editItem,
                                    item_name: { ...editItem.item_name, hindi: e.target.value },
                                })
                            }
                        />
                    </div>
                    <div>
                        <label>Item Name (Gujarati):</label>
                        <input
                            type="text"
                            value={editItem.item_name.gujarati}
                            onChange={(e) =>
                                setEditItem({
                                    ...editItem,
                                    item_name: { ...editItem.item_name, gujarati: e.target.value },
                                })
                            }
                        />
                    </div>
                    <div>
                        <label>Online Display Name:</label>
                        <input
                            type="text"
                            value={editItem.online_display_name}
                            onChange={(e) => setEditItem({ ...editItem, online_display_name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Price:</label>
                        <input
                            type="number"
                            value={editItem.price}
                            onChange={(e) => setEditItem({ ...editItem, price: parseFloat(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label>Description:</label>
                        <input
                            value={editItem.description}
                            onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Dietary:</label>
                        <input
                            type="text"
                            value={editItem.dietary}
                            onChange={(e) => setEditItem({ ...editItem, dietary: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Available Order Types:</label>
                        <input
                            type="text"
                            value={editItem.available_order_type.join(', ')}
                            onChange={(e) =>
                                setEditItem({ ...editItem, available_order_type: e.target.value.split(', ') })
                            }
                        />
                    </div>
                    <div>
                        <label>GST Type:</label>
                        <input
                            type="text"
                            value={editItem.gst_type}
                            onChange={(e) => setEditItem({ ...editItem, gst_type: e.target.value })}
                        />
                    </div>

                    <div>
                        <label>Is Loose:</label>
                        <input
                            type="checkbox"
                            checked={editItem.is_loose}
                            onChange={(e) => setEditItem({ ...editItem, is_loose: e.target.checked })}
                        />
                    </div>
                    <div>
                        <label>Quantity Type:</label>
                        <input
                            type="text"
                            value={editItem.quantity_type}
                            onChange={(e) => setEditItem({ ...editItem, quantity_type: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Quantity Params:</label>
                        <input
                            type="text"
                            value={editItem.quantity_params}
                            onChange={(e) => setEditItem({ ...editItem, quantity_params: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Quantity Value:</label>
                        <input
                            type="number"
                            value={editItem.quantity_value}
                            onChange={(e) => setEditItem({ ...editItem, quantity_value: parseFloat(e.target.value) })}
                        />
                    </div>
                    <button onClick={handleSaveChanges}>Save Changes</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default EditItemPage;
