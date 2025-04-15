import React from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Card, Row, Col, Alert } from 'react-bootstrap';

type categoryData = {
    category_name: {
        hindi: string;
        english: string;
        gujarati: string;
    };

    logo_image: File | null;
    swiggy_image: File | null;
    banner_image: File | null;
    items: itemsData[];
};

type itemsData = {
    item_name: {
        hindi: string;
        english: string;
        gujarati: string;
    };
    item_id: string;
    language_id: string;
    online_display_name: string;
    logo_image: string;
    swiggy_image: string;
    banner_image: string;
    price: number;
    description: string;
    dietery: string;
    // available_order_type: availableOrderType[];
    available_order_type: string;
    gst_type: string;
    category_id: string;
    business_id: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    is_loose: boolean;
    quantity_type: string;
    quantity_value: string;
    quantity_params: string;
    dietary: string;
};

interface availableOrderType {
    // dine_in: number;
}

export interface RegisterCategoryOneProps {
    formData: {
        category_name: {
            hindi: string;
            english: string;
            gujarati: string;
        };

        logo_image: File | null;
        swiggy_image: File | null;
        banner_image: File | null;
    };
    errorMsg: string;
    successMsg: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    logoPreview: string | null;
    swiggyPreview: string | null;
    bannerPreview: string | null;
    errors: Record<string, string>;
}

