import React from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Card, Row, Col, Alert } from 'react-bootstrap';

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
    // sequence_no: number;
    // disable_until: string | null;
}

interface Category {
    category_id: string;
    category_name: string;
    items: CategoryItem[];
}

interface EditItemStep1Props {
    handleSubmit: (e: React.FormEvent) => void;
    editItem: CategoryItem | null;
    setEditItem: React.Dispatch<React.SetStateAction<CategoryItem | null>>;
    message: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const EditItemStep1: React.FC<EditItemStep1Props> = ({
    editItem,
    setEditItem,
    handleSubmit,
    message,
    handleInputChange,
}) => {
    if (!editItem) {
        return <p>Loading...</p>;
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof CategoryItem) => {
        const file = e.target.files?.[0];
        if (file) {
            setEditItem({
                ...editItem!,
                [field]: file,
            });
        }
    };

    // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = e.target;

    //     setEditItem((prev) => {
    //         const updateItem = prev
    //             ? {
    //                   ...prev,
    //                   item_names: {
    //                       ...prev.item_names,
    //                       [name]: value,
    //                   },
    //               }
    //             : null;

    //         return updateItem;
    //     });
    // };
    return (
        <Container className="register-item-container">
            <Card className="shadow-sm">
                <Card.Header as="h2" className="text-center">
                    Edit Item
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Menu Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="logo_image"
                                    onChange={(e) => {
                                        const file = (e.target as HTMLInputElement).files?.[0];
                                        if (file) {
                                            setEditItem({
                                                ...editItem!,
                                                logo_image: file,
                                            });
                                        }
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Swiggy Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="swiggy_image"
                                    onChange={(e) => {
                                        const file = (e.target as HTMLInputElement).files?.[0];
                                        if (file) {
                                            setEditItem({
                                                ...editItem!,
                                                swiggy_image: file,
                                            });
                                        }
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Banner Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="banner_image"
                                    onChange={(e) => {
                                        const file = (e.target as HTMLInputElement).files?.[0];
                                        if (file) {
                                            setEditItem({
                                                ...editItem!,
                                                banner_image: file,
                                            });
                                        }
                                    }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Item Name (English)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="english"
                                    value={editItem?.item_names.english || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Item Name (Hindi)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="hindi"
                                    value={editItem?.item_names.hindi}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Item Name (Gujarati)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="gujarati"
                                    value={editItem?.item_names.gujarati}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* <Row className="mb-3">
                        <Col md={6}>
                            <Form.Check
                                type="checkbox"
                                label="Loose Quantity"
                                name="is_loose"
                                checked={formData.is_loose}
                                onChange={handleChange}
                            />
                        </Col>
                    </Row> */}
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Label>Online Display Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="online_display_name"
                                value={editItem?.online_display_name}
                                onChange={handleInputChange}
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Label>Item Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={editItem?.description}
                                onChange={handleInputChange}
                            />
                        </Col>
                    </Row>

                    {/* {formData.is_loose && (
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label>Quantity Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="quantity_type"
                                    value={formData.quantity_type}
                                    onChange={handleChange}>
                                    <option value="">Select Quantity Type</option>
                                    <option value="piece">Piece</option>
                                    <option value="weight">Weight</option>
                                    <option value="volume">Volume</option>
                                </Form.Control>
                            </Col>
                            {formData.quantity_type && (
                                <Col md={6}>
                                    <Form.Label>Quantity Value</Form.Label>
                                    <Row>
                                        <Col md={7}>
                                            <Form.Control
                                                type="number"
                                                name="quantity_value"
                                                value={formData.quantity_value}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                        {formData.quantity_type !== 'piece' && (
                                            <Col md={5}>
                                                <Form.Select
                                                    name="quantity_unit"
                                                    value={formData.quantity_unit}
                                                    onChange={handleChange}>
                                                    <option value="">Select Unit</option>
                                                    {formData.quantity_type === 'weight' ? (
                                                        <>
                                                            <option value="gm">gm</option>
                                                            <option value="kg">kg</option>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <option value="ml">ml</option>
                                                            <option value="lt">lt</option>
                                                        </>
                                                    )}
                                                </Form.Select>
                                            </Col>
                                        )}
                                    </Row>
                                </Col>
                            )}
                        </Row>
                    )} */}

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Label>Dietary Type</Form.Label>
                            <Form.Control
                                as="select"
                                name="dietary"
                                value={editItem?.dietary}
                                onChange={handleInputChange}>
                                <option value="">Select Dietary Type</option>
                                <option value="veg">Veg</option>
                                <option value="non-veg">Non-Veg</option>
                            </Form.Control>
                        </Col>
                        <Col md={6}>
                            <Form.Label>GST Type</Form.Label>
                            <Form.Control
                                as="select"
                                name="gst_type"
                                value={editItem?.gst_type}
                                onChange={handleInputChange}>
                                <option value="">Select GST Type</option>
                                <option value="goods">Goods</option>
                                <option value="services">Services</option>
                            </Form.Control>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EditItemStep1;

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
                        <input
                            type="text"
                            value={editItem.gst_type}
                            onChange={(e) => setEditItem({ ...editItem, gst_type: e.target.value })}
                        />
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
                                <div>
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
                                </div>
                            )}
                        </div>
                    )}

                    <button onClick={handleSubmit}>Save Changes</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div> */
}
