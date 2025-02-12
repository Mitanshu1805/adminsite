import React from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Card, Row, Col, Alert } from 'react-bootstrap';

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
}) => {
    return (
        <Container className="register-item-container">
            <Card className="shadow-sm">
                <Card.Header as="h2" className="text-center">
                    Register Category
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
                                    name="category_name.english"
                                    required
                                    value={formData.category_name.english}
                                    onChange={handleChange}
                                    placeholder="Enter Item Name in English"
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Item Name (Hindi)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="category_name.hindi"
                                    value={formData.category_name.hindi}
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
                                    name="category_name.gujarati"
                                    value={formData.category_name.gujarati}
                                    onChange={handleChange}
                                    placeholder="Enter Item Name in Gujarati"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default RegisterCategoryStep1;
