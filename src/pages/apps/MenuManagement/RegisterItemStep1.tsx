import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Card, Row, Col, Alert } from 'react-bootstrap';

export interface RegisterItemOneProps {
    formData: {
        item_name: {
            hindi: string;
            english: string;
            gujarati: string;
        };
        online_display_name: string;
        price: string;
        description: string;
        dietary: string;
        available_order_type: string[];
        gst_type: string;
        category_id: string;
        business_id: string;
        logo_image: File | null;
        swiggy_image: File | null;
        banner_image: File | null;
        is_loose: boolean;
        quantity_type: string;
        quantity_params: string;
        quantity_value: string;
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

const RegisterItemStep1: React.FC<RegisterItemOneProps> = ({
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
    // const [quantityType, setQuantityType] = useState(formData.quantity_type || ''); // State for Quantity Type
    // const [quantityParams, setQuantityParams] = useState(formData.quantity_params || ''); // State for Quantity Params

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

    const handleQuantityValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        handleChange({
            target: { name, value },
        } as any); // Adjust to match the input change format
    };

    const handleQuantityParamsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        handleChange({
            target: { name, value },
        } as any);
    };

    return (
        <Container className="register-item-container">
            <Card className="shadow-sm">
                <Card.Header as="h2" className="text-center">
                    Register Item
                </Card.Header>
                <Card.Body>
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

                    <Row className="mb-3">
                        <Col md={12} className="text-center">
                            <Form.Group>
                                <Form.Label>Item Name (English)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="item_name.english"
                                    required
                                    value={formData.item_name.english}
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
                                    value={formData.item_name.hindi}
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
                                    value={formData.item_name.gujarati}
                                    onChange={handleChange}
                                    placeholder="Enter Item Name in Gujarati"
                                />
                            </Form.Group>
                        </Col>
                        {/* ok so now i have another thing to add in 1st step of multistep form : Loose Quantity . If we
                        select it, then Quantity type appears in the form having options Piece, Weight, Voume. If we
                        select Piece then just enter Quantity but if me select Weight then Quantity params appear which
                        gives the option GM, KG. And for Volume, we get the option M, LT. */}
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Label>Loose Quantity</Form.Label>
                            <Form.Check
                                type="checkbox"
                                name="is_loose"
                                label="Is Loose Quantity"
                                checked={formData.is_loose}
                                onChange={handleLooseQuantityChange}
                            />
                        </Col>
                    </Row>

                    {/* Handle Quantity Type */}
                    {formData.is_loose && (
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

                            {/* Depending on Quantity Type, show options for Piece, Weight, or Volume */}
                            {formData.quantity_type === 'weight' && (
                                <>
                                    <Col md={6}>
                                        <Form.Label>Quantity Value</Form.Label>
                                        <Row>
                                            <Col md={7}>
                                                <Form.Control
                                                    type="number"
                                                    name="quantity_value"
                                                    value={formData.quantity_value}
                                                    onChange={handleChange}
                                                    placeholder="Enter Quantity"
                                                />
                                            </Col>
                                            <Col md={5}>
                                                <Form.Select
                                                    name="quantity_params"
                                                    value={formData.quantity_params}
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

                            {formData.quantity_type === 'piece' && (
                                <>
                                    <Col md={6}>
                                        <Form.Label>Quantity Value</Form.Label>
                                        <Row>
                                            <Col md={8}>
                                                <Form.Control
                                                    type="number"
                                                    name="quantity_value"
                                                    value={formData.quantity_value}
                                                    onChange={handleChange}
                                                    placeholder="Enter Quantity"
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </>
                            )}

                            {formData.quantity_type === 'volume' && (
                                <>
                                    <Col md={6}>
                                        <Form.Label>Quantity Value</Form.Label>
                                        <Row>
                                            <Col md={7}>
                                                <Form.Control
                                                    type="number"
                                                    name="quantity_value"
                                                    value={formData.quantity_value}
                                                    onChange={handleChange}
                                                    placeholder="Enter Quantity"
                                                />
                                            </Col>
                                            <Col md={5}>
                                                <Form.Select
                                                    name="quantity_params"
                                                    value={formData.quantity_params}
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
                                value={formData.online_display_name}
                                onChange={handleChange}
                                placeholder="Enter Online Display Name"
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Label>Item Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter Item Description"
                            />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Label>Item Dietary</Form.Label>
                            <Form.Control
                                as="select"
                                name="dietary"
                                value={formData.dietary}
                                onChange={handleChange}
                                required>
                                <option value="">Select Dietary Type</option>
                                <option value="veg">veg</option>
                                <option value="non-veg">non-veg</option>
                            </Form.Control>
                            {errors.dietary && <small className="text-danger">{errors.dietary}</small>}
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Item GST Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="gst_type"
                                    value={formData.gst_type}
                                    onChange={handleChange}>
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
                                <Form.Label>Item Order Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="available_order_type"
                                    multiple
                                    value={formData.available_order_type}
                                    onChange={handleChange}
                                    // required
                                >
                                    <option value="delivery">Delivery</option>
                                    <option value="pick_up">Pick-up</option>
                                    <option value="dine_in">Dine-in</option>
                                    <option value="online">Online</option>
                                </Form.Control>
                                {errors.available_order_type && (
                                    <small className="text-danger">{errors.available_order_type}</small>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default RegisterItemStep1;
