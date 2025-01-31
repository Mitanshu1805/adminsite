import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { businessList, languageList } from '../../../redux/business/actions';
import { RootState } from '../../../redux/store';
import { registerOutlet } from '../../../redux/business/actions';
import { useDispatch, useSelector } from 'react-redux';

interface RegisterOutletModalProps {
    show: boolean;
    onClose: () => void;
    businessId: string;
}

const RegisterOutletModal: React.FC<RegisterOutletModalProps> = ({ show, onClose, businessId }) => {
    const [outletName, setOutletName] = useState('');
    const [outletType, setOutletType] = useState('');
    const [outletAddress, setOutletAddress] = useState('');
    const [gstNo, setGstNo] = useState('');
    const [languageId, setLanguageId] = useState('');
    const [currency, setCurrency] = useState('INR');
    const [isPrimaryOutlet, setIsPrimaryOutlet] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { languages } = useSelector((state: RootState) => state.language) as {
        languages: { id: string; name: string }[];
        loading: boolean;
        error: string | null;
    };

    const outletTypes = ['coco', 'cofo', 'fofo', 'foco'];

    const dispatch = useDispatch();

    useEffect(() => {
        if (!languages.length) {
            dispatch(languageList());
            console.log('Language list:', languages);
        }
    }, [dispatch, languages]);

    const handleSubmit = () => {
        if (!languageId) {
            setErrorMessage('Please select a language.');
            return;
        }

        const newOutlet = {
            outlet_name: outletName,
            outlet_type: outletType,
            is_primary_outlet: isPrimaryOutlet,
            gst_no: gstNo,
            language_id: languageId,
            business_id: businessId,
            outlet_address: outletAddress,
            currency: currency,
        };

        dispatch(registerOutlet(newOutlet));
        onClose();
        dispatch(businessList());
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Register New Outlet</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="outletName">
                        <Form.Label>Outlet Name</Form.Label>
                        <Form.Control type="text" value={outletName} onChange={(e) => setOutletName(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="outletType">
                        <Form.Label>Outlet Type</Form.Label>
                        <Form.Control
                            as="select"
                            name="outlet_type"
                            value={outletType}
                            onChange={(e) => setOutletType(e.target.value)}
                            required>
                            <option value="">Select Outlet Type</option>
                            {outletTypes.map((type, idx) => (
                                <option key={idx} value={type}>
                                    {type}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="outletAddress">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            value={outletAddress}
                            onChange={(e) => setOutletAddress(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="gstNo">
                        <Form.Label>GST Number</Form.Label>
                        <Form.Control type="text" value={gstNo} onChange={(e) => setGstNo(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="currency">
                        <Form.Label>Currency</Form.Label>
                        <Form.Control type="text" value={currency} onChange={(e) => setCurrency(e.target.value)} />
                    </Form.Group>

                    <Form.Group controlId="isPrimaryOutlet">
                        <Form.Check
                            type="checkbox"
                            label="Set as primary outlet"
                            checked={isPrimaryOutlet}
                            onChange={() => setIsPrimaryOutlet(!isPrimaryOutlet)}
                        />
                    </Form.Group>

                    <Form.Group controlId="languageId">
                        <Form.Label>Language</Form.Label>
                        <Form.Control
                            as="select"
                            value={languageId}
                            onChange={(e) => setLanguageId(e.target.value)}
                            required>
                            <option value="">Select Language</option>
                            {languages.map((language) => (
                                <option key={language.id} value={language.id}>
                                    {language.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Register Outlet
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RegisterOutletModal;
