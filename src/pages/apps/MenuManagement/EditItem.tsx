import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    // outlets: Outlet[];
    outlets: { outlet_id: string; price: number }[];
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
    const { item_id, business_id } = useParams<{ item_id: string; business_id: string }>();
    const { dispatch, appSelector } = useRedux();
    const [selectedOutlets, setSelectedOutlets] = useState<Outlet[]>([]);
    const [editItem, setEditItem] = useState<CategoryItem | null>(null);
    const [message, setMessage] = useState<string>('');
    const categories = appSelector((state: RootState) => state.category.categories || []);
    const [successMsg, setSuccess] = useState<string>('');
    const [errorMsg, setError] = useState<string>('');
    const navigate = useNavigate();
    const isEditMode = Boolean(editItem && item_id);
    // Define edit mode based on item existence

    useEffect(() => {
        if (item_id) {
            console.log('Categories Data:', categories);
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
                setEditItem(itemToEdit);
            } else {
                setMessage('Item not found.');
            }
        }
    }, [item_id, categories]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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

        // const validOutletPrices = editItem.outlets
        //     .map((outlet) => ({
        //         outlet_id: outlet.outlet_id,
        //         price: outlet.price,
        //     }))
        //     .filter((outletPrice) => outletPrice.outlet_id !== '' && outletPrice.price !== 0);

        // if (validOutletPrices.length > 0) {
        //     formData.append('outlet_prices', JSON.stringify(validOutletPrices));
        // }
        formData.append('outlet_prices', JSON.stringify(editItem.outlets));
        formData.append('is_loose', editItem.is_loose.toString());
        formData.append('quantity_type', editItem.quantity_type);
        formData.append('quantity_params', editItem.quantity_params);
        formData.append('quantity_value', editItem.quantity_value.toString());

        dispatch(updateItem(formData));

        setTimeout(() => {
            // setMessage('');
            dispatch(categoryItemList(business_id!));
        }, 500);

        navigate(`/apps/manage-menu/${business_id}`);
    };

    // console.log('Selected outlets in parent component:', selectedOutlets);

    const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } = useMultistepForm([
        <EditItemStep1 handleSubmit={handleSubmit} editItem={editItem} setEditItem={setEditItem} message={message} />,
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
                                    if (isLastStep) {
                                        handleSubmit(e);
                                    } else {
                                        next();
                                    }
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
