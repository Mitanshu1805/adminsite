import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRedux } from '../../../hooks';
import { RootState } from '../../../redux/store';
import './ManageMenu.css';
import { updateItem } from '../../../redux/menuManagementItem/actions';
import { categoryItemList } from '../../../redux/actions';

interface CategoryItem {
    selectedCategoryId: string;
    item_id: string;
    item_names: {
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
    outlets: Outlet[];
    outlet_prices: { outlet_id: string; price: number }[];
}

interface Outlet {
    outlet_id: string;
    outlet_name: string;
    price: number;
    sequence_no: number;
    disable_until: string | null;
}

interface Category {
    category_id: string;
    category_name: string;
    items: CategoryItem[];
}

const EditItemPage: React.FC = () => {
    const { item_id, category_id, selectedCategoryId, business_id } =
        useParams<{ item_id: string; category_id: string; selectedCategoryId: string, business_id: string }>(); // Get item_id from URL
    const { dispatch, appSelector } = useRedux();
    const [editItem, setEditItem] = useState<CategoryItem | null>(null);
    const [message, setMessage] = useState<string>('');
    const categories = appSelector((state: RootState) => state.category.categories || []);
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (item_id) {
    //         const itemToEdit = categories
    //             .flatMap((category: Category) => category.items)
    //             .find((item: CategoryItem) => item.item_id === item_id);
    //         console.log(categories);
    //         // console.log(category);
    //         if (itemToEdit) {
    //             console.log('Item to Edit:', itemToEdit);

    //             const category = categories.find((cat: Category) => cat.category_id === category_id);

    //             if (category) {
    //                 console.log('Category for the item: ', category.category_id);
    //             }

    //             setEditItem(itemToEdit);
    //         } else {
    //             setMessage('Item not found.');
    //         }
    //     }
    // }, [item_id, categories]);

    useEffect(() => {
        if (item_id) {
            const itemToEdit = categories
                .flatMap((category: Category) =>
                    category.items.map((item: CategoryItem) => ({
                        ...item,
                        category_id: category.category_id,
                    }))
                )
                .find((item: CategoryItem) => item.item_id === item_id);

            if (itemToEdit) {
                console.log('Item to Edit:', itemToEdit);
                setEditItem(itemToEdit); // Set the found item to the state
            } else {
                setMessage('Item not found.');
            }
        }
    }, [item_id, categories]); // Trigger effect when item_id or categories change

    const handleSaveChanges = () => {
        if (editItem) {
            // Create a FormData object and append the item data
            const formData = new FormData();
            formData.append('item_name', JSON.stringify(editItem.item_names));
            formData.append('online_display_name', editItem.online_display_name);
            formData.append('price', editItem.price.toString());
            formData.append('description', editItem.description);
            formData.append('dietary', editItem.dietary);
            formData.append('available_order_type', JSON.stringify(editItem.available_order_type));
            formData.append('gst_type', editItem.gst_type);
            formData.append('category_id', editItem.category_id);
            formData.append('item_id', editItem.item_id);

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

            const outletPrices = editItem.outlets.map((outlet) => ({
                outlet_id: outlet.outlet_id,
                price: outlet.price,
            }));

            const validOutletPrices = outletPrices.filter(
                (outletPrice) => outletPrice.outlet_id !== '' && outletPrice.price !== 0
            );

            if (validOutletPrices?.length > 0) {
                formData.append('outlet_prices', JSON.stringify(validOutletPrices));
            }

            // Handle additional fields
            formData.append('is_loose', editItem.is_loose.toString());
            formData.append('quantity_type', editItem.quantity_type);
            formData.append('quantity_params', editItem.quantity_params);
            formData.append('quantity_value', editItem.quantity_value.toString());

            // Dispatch the update action
            dispatch(updateItem(formData));

            setTimeout(() => {
                setMessage('');
                dispatch(categoryItemList(business_id!));
            }, 500);
            // navigate('/apps/manage-menu/:business_id'); // Navigate back to the menu list after saving
            navigate(`/apps/manage-menu/${business_id}`);
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
                        <label>Upload Logo Image</label>
                        {editItem?.logo_image && editItem.logo_image instanceof File && (
                            <div>
                                <img
                                    src={URL.createObjectURL(editItem.logo_image)}
                                    alt="Logo Preview"
                                    style={{ width: '100px', height: 'auto', marginBottom: '10px' }}
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setEditItem({
                                        ...editItem!,
                                        logo_image: file,
                                    });
                                }
                            }}
                        />
                    </div>

                    <div>
                        <label>Upload Swiggy Image</label>
                        {editItem?.swiggy_image && editItem.swiggy_image instanceof File && (
                            <div>
                                <img
                                    src={URL.createObjectURL(editItem.swiggy_image)}
                                    alt="Swiggy Image Preview"
                                    style={{ width: '100px', height: 'auto', marginBottom: '10px' }}
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setEditItem({
                                        ...editItem!,
                                        swiggy_image: file,
                                    });
                                }
                            }}
                        />
                    </div>

                    <div>
                        <label>Upload Banner Image</label>
                        {editItem?.banner_image && editItem.banner_image instanceof File && (
                            <div>
                                <img
                                    src={URL.createObjectURL(editItem.banner_image)}
                                    alt="Banner Image Preview"
                                    style={{ width: '100px', height: 'auto', marginBottom: '10px' }}
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setEditItem({
                                        ...editItem!,
                                        banner_image: file,
                                    });
                                }
                            }}
                        />
                    </div>


                    <div>
                        <label>Item Name (English)</label>
                        <input
                            type="text"
                            value={editItem.item_names.english}
                            onChange={(e) =>
                                setEditItem({
                                    ...editItem,
                                    item_names: { ...editItem.item_names, english: e.target.value },
                                })
                            }
                        />
                    </div>
                    <div>
                        <label>Item Name (Hindi):</label>
                        <input
                            type="text"
                            value={editItem.item_names.hindi}
                            onChange={(e) =>
                                setEditItem({
                                    ...editItem,
                                    item_names: { ...editItem.item_names, hindi: e.target.value },
                                })
                            }
                        />
                    </div>
                    <div>
                        <label>Item Name (Gujarati):</label>
                        <input
                            type="text"
                            value={editItem.item_names.gujarati}
                            onChange={(e) =>
                                setEditItem({
                                    ...editItem,
                                    item_names: { ...editItem.item_names, gujarati: e.target.value },
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
                        <select
                            value={editItem.dietary}
                            onChange={(e) => setEditItem({ ...editItem, dietary: e.target.value })}>
                            <option value="veg">Veg</option>
                            <option value="non-veg">Non-Veg</option>
                        </select>
                    </div>

                    <div>
                        <label>Available Order Types:</label>
                        <select
                            multiple
                            value={editItem.available_order_type}
                            onChange={(e) => {
                                const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
                                setEditItem({ ...editItem, available_order_type: selectedOptions });
                            }}>
                            <option value="dine_in">Dine In</option>
                            <option value="take_away">Take Away</option>
                            <option value="delivery">Delivery</option>
                            <option value="pickup">Pickup</option>
                        </select>
                    </div>

                    <div>
                        <label>GST Type:</label>
                        {/* <input
                            type="text"
                            value={editItem.gst_type}
                            onChange={(e) => setEditItem({ ...editItem, gst_type: e.target.value })}
                        /> */}
                        <select
                            value={editItem.gst_type}
                            onChange={(e) => setEditItem({ ...editItem, gst_type: e.target.value })}>
                            {' '}
                            <option value="goods">Goods</option>
                            <option value="services">Services</option>
                        </select>
                    </div>

                    <div>
                        <label>Is Loose:</label>
                        <input
                            type="checkbox"
                            checked={editItem.is_loose}
                            onChange={(e) => setEditItem({ ...editItem, is_loose: e.target.checked })}
                        />
                    </div>

                    {editItem.is_loose && (
                        <div>
                            <div>
                                <label>Quantity Type:</label>
                                <select
                                    value={editItem.quantity_type}
                                    onChange={(e) => setEditItem({ ...editItem, quantity_type: e.target.value })}>
                                    <option value="piece">Piece</option>
                                    <option value="weight">Weight</option>
                                    <option value="volume">Volume</option>
                                </select>
                            </div>

                            {editItem.quantity_type === 'piece' && (
                                <div>
                                    <label>Quantity (Piece):</label>
                                    <input
                                        type="number"
                                        value={editItem.quantity_value}
                                        onChange={(e) =>
                                            setEditItem({ ...editItem, quantity_value: parseFloat(e.target.value) })
                                        }
                                    />
                                </div>
                            )}

                            {(editItem.quantity_type === 'weight' || editItem.quantity_type === 'volume') && (
                                <>
                                    <div>
                                        <label>Quantity Params:</label>
                                        <select
                                            value={editItem.quantity_params}
                                            onChange={(e) =>
                                                setEditItem({ ...editItem, quantity_params: e.target.value })
                                            }>
                                            {editItem.quantity_type === 'weight' && (
                                                <>
                                                    <option value="gm">GM</option>
                                                    <option value="kg">KG</option>
                                                </>
                                            )}
                                            {editItem.quantity_type === 'volume' && (
                                                <>
                                                    <option value="m">M</option>
                                                    <option value="lt">LT</option>
                                                </>
                                            )}
                                        </select>
                                    </div>

                                    <div>
                                        <label>Quantity Value:</label>
                                        <input
                                            type="number"
                                            value={editItem.quantity_value}
                                            onChange={(e) =>
                                                setEditItem({ ...editItem, quantity_value: parseFloat(e.target.value) })
                                            }
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    <button onClick={handleSaveChanges}>Save Changes</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default EditItemPage;
