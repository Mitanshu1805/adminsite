import React from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Card, Row, Col, Alert } from 'react-bootstrap';

// Define the types for the props to improve type safety
export interface BusinessInfoFormProps {
    formData: {
        business_name: string;
        business_contact: string;
        business_address: string;
        gst_no: string;
        cuisine: string;
        currency: string;
        business_logo: File | null;
    };
    errorMsg: string;
    successMsg: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    logoPreview: string | null; // New prop for preview URL
}

const BusinessInfoForm: React.FC<BusinessInfoFormProps> = ({
    formData,
    errorMsg,
    successMsg,
    handleChange,
    handleFileChange,
    handleSubmit,
    logoPreview,
}) => {
    // Handle changes for form fields, with phone number validation
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'business_contact') {
            // Allow only numeric values and limit the length to 10 digits
            const numericValue = value.replace(/\D/g, ''); // Remove non-numeric characters
            const updatedValue = numericValue.slice(0, 10); // Limit to 10 digits
            handleChange({
                target: {
                    name,
                    value: updatedValue,
                },
            } as React.ChangeEvent<HTMLInputElement>);
        } else {
            handleChange(e); // For other fields, just pass the event
        }
    };

    return (
        <Container className="register-business-container">
            <Card className="shadow-sm">
                <Card.Header as="h2" className="text-center">
                    Register Business
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        {/* Business Logo Field at the Top */}
                        <Row className="mb-3">
                            <Col md={12} className="text-center">
                                <Form.Label>Business Logo</Form.Label>
                                <div className="logo-preview-container">
                                    {logoPreview && (
                                        <img
                                            src={logoPreview}
                                            alt="Business Logo"
                                            className="logo-preview"
                                            style={{ maxWidth: '150px', maxHeight: '150px' }} // Added logo size limits
                                        />
                                    )}
                                </div>
                                <Form.Control
                                    type="file"
                                    name="business_logo"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    required
                                />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label>Business Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="business_name"
                                    value={formData.business_name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter business name"
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Label>Business Contact</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="business_contact"
                                    value={formData.business_contact}
                                    onChange={handleInputChange} // Updated to handleInputChange
                                    required
                                    placeholder="Enter business contact number"
                                />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label>Business Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="business_address"
                                    value={formData.business_address}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter business address"
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Label>GST Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="gst_no"
                                    value={formData.gst_no}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter GST number"
                                />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label>Cuisine</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="cuisine"
                                    value={formData.cuisine}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter cuisine"
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Label>Currency</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter currency"
                                />
                            </Col>
                        </Row>
                    </Form>
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

export default BusinessInfoForm;
