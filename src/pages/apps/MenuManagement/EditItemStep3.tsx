import React from 'react';
import { Card, Row, Col, Form, Container, Button } from 'react-bootstrap';

interface Outlet {
    outlet_id: string;
    outlet_name: string;
    price: number;
}

interface OutletPrice {
    outlet_id: string;
    price: number;
    outlet_name: string;
}

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

interface EditItemStep3Props {
    handleSubmit: (e: React.FormEvent) => void;
    editItem: CategoryItem | null;
    setEditItem: React.Dispatch<React.SetStateAction<CategoryItem | null>>;
    message: string;
    selectedOutlets: Outlet[];
}

const EditItemStep3: React.FC<EditItemStep3Props> = ({
    editItem,
    setEditItem,
    handleSubmit,
    message,
    selectedOutlets,
}) => {
    if (!editItem) {
        return <p>Loading...</p>;
    }

    const outletPrices = editItem.outlet_prices ?? [];

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, outletId: string) => {
        const newPrice = parseFloat(e.target.value);
        if (newPrice < 0 || isNaN(newPrice)) {
            return;
        }
        setEditItem((prev) => {
            if (!prev) return prev;
            const updatedPrices = (prev.outlet_prices ?? []).map((priceEntry) =>
                priceEntry.outlet_id === outletId ? { ...priceEntry, price: newPrice } : priceEntry
            );
            return {
                ...prev,
                outlet_prices: updatedPrices,
            };
        });
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
                                    value={editItem.price}
                                    onChange={(e) =>
                                        setEditItem((prev) =>
                                            prev ? { ...prev, price: parseFloat(e.target.value) || 0 } : prev
                                        )
                                    }
                                    placeholder="Enter Master Price"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} className="d-flex align-items-end">
                            <Button
                                variant="primary"
                                onClick={() =>
                                    setEditItem((prev) => {
                                        if (!prev) return prev;
                                        const updatedPrices = prev.outlets.map((outlet) => ({
                                            outlet_id: outlet.outlet_id,
                                            price: prev.price,
                                        }));
                                        return {
                                            ...prev,
                                            outlet_prices: updatedPrices,
                                        };
                                    })
                                }>
                                Apply All
                            </Button>
                        </Col>
                    </Row>

                    {selectedOutlets.length > 0 ? (
                        selectedOutlets.map((outlet) => {
                            const price = outletPrices.find(
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

export default EditItemStep3;
