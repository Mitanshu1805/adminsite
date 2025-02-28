import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Card, Row, Col } from 'react-bootstrap';
import './ManageMenu';

interface Outlet {
    outlet_id: string;
    outlet_name: string;
}

interface Business {
    business_id: string;
    business_name: string;
}

interface RegisterItemStep3Props {
    formData: {
        outlet_prices: { outlet_id: string; price: number }[];
        price: string;
    };
    selectedOutlets: Outlet[];
    business: Business | null;
    handlePriceChange: (e: React.ChangeEvent<HTMLInputElement>, outlet_id: string) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setFormData: (update: (prev: any) => any) => void;
}

const RegisterItemStep3: React.FC<RegisterItemStep3Props> = ({
    selectedOutlets,
    formData,
    handlePriceChange,
    handleChange,
    setFormData,
}) => {
    // Function to apply master price to all outlets
    const applyMasterPrice = () => {
        const masterPrice = parseFloat(formData.price); // Convert to number
        if (!isNaN(masterPrice)) {
            setFormData((prevData) => ({
                ...prevData,
                outlet_prices: selectedOutlets.map((outlet) => ({
                    outlet_id: outlet.outlet_id,
                    price: masterPrice, // Apply master price
                })),
            }));
        }
    };

    return (
        <Container className="register-item-container">
            <Card className="shadow-sm">
                <Card.Header as="h2" className="text-center">
                    Outlet List
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Master Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="Enter Master Price"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} className="d-flex align-items-end">
                            <Button variant="primary" onClick={applyMasterPrice}>
                                Apply All
                            </Button>
                        </Col>
                    </Row>

                    {selectedOutlets.length > 0 ? (
                        selectedOutlets.map((outlet) => {
                            const price = formData.outlet_prices.find(
                                (priceEntry) => priceEntry.outlet_id === outlet.outlet_id
                            )?.price;

                            return (
                                <Card key={outlet.outlet_id} className="mb-3 shadow-sm">
                                    <Card.Body>
                                        <Row>
                                            <Col md={6}>
                                                <h3 className="mb-2">{outlet.outlet_name}</h3>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Control
                                                        type="number"
                                                        value={price || ''}
                                                        onChange={(e) =>
                                                            handlePriceChange(
                                                                e as React.ChangeEvent<HTMLInputElement>,
                                                                outlet.outlet_id
                                                            )
                                                        }
                                                        placeholder="Enter Outlet Price"
                                                        className="price-input"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            );
                        })
                    ) : (
                        <p className="text-center text-muted">No outlets selected.</p>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default RegisterItemStep3;
