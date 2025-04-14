import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerBusiness } from '../../../redux/business/actions';
import { Button, Alert, Container, Card } from 'react-bootstrap';
import { useMultistepForm } from '../../../hooks/useMultistepForm';
import BusinessInfoForm from './BusinessInfoForm';
import BusinessOutletsForm from './BusinessOutletsForm';
import BusinessUsersForm from './BusinessUsersForm';
import { Navigate, useNavigate } from 'react-router-dom';

// Define the payload type for the registerBusiness action
interface RegisterBusinessPayload {
    business_name: string;
    business_contact: string;
    business_address: string;
    gst_no: string;
    cuisine: string;
    currency: string;
    business_logo: File | null;
    business_users: any; // define the type for business users
    outlets: any; // define the type for outlets
}

const RegisterBusiness: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { error, success } = useSelector((state: any) => state.business);

    const [formData, setFormData] = useState({
        business_name: '',
        business_logo: null as File | null,
        business_contact: '',
        business_address: '',
        gst_no: '',
        cuisine: '',
        currency: '',
        business_users: [
            {
                first_name: '',
                last_name: '',
                email: '',
                phone_number: '',
                address: '',
            },
        ],
        outlets: [
            {
                outlet_name: '',
                outlet_type: '',
                is_primary_outlet: false,
                outlet_address: '',
                outlet_gst_no: '',
                language_id: '',
            },
        ],
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [errorMsg, setError] = useState<string>('');
    const [successMsg, setSuccess] = useState<string>('');
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [languages, setLanguages] = useState<{ id: string; name: string }[]>([]);

    // Load form data from localStorage when the component mounts
    useEffect(() => {
        const savedFormData = localStorage.getItem('registerBusinessFormData');
        if (savedFormData) {
            setFormData(JSON.parse(savedFormData));
        }
    }, []);

    // Update localStorage whenever form data changes
    useEffect(() => {
        localStorage.setItem('registerBusinessFormData', JSON.stringify(formData));
    }, [formData]);

    const handleOutletChange = (updatedOutlets: any[]) => {
        setFormData((prevData) => ({
            ...prevData,
            outlets: updatedOutlets,
        }));
    };

    const handleUserChange = (updatedUsers: any[]) => {
        setFormData((prevData) => ({
            ...prevData,
            business_users: updatedUsers,
        }));
    };

    const validateCurrentStep = (): boolean => {
        let newErrors: Record<string, string> = {};

        if (currentStepIndex === 0) {
            // Validate Business Info Step
            if (!formData.business_name.trim()) newErrors.business_name = 'Business name is required.';
            if (!formData.business_contact.trim()) newErrors.business_contact = 'Business contact is required.';
            if (!formData.business_address.trim()) newErrors.business_address = 'Business address is required.';
            if (!formData.gst_no.trim()) newErrors.gst_no = 'GST number is required.';
            if (!formData.cuisine.trim()) newErrors.cuisine = 'Cuisine is required.';
            if (!formData.currency.trim()) newErrors.currency = 'Currency is required.';
            if (!formData.business_logo) newErrors.business_logo = 'Business logo is required.';
        } else if (currentStepIndex === 1) {
            // Validate Business Outlets Step
            formData.outlets.forEach((outlet, index) => {
                if (!outlet.outlet_name.trim()) newErrors[`outlet_name_${index}`] = 'Outlet name is required.';
                if (!outlet.outlet_address.trim()) newErrors[`outlet_address_${index}`] = 'Outlet address is required.';
            });
        } else if (currentStepIndex === 2) {
            // Validate Business Users Step
            formData.business_users.forEach((user, index) => {
                if (!user.first_name.trim()) newErrors[`first_name_${index}`] = 'First name is required.';
                if (!user.email.trim()) newErrors[`email_${index}`] = 'Email is required.';
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file.');
                return;
            }

            setFormData((prevData) => ({
                ...prevData,
                business_logo: file,
            }));
            const previewUrl = URL.createObjectURL(file);
            setLogoPreview(previewUrl);

            // Cleanup the previous URL after component unmount or file change
            return () => {
                URL.revokeObjectURL(previewUrl);
            };
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Final Payload:', formData);

        if (formSubmitted) return;

        setFormSubmitted(true);

        // Validate required fields for outlets and business_users
        // if (formData.outlets.length === 0 || formData.business_users.length === 0) {
        //     setError('At least one outlet and one business user are required.');
        //     setFormSubmitted(false);
        //     return;
        // }

        const formDataToSend = new FormData();
        formDataToSend.append('business_name', formData.business_name);
        formDataToSend.append('business_contact', formData.business_contact);
        formDataToSend.append('business_address', formData.business_address);
        formDataToSend.append('gst_no', formData.gst_no);
        formDataToSend.append('cuisine', formData.cuisine);
        formDataToSend.append('currency', formData.currency);
        if (formData.business_logo) {
            formDataToSend.append('business_logo', formData.business_logo);
        }
        formDataToSend.append('outlets', JSON.stringify(formData.outlets));
        formDataToSend.append('business_users', JSON.stringify(formData.business_users));

        formDataToSend.forEach((value, key) => {
            console.log(`${key}:`, value);
        });

        try {
            await dispatch(registerBusiness(formDataToSend));
            setSuccess('Business registered successfully!');
            setFormData({
                business_name: '',
                business_logo: null,
                business_contact: '',
                business_address: '',
                gst_no: '',
                cuisine: '',
                currency: '',
                business_users: [
                    {
                        first_name: '',
                        last_name: '',
                        email: '',
                        phone_number: '',
                        address: '',
                    },
                ],
                outlets: [
                    {
                        outlet_name: '',
                        outlet_type: '',
                        is_primary_outlet: false,
                        outlet_address: '',
                        outlet_gst_no: '',
                        language_id: '',
                    },
                ],
            });
            setLogoPreview(null);
        } catch (err) {
            setError('Error registering business, please try again.');
        }

        setFormSubmitted(false);
    };

    const handleCancel = () => {
        // Clear form data
        setFormData({
            business_name: '',
            business_logo: null,
            business_contact: '',
            business_address: '',
            gst_no: '',
            cuisine: '',
            currency: '',
            business_users: [
                {
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone_number: '',
                    address: '',
                },
            ],
            outlets: [
                {
                    outlet_name: '',
                    outlet_type: '',
                    is_primary_outlet: false,
                    outlet_address: '',
                    outlet_gst_no: '',
                    language_id: '',
                },
            ],
        });

        // Clear preview and localStorage
        setLogoPreview(null);
        localStorage.removeItem('registerBusinessFormData');
        setErrors({});
        setError('');
        setSuccess('');

        navigate(-1)
    };

    const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } = useMultistepForm([
        <BusinessInfoForm
            formData={formData}
            errorMsg={errorMsg}
            successMsg={successMsg}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            logoPreview={logoPreview}
            errors={errors}
        />,
        <BusinessOutletsForm
            formData={formData}
            errorMsg={errorMsg}
            successMsg={successMsg}
            handleChange={handleChange}
            // handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            languages={languages} // Pass languages here
            onOutletsChange={handleOutletChange}
        />,
        <BusinessUsersForm
            formData={formData}
            errorMsg={errorMsg}
            successMsg={successMsg}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            onUsersChange={handleUserChange}
        // errors={errors}
        />,
    ]);

    return (
        <Container className="register-business-container">
            <Card className="shadow-sm">
                <Card.Body>
                    <form onSubmit={handleSubmit}>
                        {' '}
                        {/* Single Form here */}
                        <div>
                            Step {currentStepIndex + 1} of {steps.length}
                        </div>
                        {step}
                        <div className="d-flex justify-content-center mt-4 gap-3">
                            {!isFirstStep && (
                                <Button variant="secondary" type="button" onClick={back} className="px-4 py-2">
                                    Back
                                </Button>
                            )}
                            <Button variant="danger" type="button" onClick={handleCancel} className="px-4 py-2">
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={(e) => {
                                    if (!validateCurrentStep()) return; // Stop if validation fails
                                    if (isLastStep) {
                                        handleSubmit(e);
                                    } else {
                                        next();
                                    }
                                }}
                                className="px-4 py-2">
                                {isLastStep ? 'Finish' : 'Next'}
                            </Button>
                        </div>
                    </form>

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

export default RegisterBusiness;
