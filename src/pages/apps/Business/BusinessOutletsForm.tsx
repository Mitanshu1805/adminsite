import React, { useEffect, useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { languageList } from '../../../redux/business/actions';
import { RootState } from '../../../redux/reducers';

interface Outlet {
    outlet_name: string;
    outlet_type: string;
    is_primary_outlet: boolean;
    outlet_address: string;
    outlet_gst_no: string;
    language_id: string;
    [key: string]: string | boolean;
}

interface BusinessOutletsFormProps {
    formData: {
        outlets: Outlet[];
    };
    errorMsg: string;
    successMsg: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    onOutletsChange: (outlets: Outlet[]) => void;
    languages: { id: string; name: string }[]; // Add this line
    // errors: string; // Add this line
}

const BusinessOutletsForm: React.FC<BusinessOutletsFormProps> = ({
    formData,
    errorMsg,
    successMsg,
    handleSubmit,
    onOutletsChange,
    // errors,
    handleChange,
}) => {
    const dispatch = useDispatch();

    const { languages, loading, error } = useSelector((state: RootState) => state.language) as {
        languages: { id: string; name: string }[];
        loading: boolean;
        error: string | null;
    };

    const outletTypes = ['coco', 'cofo', 'fofo', 'foco'];

    const [outlets, setOutlets] = useState<Outlet[]>(formData.outlets);
    const [outletNameError, setOutletNameError] = useState('')
    const [outletTypeError, setOutletTypeError] = useState('')
    const [outletAddressError, setOutletAddressError] = useState('')
    const [outletGstNummberError, setOutletGstNummberError] = useState('')
    const [outletLanguageError, setOutletLanguageError] = useState('')
    // const [validationErrors, setValidationErrors] = useState<Outlet[]>([]);

    useEffect(() => {
        // Fetch languages if not already loaded
        if (!languages || languages.length === 0) {
            dispatch(languageList());
        }
    }, [dispatch, languages]);

    const addOutlet = () => {
        const newOutlet: Outlet = {
            outlet_name: '',
            outlet_type: '',
            is_primary_outlet: false,
            outlet_address: '',
            outlet_gst_no: '',
            language_id: '',
        };
        const updatedOutlets = [...outlets, newOutlet];
        setOutlets(updatedOutlets);
        onOutletsChange(updatedOutlets);
    };

    const removeOutlet = (index: number) => {
        if (outlets.length === 1) {
            alert('At least one outlet should be there!');
            return;
        }
        const updatedOutlets = outlets.filter((_, i) => i !== index);
        setOutlets(updatedOutlets);
        onOutletsChange(updatedOutlets);
    };

    const handleOutletFieldChange = (index: number, field: string, value: string) => {
        const updatedOutlets = [...formData.outlets];
        updatedOutlets[index][field] = value;
        onOutletsChange(updatedOutlets);
    };


    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
        index: number
    ) => {
        const { name, value, type } = e.target;
        const updatedOutlets = [...outlets];

        if (type === 'checkbox') {
            updatedOutlets[index].is_primary_outlet = (e.target as HTMLInputElement).checked;
        } else {
            updatedOutlets[index][name as keyof Outlet] = value;
        }

        setOutlets(updatedOutlets);
        onOutletsChange(updatedOutlets);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let valid = true;

        for (let i = 0; i < outlets.length; i++) {
            const outlet = outlets[i];

            if (!outlet.outlet_name.trim()) {
                setOutletNameError("Outlet Name is Required");
                valid = false;

            } else {
                setOutletNameError('');
            }

            if (!outlet.outlet_type.trim()) {
                setOutletTypeError("Outlet Type is Required");
                valid = false;

            } else {
                setOutletTypeError('');
            }

            if (!outlet.outlet_address.trim()) {
                setOutletAddressError("Outlet Address is Required");
                valid = false;

            } else {
                setOutletAddressError('');
            }

            if (!outlet.outlet_gst_no.trim()) {
                setOutletGstNummberError("GST Number is Required");
                valid = false;

            } else {
                setOutletGstNummberError('');
            }

            if (!outlet.language_id.trim()) {
                setOutletLanguageError("Language is Required");
                valid = false;

            } else {
                setOutletLanguageError('');
            }
        }

        if (!valid) return;

        handleSubmit(e);
    };


    return (
        <Container className="register-business-container">
            <Card className="shadow-sm">
                <Card.Header as="h2" className="text-center">
                    Register Outlets
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleFormSubmit}>
                        {outlets.map((outlet, index) => (
                            <div key={index}>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Label>Outlet Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="outlet_name"
                                            value={outlet.outlet_name}
                                            onChange={(e) => handleInputChange(e, index)}
                                            required
                                            isInvalid={!!outletNameError}
                                            placeholder="Enter outlet name"
                                        />
                                        <Form.Control.Feedback type="invalid">{outletNameError}</Form.Control.Feedback>

                                    </Col>
                                    <Col>
                                        <Form.Group controlId={`outlet-type-${index}`}>
                                            <Form.Label>Outlet Type</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="outlet_type"
                                                value={outlet.outlet_type}
                                                onChange={(e) => handleInputChange(e, index)}
                                                required
                                                isInvalid={!!outletTypeError}>
                                                <option value="">Select Outlet Type</option>
                                                {outletTypes.map((type, idx) => (
                                                    <option key={idx} value={type}>
                                                        {type}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                            <Form.Control.Feedback type="invalid">{outletTypeError}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Label>Is Primary Outlet</Form.Label>
                                        <Form.Check
                                            type="switch"
                                            id={`is-primary-outlet-${index}`}
                                            name="is_primary_outlet"
                                            checked={outlet.is_primary_outlet}
                                            onChange={(e) => handleInputChange(e, index)}

                                        />
                                    </Col>
                                    <Col>
                                        <Form.Label>Outlet Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="outlet_address"
                                            value={outlet.outlet_address}
                                            onChange={(e) => handleInputChange(e, index)}
                                            required
                                            isInvalid={!!outletAddressError}
                                            placeholder="Enter outlet address"
                                        />
                                        <Form.Control.Feedback type="invalid">{outletAddressError}</Form.Control.Feedback>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Label>Outlet GST Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="outlet_gst_no"
                                            value={outlet.outlet_gst_no}
                                            onChange={(e) => handleInputChange(e, index)}
                                            required
                                            isInvalid={!!outletGstNummberError}
                                            placeholder="Enter GST number"
                                        />
                                        <Form.Control.Feedback type="invalid">{outletGstNummberError}</Form.Control.Feedback>
                                        {/* {validationErrors[index]?.outlet_gst_no && (
                                            <Alert variant="danger">{validationErrors[index]?.outlet_gst_no}</Alert>
                                        )} */}

                                    </Col>
                                    <Col>
                                        <Form.Label>Language</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="language_id"
                                            value={outlet.language_id}
                                            onChange={(e) => handleInputChange(e, index)}
                                            required
                                            isInvalid={!!outletLanguageError}>
                                            <option value="">Select Language</option>
                                            {loading ? (
                                                <option disabled>Loading languages...</option>
                                            ) : error ? (
                                                <option disabled>Error loading languages</option>
                                            ) : (
                                                languages.map((language) => (
                                                    <option key={language.id} value={language.id}>
                                                        {language.name}
                                                    </option>
                                                ))
                                            )}
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">{outletLanguageError}</Form.Control.Feedback>
                                        {/* {validationErrors[index]?.language_id && (
                                            <Alert variant="danger">{validationErrors[index]?.language_id}</Alert>
                                        )} */}
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col className="d-flex justify-content-between">
                                        <Button
                                            variant="danger"
                                            onClick={() => removeOutlet(index)}
                                            style={{ borderRadius: '1.15rem' }}>
                                            Remove Outlet
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={addOutlet}
                                            style={{ borderRadius: '1.15rem' }}>
                                            Add Outlet
                                        </Button>
                                    </Col>
                                </Row>
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

export default BusinessOutletsForm;
