import React from 'react';
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
    };
    errorMsg: string;
    successMsg: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    logoPreview: string | null;
    swiggyPreview: string | null;
    bannerPreview: string | null;
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
}) => {
    return (
        <Container className="register-item-container">
            <Card className="shadow-sm">
                <Card.Header as="h2" className="text-center">
                    Register Item
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={12} className="text-center">
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
                            </Form.Group>

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
                    </Row>
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
                                <option value="goods">veg</option>
                                <option value="goods">non-veg</option>
                            </Form.Control>
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
                                    required>
                                    <option value="delivery">Delivery</option>
                                    <option value="pick-up">Pick-up</option>
                                    <option value="dine_in">Dine-in</option>
                                    <option value="online">Online</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default RegisterItemStep1;
