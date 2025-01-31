import React, { useState } from 'react';
import { Card, Row, Col, Button, Alert, Form } from 'react-bootstrap';

interface Outlet {
    outlet_id: string;
    outlet_name: string;
}

interface SelectedBusiness {
    outlets: Outlet[];
}

interface RegisterItemStepTwoProps {
    selectedBusiness: SelectedBusiness;
    onNext: (selectedOutlets: Outlet[]) => void;
    errorMsg: string;
    successMsg: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

const RegisterItemStepTwo: React.FC<RegisterItemStepTwoProps> = ({ selectedBusiness, onNext }) => {
    const [selectedOutlets, setSelectedOutlets] = useState<Outlet[]>([]);

    const handleOutletChange = (outlet: Outlet) => {
        setSelectedOutlets((prevSelectedOutlets) => {
            if (prevSelectedOutlets.some((o) => o.outlet_id === outlet.outlet_id)) {
                return prevSelectedOutlets.filter((o) => o.outlet_id !== outlet.outlet_id);
            } else {
                return [...prevSelectedOutlets, outlet];
            }
        });
    };

    const handleNextClick = () => {
        onNext(selectedOutlets); // Pass the selected outlets to the parent component
    };

    return (
        <Card>
            <Card.Body>
                <Row>
                    <Col md={12}>
                        {selectedBusiness.outlets.length > 0 ? (
                            selectedBusiness.outlets.map((outlet) => (
                                <div key={outlet.outlet_id}>
                                    <Form.Check
                                        type="checkbox"
                                        label={outlet.outlet_name}
                                        checked={selectedOutlets.some((o) => o.outlet_id === outlet.outlet_id)}
                                        onChange={() => handleOutletChange(outlet)}
                                    />
                                </div>
                            ))
                        ) : (
                            <Alert variant="info">No outlets found for this business.</Alert>
                        )}
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col md={12} className="text-center">
                        <Button onClick={handleNextClick} variant="primary">
                            Next
                        </Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default RegisterItemStepTwo;
