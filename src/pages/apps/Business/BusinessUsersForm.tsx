import React, { useState, ChangeEvent } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';

// Define the types for the form data (users)
interface UserDataType {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    address: string;
    [key: string]: string | boolean;
}

interface BusinessUsersFormProps {
    formData: {
        business_users: UserDataType[]; // Array of user objects
    };
    errorMsg: string;
    successMsg: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    onUsersChange: (business_users: UserDataType[]) => void;
}

const BusinessUsersForm: React.FC<BusinessUsersFormProps> = ({
    formData,
    errorMsg,
    successMsg,
    handleChange,
    handleFileChange,
    handleSubmit,
    onUsersChange,
}) => {
    // Add a new user to the array
    const addUser = () => {
        const newUser: UserDataType = {
            first_name: '',
            last_name: '',
            email: '',
            phone_number: '',
            address: '',
        };
        const updatedUsers = [...formData.business_users, newUser];
        onUsersChange(updatedUsers); // Update at parent level
    };

    // Remove a user from the array
    const removeUser = (index: number) => {
        const updatedUsers = formData.business_users.filter((_, i) => i !== index);
        onUsersChange(updatedUsers); // Update at parent level
    };

    // Handle input changes dynamically
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const { name, value } = e.target;

        // Create a copy of the users data to ensure immutability
        const updatedUsers = [...formData.business_users];

        // If the field is phone_number, only allow digits and limit to 10 digits
        if (name === 'phone_number') {
            const numericValue = value.replace(/\D/g, ''); // Remove non-numeric characters
            updatedUsers[index][name as keyof UserDataType] = numericValue.slice(0, 10); // Limit to 10 digits
        } else {
            updatedUsers[index][name as keyof UserDataType] = value;
        }

        onUsersChange(updatedUsers); // Pass the updated users to the parent
    };

    return (
        <Container className="register-business-container">
            <Card className="shadow-sm">
                <Card.Header as="h2" className="text-center">
                    Register Business Users
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        {formData.business_users.map((user, index) => (
                            <div key={index}>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="first_name"
                                            value={user.first_name}
                                            onChange={(e) => handleInputChange(e, index)}
                                            required
                                            placeholder="Enter first name"
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="last_name"
                                            value={user.last_name}
                                            onChange={(e) => handleInputChange(e, index)}
                                            required
                                            placeholder="Enter last name"
                                        />
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={user.email}
                                            onChange={(e) => handleInputChange(e, index)}
                                            required
                                            placeholder="Enter email"
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="phone_number"
                                            value={user.phone_number}
                                            onChange={(e) => handleInputChange(e, index)}
                                            required
                                            placeholder="Enter phone number"
                                        />
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            value={user.address}
                                            onChange={(e) => handleInputChange(e, index)}
                                            required
                                            placeholder="Enter address"
                                        />
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col className="d-flex justify-content-between">
                                        <Button
                                            variant="danger"
                                            onClick={() => removeUser(index)}
                                            style={{ borderRadius: '1.15rem' }}>
                                            Remove User
                                        </Button>
                                        {index === formData.business_users.length - 1 && (
                                            <Button
                                                variant="primary"
                                                onClick={addUser}
                                                style={{ borderRadius: '1.15rem' }}>
                                                Add User
                                            </Button>
                                        )}
                                    </Col>
                                </Row>
                                <hr />
                            </div>
                        ))}
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

export default BusinessUsersForm;
