import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useRedux } from '../../../hooks';
import { RootState } from '../../../redux/store';
import { useMultistepForm } from '../../../hooks/useMultistepForm';
import { updateItem } from '../../../redux/menuManagementItem/actions';
import { categoryItemList } from '../../../redux/actions';
import EditItemStep1 from './EditItemStep1';
import EditItemStep2 from './EditItemStep2';
import EditItemStep3 from './EditItemStep3';
import { Button, Alert, Container, Card } from 'react-bootstrap';

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
}

interface Category {
    category_id: string;
    category_name: string;
    items: CategoryItem[];
}

const EditItemPage: React.FC = () => {
    // const { item_id, business_id } = useParams<{ item_id: string; business_id: string }>();
    const location = useLocation();
    const business_id = location.state?.business_id;
    const item_id = location.state?.item_id;
    const category_id = location.state?.category_id;
    const { dispatch, appSelector } = useRedux();
    const [isEditing, setIsEditing] = useState(false);
    const [selectedOutlets, setSelectedOutlets] = useState<Outlet[]>([]);
    const [editItem, setEditItem] = useState<CategoryItem | null>(null);
    const [message, setMessage] = useState<string>('');
    const categories = appSelector((state: RootState) => state.category.categories || []);
    const [successMsg, setSuccess] = useState<string>('');
    const [errorMsg, setError] = useState<string>('');
    const navigate = useNavigate();
    const isEditMode = Boolean(editItem && item_id);

    useEffect(() => {
        if (!editItem) return;
        console.log('updated ITEM: ', editItem);
    }, [editItem]);

    // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    //     setIsEditing(true);
    //     const { name, value } = e.target;

    //     setEditItem((prev) => {
    //         if (!prev) return prev; // Prevent errors if state is null

    //         // If the field belongs to `item_names`, update it inside the object
    //         if (name.startsWith('item_names.')) {
    //             const key = name.replace('item_names.', ''); // Extract field name (e.g., "english")
    //             return {
    //                 ...prev,
    //                 item_names: {
    //                     ...prev.item_names,
    //                     [key]: value, // Update only the targeted field
    //                 },
    //             };
    //         }

    //         // Otherwise, update the field directly
    //         return {
    //             ...prev,
    //             [name]: value,
    //         };
    //     });
    // };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setIsEditing(true);

        const { name, type } = e.target;
        let value: any;

        if (type === 'file') {
            const input = e.target as HTMLInputElement;
            value = input.files?.[0] || null;
        } else if (e.target instanceof HTMLSelectElement && e.target.multiple) {
            value = Array.from(e.target.selectedOptions, (option) => option.value);
        } else if (type === 'number') {
            value = e.target.value ? Number(e.target.value) : '';
        } else {
            value = e.target.value;
        }

        // setEditItem((prev) =>
        //     prev
        //         ? {
        //             ...prev,
        //             item_names: {
        //                 ...prev.item_names,
        //                 [name]: value,
        //             },
        //         }
        //         : null
        // );

        setEditItem((prev) =>
            prev
                ? {
                      ...prev,
                      ...(name in prev.item_names
                          ? { item_names: { ...prev.item_names, [name]: value } } // Update `item_names`
                          : { [name]: value }), // Update other fields
                  }
                : null
        );
    };

    useEffect(() => {
        if (!item_id || editItem || isEditing) return;

        console.log('Fetching categories from Redux:', categories);

        if (categories.length === 0) {
            dispatch(categoryItemList(business_id!));
        }

        const itemToEdit = categories
            .flatMap((category: Category) =>
                category.items.map((item: CategoryItem) => {
                    // console.log('Item:', item);
                    return {
                        ...item,
                        category_id: category.category_id,
                        outlet_prices:
                            item.outlets?.map((outlet: Outlet) => ({
                                outlet_id: outlet.outlet_id,
                                price: outlet.price,
                            })) ?? [],
                    };
                })
            )
            .find((item: CategoryItem) => item.item_id === item_id);

        if (itemToEdit) {
            console.log('item to EDIT found:', itemToEdit);

            setEditItem((prev) => {
                const updatedItem = { ...itemToEdit, item_id };

                console.log('Setting editItem:', updatedItem);
                return updatedItem;
            });
        }
    }, [item_id, categories, dispatch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTimeout(() => {
            console.log('Submitting category after delay:', editItem);
        }, 100);

        if (!editItem) {
            setMessage('No item to save.');
            return;
        }

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

        if (editItem.logo_image) {
            formData.append('logo_image', editItem.logo_image);
        }
        if (editItem.swiggy_image) {
            formData.append('swiggy_image', editItem.swiggy_image);
        }
        if (editItem.banner_image) {
            formData.append('banner_image', editItem.banner_image);
        }
        formData.append('outlet_prices', JSON.stringify(editItem.outlet_prices));
        formData.append('is_loose', editItem.is_loose.toString());
        formData.append('quantity_type', editItem.quantity_type);
        formData.append('quantity_params', editItem.quantity_params);
        formData.append('quantity_value', editItem.quantity_value.toString());

        dispatch(updateItem(formData));

        setTimeout(() => {
            // setMessage('');
            dispatch(categoryItemList(business_id!));
        }, 500);

        navigate(`/apps/manage-menu`, { state: { business_id: business_id } });
    };

    // useEffect(() => {
    //     console.log('useEffect triggered');
    //     console.log('Categories Data:', categories);
    //     if (!categories.length) return;
    //     if (item_id) {
    //         console.log('Categories Data:', categories);
    //         const itemToEdit = categories
    //             .flatMap((category: Category) =>
    //                 category.items.map((item: CategoryItem) => {
    //                     console.log('Item:', item);
    //                     return {
    //                         ...item,
    //                         category_id: category.category_id,
    //                         outlet_prices:
    //                             item.outlets?.map((outlet: Outlet) => ({
    //                                 outlet_id: outlet.outlet_id,
    //                                 price: outlet.price,
    //                             })) ?? [],
    //                     };
    //                 })
    //             )
    //             .find((item: CategoryItem) => item.item_id === item_id);

    //         console.log('Item with outlet_prices:', JSON.stringify(itemToEdit, null, 2));

    //         console.log('Categories Data:', categories);

    //         if (itemToEdit) {
    //             console.log('Item to Edit:', itemToEdit);
    //             setEditItem(itemToEdit);
    //         } else {
    //             setMessage('Item not found.');
    //         }
    //     }
    // }, [item_id, categories]);

    // console.log('Selected outlets in parent component:', selectedOutlets);

    const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } = useMultistepForm([
        <EditItemStep1
            handleSubmit={handleSubmit}
            editItem={editItem}
            setEditItem={setEditItem}
            message={message}
            handleInputChange={handleInputChange}
        />,
        <EditItemStep2
            selectedOutlets={selectedOutlets} // ✅ Pass the state
            setSelectedOutlets={setSelectedOutlets}
        />,
        <EditItemStep3
            handleSubmit={handleSubmit}
            editItem={editItem}
            setEditItem={setEditItem}
            message={message}
            selectedOutlets={selectedOutlets}
        />,
    ]);

    return (
        <Container className="register-business-container">
            <Card className="shadow-sm">
                <Card.Body>
                    <form onSubmit={handleSubmit}>
                        {' '}
                        {/* Single Form here */}
                        <div>
                            Step {currentStepIndex + 1} of {steps.length}
                        </div>
                        {step}
                        <div className="d-flex justify-content-center mt-4 gap-3">
                            {!isFirstStep && (
                                <Button variant="secondary" type="button" onClick={back} className="px-4 py-2">
                                    Back
                                </Button>
                            )}

                            <Button
                                variant="primary"
                                onClick={(e) => {
                                    console.log('Before clicking next: ', editItem);
                                    if (isLastStep) {
                                        handleSubmit(e);
                                    } else {
                                        next();
                                    }
                                    console.log('After clicking next: ', editItem);
                                }}
                                className="px-4 py-2">
                                {isLastStep ? (isEditMode ? 'Update' : 'Finish') : 'Next'}
                            </Button>
                        </div>
                    </form>

                    {errorMsg && (
                        <Alert variant="danger" className="mt-3">
                            {errorMsg}
                        </Alert>
                    )}
                    {successMsg && (
                        <Alert variant="success" className="mt-3">
                            {successMsg}
                        </Alert>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EditItemPage;

{
    /* <div className="edit-item-page">
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
                        /> s}
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
        </div> */
}
