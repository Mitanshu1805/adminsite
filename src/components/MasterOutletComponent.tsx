import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Card, Row, Col, Alert } from 'react-bootstrap';

const MasterOutletComponent = () => {
    const [isChecked, setIsChecked] = useState(true);

    return (
        <Row className="mb-4">
            <Col md={6}>
                <Form.Group>
                    <Form.Label style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Master Outlet</Form.Label>
                    <div className="d-flex align-items-center">
                        <Form.Check
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => setIsChecked(true)}
                            id="master-checkbox"
                            style={{ transform: 'scale(1.2)', marginRight: '8px' }} // Slightly bigger checkbox & spacing
                        />
                        <Form.Label htmlFor="master-checkbox" style={{ fontSize: '1.3rem', marginBottom: '0' }}>
                            Master
                        </Form.Label>
                    </div>
                </Form.Group>
            </Col>
        </Row>
    );
};

export default MasterOutletComponent;
