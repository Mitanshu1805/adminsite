import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useRedux } from '../../../hooks';
import { Form, Button, Container } from 'react-bootstrap';
import { Card, Row, Col, Alert } from 'react-bootstrap';
import { RootState } from '../../../redux/store';
import { businessList } from '../../../redux/business/actions';

interface Outlet {
    outlet_id: string;
    outlet_name: string;
    business_id: string;
    is_active: boolean;
}

interface Business {
    business_id: string;
    business_name: string;
    outlets: Outlet[];
}

interface RegisterCategoryTwoProps {
    formData: {
        outlet_id: string[];
    };
    selectedOutlets: string[]; // Expect selectedOutlets as a separate prop
    setSelectedOutlets: React.Dispatch<React.SetStateAction<string[]>>; // Expect setSelectedOutlets as a separate prop
    handleSubmit: (e: React.FormEvent) => void;
}

const RegisterCategoryStep2: React.FC<RegisterCategoryTwoProps> = ({
    formData,
    setSelectedOutlets,
    selectedOutlets,
}) => {
    // const { business_id } = useParams<{ business_id: string }>();
    const location = useLocation();
    const business_id = location.state?.business_id;
    const { dispatch, appSelector } = useRedux();
    const businesses = appSelector((state: RootState) => state.business.businesses || []);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (business_id) {
            dispatch(businessList());
        }
    }, [dispatch, business_id]);

    useEffect(() => {
        if (businesses.length > 0) {
            setLoading(false);
        }
    }, [businesses]);

    const business = businesses.find((biz: Business) => biz.business_id === business_id);

    const toggleOutletSelection = (outlet: Outlet) => {
        const isSelected = selectedOutlets.includes(outlet.outlet_id);

        setSelectedOutlets((prev: string[]) => {
            const newSelected = isSelected ? prev.filter((id) => id !== outlet.outlet_id) : [...prev, outlet.outlet_id];

            return newSelected;
        });

        // Update the is_active status for the selected outlet
        if (business) {
            business.outlets = business.outlets.map((o: Outlet) =>
                o.outlet_id === outlet.outlet_id ? { ...o, is_active: !o.is_active } : o
            );
        }
    };

    const selectAllOutlets = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (business) {
            const allSelected = business.outlets.every((outlet: Outlet) => selectedOutlets.includes(outlet.outlet_id));

            const newSelected = allSelected ? [] : business.outlets.map((outlet: Outlet) => outlet.outlet_id);

            setSelectedOutlets(newSelected);

            // Update is_active status for all outlets
            business.outlets = business.outlets.map((outlet: Outlet) => ({
                ...outlet,
                is_active: !allSelected, // If deselecting, set all to inactive
            }));
        }
    };

    return (
        <Container className="register-item-container mt-4">
            <Card className="shadow-sm">
                <Card.Header as="h2" className="text-center">
                    Select Outlets
                </Card.Header>
                <Card.Body>
                    {/* <Row className="mb-4 d-flex align-items-center">
                        <Col>
                            <Form.Label style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Outlet Name</Form.Label>
                            <Button onClick={selectAllOutlets} className="btn btn-primary btn-sm ms-2">
                                {business &&
                                business.outlets.length > 0 &&
                                selectedOutlets.length === business.outlets.length
                                    ? 'Deselect All'
                                    : 'Select All'}
                            </Button>
                        </Col>
                    </Row> */}

                    <Row className="mb-4 d-flex align-items-center">
                        <Col md="auto">
                            <Form.Label style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Outlet Name</Form.Label>
                        </Col>
                        <Col md="auto">
                            <Button onClick={selectAllOutlets} className="btn btn-primary btn-sm ms-3">
                                {business &&
                                business.outlets.length > 0 &&
                                selectedOutlets.length === business.outlets.length
                                    ? 'Deselect All'
                                    : 'Select All'}
                            </Button>
                        </Col>
                    </Row>

                    {loading ? (
                        <p className="text-muted text-center">Loading...</p>
                    ) : business ? (
                        business.outlets.length > 0 ? (
                            <Row>
                                {business.outlets.map((outlet: Outlet) => {
                                    const isChecked = selectedOutlets.includes(outlet.outlet_id);
                                    return (
                                        <Col md={12} key={outlet.outlet_id} className="mb-3 shadow-sm">
                                            <div
                                                className="d-flex align-items-center p-2"
                                                style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                                                onClick={() => toggleOutletSelection(outlet)}>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    readOnly
                                                    id={`outlet-checkbox-${outlet.outlet_id}`}
                                                    className="me-3"
                                                    style={{ transform: 'scale(1.5)' }}
                                                />
                                                <label
                                                    htmlFor={`outlet-checkbox-${outlet.outlet_id}`}
                                                    style={{ cursor: 'pointer' }}>
                                                    {outlet.outlet_name}
                                                </label>
                                                <span
                                                    className={`ms-auto status ${
                                                        outlet.is_active ? 'text-success' : 'text-danger'
                                                    }`}>
                                                    {/* {outlet.is_active ? 'Active' : 'Inactive'} */}
                                                </span>
                                            </div>
                                        </Col>
                                    );
                                })}
                            </Row>
                        ) : (
                            <p className="text-muted text-center">No outlets available for this business.</p>
                        )
                    ) : (
                        <p className="text-muted text-center">Business not found.</p>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default RegisterCategoryStep2;