const RegisterCategoryStep1: React.FC<RegisterCategoryOneProps> = ({
    formData,
    errorMsg,
    successMsg,
    handleChange,
    handleFileChange,
    logoPreview,
    swiggyPreview,
    bannerPreview,
    errors,
}) => {
    const handleLooseQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;

        handleChange({
            target: { name: 'is_loose', value: checked },
        } as any); // Ensure boolean value is passed

        // Reset quantity fields when 'is_loose' is unchecked
        if (!checked) {
            handleChange({ target: { name: 'quantity_type', value: '' } } as any);
            handleChange({ target: { name: 'quantity_params', value: '' } } as any);
            handleChange({ target: { name: 'quantity_value', value: '' } } as any);
        }
    };
    const handleQuantityParamsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        handleChange({
            target: { name, value },
        } as any);
    };
    const renderCategory = (data: categoryData) => (
        <>
            <Row className="mb-3">
                {/* Menu Image */}
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>
                            Menu Image <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control type="file" name="logo_image" onChange={handleFileChange} />
                        {logoPreview && <img src={logoPreview} alt="Menu Preview" width="100" />}
                    </Form.Group>
                    {errors.logo_image && <small className="text-danger">{errors.logo_image}</small>}
                </Col>

                {/* Swiggy Image */}
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Swiggy Image</Form.Label>
                        <Form.Control type="file" name="swiggy_image" onChange={handleFileChange} />
                        {swiggyPreview && <img src={swiggyPreview} alt="Swiggy Preview" width="100" />}
                    </Form.Group>
                </Col>

                {/* Banner Image */}
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Banner Image</Form.Label>
                        <Form.Control type="file" name="banner_image" onChange={handleFileChange} />
                        {bannerPreview && <img src={bannerPreview} alt="Banner Preview" width="100" />}
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>
                            Category Name (English) <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="category_name.english"
                            required
                            // value={data.category_name.english}
                            value={data?.category_name?.english || ''}
                            onChange={handleChange}
                            placeholder="Enter Category Name in English"
                        />
                        {errors.category_name && <small className="text-danger">{errors.category_name}</small>}
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Category Name (Hindi)</Form.Label>
                        <Form.Control
                            type="text"
                            name="category_name.hindi"
                            // value={data.category_name.hindi}
                            value={data?.category_name?.hindi || ''}
                            onChange={handleChange}
                            placeholder="Enter Category Name in Hindi"
                        />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Category Name (Gujarati)</Form.Label>
                        <Form.Control
                            type="text"
                            name="category_name.gujarati"
                            // value={data.category_name.gujarati}
                            value={data?.category_name?.gujarati || ''}
                            onChange={handleChange}
                            placeholder="Enter Category Name in Gujarati"
                        />
                    </Form.Group>
                </Col>
            </Row>
            {data.items.map((item: any) => renderItems(item))}
        </>
    );

    const renderItems = (data: itemsData) => {
        return (
            <Row className="mb-3">
                <Row className="mb-3">
                    {/* Menu Image */}
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Menu Image</Form.Label>
                            <Form.Control type="file" name="logo_image" onChange={handleFileChange} />
                            {logoPreview && <img src={logoPreview} alt="Menu Preview" width="100" />}
                        </Form.Group>
                    </Col>

                    {/* Swiggy Image */}
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Swiggy Image</Form.Label>
                            <Form.Control type="file" name="swiggy_image" onChange={handleFileChange} />
                            {swiggyPreview && <img src={swiggyPreview} alt="Swiggy Preview" width="100" />}
                        </Form.Group>
                    </Col>

                    {/* Banner Image */}
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Banner Image</Form.Label>
                            <Form.Control type="file" name="banner_image" onChange={handleFileChange} />
                            {bannerPreview && <img src={bannerPreview} alt="Banner Preview" width="100" />}
                        </Form.Group>
                    </Col>
                </Row>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>
                            Item Name (English) <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="item_name.english"
                            required
                            value={data.item_name.english}
                            onChange={handleChange}
                            placeholder="Enter Item Name in English"
                        />
                        {errors.item_name && <small className="text-danger">{errors.item_name}</small>}
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>Item Name (Hindi)</Form.Label>
                        <Form.Control
                            type="text"
                            name="item_name.hindi"
                            value={data.item_name.hindi}
                            onChange={handleChange}
                            placeholder="Enter Item Name in Hindi"
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>Item Name (Gujarati)</Form.Label>
                        <Form.Control
                            type="text"
                            name="item_name.gujarati"
                            value={data.item_name.gujarati}
                            onChange={handleChange}
                            placeholder="Enter Item Name in Gujarati"
                        />
                    </Form.Group>
                </Col>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Label>Loose Quantity</Form.Label>
                        <Form.Check
                            type="checkbox"
                            name="is_loose"
                            label="Is Loose Quantity"
                            checked={data.is_loose}
                            onChange={handleLooseQuantityChange}
                        />
                    </Col>
                </Row>

                {/* Handle Quantity Type */}
                {data.is_loose && (
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Label>Quantity Type</Form.Label>
                            <Form.Control
                                as="select"
                                name="quantity_type"
                                value={data.quantity_type}
                                onChange={handleChange}>
                                <option value="">Select Quantity Type</option>
                                <option value="piece">Piece</option>
                                <option value="weight">Weight</option>
                                <option value="volume">Volume</option>
                            </Form.Control>
                        </Col>

                        {/* Depending on Quantity Type, show options for Piece, Weight, or Volume */}
                        {data.quantity_type === 'weight' && (
                            <>
                                <Col md={6}>
                                    <Form.Label>Quantity Value</Form.Label>
                                    <Row>
                                        <Col md={7}>
                                            <Form.Control
                                                type="number"
                                                name="quantity_value"
                                                value={data.quantity_value}
                                                onChange={handleChange}
                                                placeholder="Enter Quantity"
                                            />
                                        </Col>
                                        <Col md={5}>
                                            <Form.Select
                                                name="quantity_params"
                                                value={data.quantity_params}
                                                onChange={handleQuantityParamsChange}>
                                                <option value="">Select Unit</option>
                                                <option value="gm">gm</option>
                                                <option value="kg">kg</option>
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                </Col>
                            </>
                        )}

                        {data.quantity_type === 'piece' && (
                            <>
                                <Col md={6}>
                                    <Form.Label>Quantity Value</Form.Label>
                                    <Row>
                                        <Col md={8}>
                                            <Form.Control
                                                type="number"
                                                name="quantity_value"
                                                value={data.quantity_value}
                                                onChange={handleChange}
                                                placeholder="Enter Quantity"
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </>
                        )}

                        {data.quantity_type === 'volume' && (
                            <>
                                <Col md={6}>
                                    <Form.Label>Quantity Value</Form.Label>
                                    <Row>
                                        <Col md={7}>
                                            <Form.Control
                                                type="number"
                                                name="quantity_value"
                                                value={data.quantity_value}
                                                onChange={handleChange}
                                                placeholder="Enter Quantity"
                                            />
                                        </Col>
                                        <Col md={5}>
                                            <Form.Select
                                                name="quantity_params"
                                                value={data.quantity_params}
                                                onChange={handleQuantityParamsChange}>
                                                <option value="">Select Unit</option>
                                                <option value="m">ml</option>
                                                <option value="lt">lt</option>
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                </Col>
                            </>
                        )}
                    </Row>
                )}

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Label>Online Display Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="online_display_name"
                            value={data.online_display_name}
                            onChange={handleChange}
                            placeholder="Enter Online Display Name"
                        />
                    </Col>
                    <Col md={6}>
                        <Form.Label>Item Description</Form.Label>
                        <Form.Control
                            type="text"
                            name="description"
                            value={data.description}
                            onChange={handleChange}
                            placeholder="Enter Item Description"
                        />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Label>Item Dietary</Form.Label>
                        <Form.Control as="select" name="dietary" value={data.dietary} onChange={handleChange} required>
                            <option value="">Select Dietary Type</option>
                            <option value="veg">veg</option>
                            <option value="non-veg">non-veg</option>
                        </Form.Control>
                        {errors.dietary && <small className="text-danger">{errors.dietary}</small>}
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Item GST Type</Form.Label>
                            <Form.Control as="select" name="gst_type" value={data.gst_type} onChange={handleChange}>
                                <option value="">Select GST Type</option>
                                <option value="goods">Goods</option>
                                <option value="services">Services</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>
                                Item Order Type <span className="text-danger">*</span>
                            </Form.Label>
                            {['delivery', 'pick_up', 'dine_in', 'online'].map((option) => (
                                <Form.Check
                                    key={option}
                                    type="checkbox"
                                    label={option.replace('_', ' ').toUpperCase()}
                                    name="available_order_type"
                                    value={option}
                                    checked={
                                        Array.isArray(data.available_order_type) &&
                                        data.available_order_type.includes(option)
                                    }
                                    onChange={(e) => {
                                        const { value, checked } = e.target;
                                        let updatedOrderTypes = checked
                                            ? [
                                                  ...(data.available_order_type || []).filter(
                                                      (type) => type.trim() !== ''
                                                  ),
                                                  value,
                                              ] // Remove empty values before adding
                                            : (data.available_order_type || []).filter(
                                                  (type) => type !== value && type.trim() !== ''
                                              ); // Ensure empty values are removed

                                        console.log('Updated Order Types (Cleaned):', updatedOrderTypes); // Debugging

                                        handleChange({
                                            target: { name: 'available_order_type', value: updatedOrderTypes },
                                        } as unknown as React.ChangeEvent<HTMLInputElement>);
                                    }}
                                />
                            ))}
                        </Form.Group>
                        {errors.available_order_type && (
                            <small className="text-danger">{errors.available_order_type}</small>
                        )}
                    </Col>
                </Row>
            </Row>
        );
    };
    return (
        <Container className="register-item-container">
            <Card className="shadow-sm">
                <Card.Header as="h2" className="text-center">
                    Register Category
                </Card.Header>
                <Card.Body>
                    {/* {formData?.map((item: categoryData) => renderCategory(item))} */}
                    {/* {formData && renderCategory(formData)} */}
                    {formData && renderCategory({ ...formData, items: [] as itemsData[] })}

                    {/* <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label>Item Name</Form.Label>
                                <div className="d-flex gap-3">
                                    <Form.Control
                                        type="text"
                                        name="category_name.english"
                                        required
                                        value={formData.category_name.english}
                                        onChange={handleChange}
                                        placeholder="English"
                                    />
                                    <Form.Control
                                        type="text"
                                        name="category_name.hindi"
                                        value={formData.category_name.hindi}
                                        onChange={handleChange}
                                        placeholder="हिन्दी"
                                    />
                                    <Form.Control
                                        type="text"
                                        name="category_name.gujarati"
                                        value={formData.category_name.gujarati}
                                        onChange={handleChange}
                                        placeholder="ગુજરાતી"
                                    />
                                </div>
                                {errors.category_name && <small className="text-danger">{errors.category_name}</small>}
                            </Form.Group>
                        </Col>
                    </Row> */}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default RegisterCategoryStep1;
