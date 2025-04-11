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
    const [outletNameError, setOutletNameError] = useState('');
    const [outletTypeError, setOutletTypeError] = useState('');
    const [outletAddressError, setOutletAddressError] = useState('');
    const [outletGstNumberError, setOutletGstNumberError] = useState('');
    const [languageIdError, setLanguageIdError] = useState('');
    const [currencyError, setCurrencyError] = useState('');

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

    useEffect(() => {
        if (!show) {
            // Reset form fields when modal closes
            setOutletName('');
            setOutletType('');
            setOutletAddress('');
            setGstNo('');
            setLanguageId('');
            setCurrency('INR');
            setIsPrimaryOutlet(false);
            setErrorMessage('');
            setOutletNameError('');
            setOutletTypeError('');
            setOutletAddressError('');
            setOutletGstNumberError('');
            setLanguageIdError('');
            setCurrencyError('');
        }
    }, [show]);

    const handleSubmit = () => {
        let valid = true;

        if (!outletName.trim()) {
            setOutletNameError('Outlet Name is Required');
            valid = false;
        } else {
            setOutletNameError('');
        }
        if (!outletType.trim()) {
            setOutletTypeError('Outlet Type is Required');
            valid = false;
        } else {
            setOutletTypeError('');
        }
        if (!outletAddress.trim()) {
            setOutletAddressError('Outlet Address is Required');
            valid = false;
        } else {
            setOutletAddressError('');
        }
        if (!gstNo.trim()) {
            setOutletGstNumberError('Outlet GstNumber is Required');
            valid = false;
        } else {
            setOutletGstNumberError('');
        }
        if (!languageId.trim()) {
            setLanguageIdError('LanguageId is Required');
            valid = false;
        } else {
            setLanguageIdError('');
        }
        if (!currency.trim()) {
            setCurrencyError('Currency is Required');
            valid = false;
        } else {
            setCurrencyError('');
        }
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
        setTimeout(() => {
            dispatch(businessList()); // ✅ Refresh list AFTER store updates

            setOutletName('');
            setOutletType('');
            setOutletAddress('');
            setGstNo('');
            setLanguageId('');
            setCurrency('INR');
            setIsPrimaryOutlet(false);
            setErrorMessage('');

            onClose(); // ✅ Close modal AFTER update
        }, 500);
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Register New Outlet</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="outletName" className="mb-3">
                        <Form.Label>Outlet Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={outletName}
                            onChange={(e) => setOutletName(e.target.value)}
                            isInvalid={!!outletNameError}
                        />
                        <Form.Control.Feedback type="invalid">{outletNameError}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="outletType" className="mb-3">
                        <Form.Label>Outlet Type</Form.Label>
                        <Form.Control
                            as="select"
                            name="outlet_type"
                            value={outletType}
                            onChange={(e) => setOutletType(e.target.value)}
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
                    <Form.Group controlId="outletAddress" className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            value={outletAddress}
                            onChange={(e) => setOutletAddress(e.target.value)}
                            isInvalid={!!outletAddressError}
                        />
                        <Form.Control.Feedback type="invalid">{outletAddressError}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="gstNo" className="mb-3">
                        <Form.Label>GST Number</Form.Label>
                        <Form.Control
                            type="text"
                            value={gstNo}
                            onChange={(e) => setGstNo(e.target.value)}
                            isInvalid={!!outletGstNumberError}
                        />
                        <Form.Control.Feedback type="invalid">{outletGstNumberError}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="currency" className="mb-3">
                        <Form.Label>Currency</Form.Label>
                        <Form.Control
                            type="text"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            isInvalid={!!currencyError}
                        />
                        <Form.Control.Feedback type="invalid">{currencyError}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="isPrimaryOutlet" className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Set as primary outlet"
                            checked={isPrimaryOutlet}
                            onChange={() => setIsPrimaryOutlet(!isPrimaryOutlet)}
                        />
                    </Form.Group>

                    <Form.Group controlId="languageId" className="mb-3">
                        <Form.Label>Language</Form.Label>
                        <Form.Control
                            as="select"
                            value={languageId}
                            onChange={(e) => setLanguageId(e.target.value)}
                            required
                            isInvalid={!!languageIdError}>
                            <option value="">Select Language</option>
                            {languages.map((language) => (
                                <option key={language.id} value={language.id}>
                                    {language.name}
                                </option>
                            ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">{languageIdError}</Form.Control.Feedback>
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
