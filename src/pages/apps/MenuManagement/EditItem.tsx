import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRedux } from '../../../hooks';
import { RootState } from '../../../redux/store';
import { updateItem } from '../../../redux/menuManagementItem/actions';

interface CategoryItem {
    item_id: string;
    item_name: string;
    price: number;
    dietary: string;
    available_order_type: string[];
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
            // Find the item to edit from the categories
            const itemToEdit = categories
                .flatMap((category: Category) => category.items) // Now we specify `Category` type
                .find((item: CategoryItem) => item.item_id === item_id); // Now we specify `CategoryItem` type

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
            formData.append('item_id', editItem.item_id);
            formData.append('item_name', editItem.item_name);
            formData.append('price', editItem.price.toString());
            formData.append('dietary', editItem.dietary);
            formData.append('available_order_type', JSON.stringify(editItem.available_order_type));

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
                        <label>Item Name:</label>
                        <input
                            type="text"
                            value={editItem.item_name}
                            onChange={(e) => setEditItem({ ...editItem, item_name: e.target.value })}
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
                    <button onClick={handleSaveChanges}>Save Changes</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default EditItemPage;
