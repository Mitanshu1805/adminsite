import React, { useState, useEffect } from 'react';
import { Button, Alert, Container, Card, Modal, Form } from 'react-bootstrap';
import { RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { registerCategory } from '../../../redux/actions';
import { useMultistepForm } from '../../../hooks/useMultistepForm';
import RegisterCategoryStep1 from './RegisterCategoryStep1';
import RegisterCategoryStep2 from './RegisterCategoryStep2';

interface RegisterCategoryProps {
    show: boolean;
    onClose: () => void;
    // businessId: string;
}

// Define the Outlet type
interface Outlet {
    outlet_id: string;
    business_id: string;
    outlet_name: string;
    is_active: boolean;
}

// const outlets: Outlet[] = useSelector((state: RootState) => state.outlet.outlets || []);

// const outletIds = outlets
//     .filter((outlet: Outlet) => outlet.business_id === business_id)
//     .map((outlet: Outlet) => outlet.outlet_id);

const RegisterCategory: React.FC<RegisterCategoryProps> = ({ show, onClose }) => {
    const dispatch = useDispatch();
    // const { business_id } = useSelector((state: RootState) => state.business); // Assuming you get business_id from Redux store
    const { business_id } = useParams<{ business_id: string }>();

    const outlets: Outlet[] = useSelector((state: RootState) => state.outlet?.outlets ?? []);

    // Extract outlet IDs related to the business
    const outletIds = outlets
        .filter((outlet: Outlet) => outlet.business_id === business_id)
        .map((outlet: Outlet) => outlet.outlet_id);

    const [formData, setFormData] = useState({
        category_name: { hindi: '', english: '', gujarati: '' },
        business_id: business_id || '', // Update with business_id
        outlet_id: outletIds,
        logo_image: null as File | null,
        swiggy_image: null as File | null,
        banner_image: null as File | null,
        is_active: false,
        selectedOutlets: [],
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [swiggyPreview, setSwiggyPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [errorMsg, setError] = useState<string>('');
    const navigate = useNavigate();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedOutlets, setSelectedOutlets] = useState<string[]>([]);
    const [successMsg, setSuccess] = useState<string>('');

    // useEffect(() => {
    //     setFormData((prevFormData) => ({
    //         ...prevFormData,
    //         outlet_id: outletIds, // Update outlet_id when outlets change
    //     }));
    // }, [outletIds]);

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            category_name: {
                ...formData.category_name,
                [name]: value,
            },
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, multiple } = e.target;

        setFormData((prevState) => {
            // Check if the field is inside `category_name`
            if (name.startsWith('category_name.')) {
                const field = name.split('.')[1]; // Extract the field (e.g., 'hindi', 'english', or 'gujarati')
                return {
                    ...prevState,
                    category_name: {
                        ...prevState.category_name,
                        [field]: value, // Update only the specific field
                    },
                };
            }

            // Handle normal fields (non-nested)
            return {
                ...prevState,
                [name]: value,
            };
        });
    };

    // Handle file changes
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const { name } = e.target;

        if (file) {
            // Update the preview
            const previewUrl = URL.createObjectURL(file);
            if (name === 'logo_image') setLogoPreview(previewUrl);
            if (name === 'swiggy_image') setSwiggyPreview(previewUrl);
            if (name === 'banner_image') setBannerPreview(previewUrl);

            setFormData((prevData) => ({
                ...prevData,
                [name]: file,
            }));
        }
    };

    const validateCurrentStep = () => {
        let newErrors: Record<string, string> = {};

        if (currentStepIndex === 0) {
            if (!formData.category_name.english.trim()) {
                newErrors.category_name = 'Category Name is required!';
            }
            if (!formData.logo_image || formData.logo_image.name.trim() === '') {
                newErrors.logo_image = 'Logo Image is required!';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure `outlet_id` contains only the selected outlets
        const updatedOutletIds = selectedOutlets.length > 0 ? selectedOutlets : [];

        const formDataToSend = new FormData();
        formDataToSend.append('category_name', JSON.stringify(formData.category_name));
        formDataToSend.append('outlet_id', JSON.stringify(updatedOutletIds)); // ✅ Send selected outlets
        formDataToSend.append('business_id', formData.business_id);
        formDataToSend.append('is_active', (updatedOutletIds.length > 0).toString()); // ✅ Active if any outlets are selected

        if (formData.logo_image) formDataToSend.append('logo_image', formData.logo_image);
        if (formData.swiggy_image) formDataToSend.append('swiggy_image', formData.swiggy_image);
        if (formData.banner_image) formDataToSend.append('banner_image', formData.banner_image);

        try {
            console.log('Dispatching API request with:', Object.fromEntries(formDataToSend.entries()));
            await dispatch(registerCategory(formDataToSend));
            console.log('API request dispatched!');

            setSuccess('Category registration successful');
            navigate(`/apps/manage-menu/${business_id}`);
            setError('');

            // Reset form state
            setFormData({
                category_name: { hindi: '', english: '', gujarati: '' },
                outlet_id: [], // Reset outlet selection
                business_id: '',
                logo_image: null,
                swiggy_image: null,
                banner_image: null,
                is_active: false,
                selectedOutlets: [],
            });
            setSelectedOutlets([]); // Clear selected outlets
            setLogoPreview(null);
            setSwiggyPreview(null);
            setBannerPreview(null);
        } catch (err) {
            setError('Error registering Category, please try again.');
            setSuccess('');
        }
    };

    const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } = useMultistepForm([
        <RegisterCategoryStep1
            formData={formData}
            errorMsg={errorMsg}
            successMsg={successMsg}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            logoPreview={logoPreview}
            swiggyPreview={swiggyPreview}
            bannerPreview={bannerPreview}
            errors={errors}
        />,

        <RegisterCategoryStep2
            selectedOutlets={selectedOutlets}
            setSelectedOutlets={setSelectedOutlets}
            formData={formData}
            handleSubmit={handleSubmit}
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
                            <Button
                                variant="primary"
                                onClick={(e) => {
                                    if (!validateCurrentStep()) return;
                                    if (isLastStep) {
                                        handleSubmit(e);
                                    } else {
                                        next();
                                    }
                                }}
                                className="px-4 py-2">
                                {isLastStep ? 'Submit' : 'Next'}
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

export default RegisterCategory;

//     return (
//         <Modal show={show} onHide={onClose}>
//             <Modal.Header closeButton>
//                 <Modal.Title>Register New Category</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <Form>
//                     <Form.Group controlId="categoryName">
//                         <Form.Label>Category Name</Form.Label>
//                         <Form.Control
//                             type="text"
//                             placeholder="English"
//                             value={formData.category_name.english}
//                             name="english"
//                             onChange={handleInputChange}
//                         />
//                         <Form.Control
//                             type="text"
//                             placeholder="Hindi"
//                             value={formData.category_name.hindi}
//                             name="hindi"
//                             onChange={handleInputChange}
//                         />
//                         <Form.Control
//                             type="text"
//                             placeholder="Gujarati"
//                             value={formData.category_name.gujarati}
//                             name="gujarati"
//                             onChange={handleInputChange}
//                         />
//                     </Form.Group>

//                     <Form.Group controlId="logoImage">
//                         <Form.Label>Logo Image</Form.Label>
//                         <Form.Control
//                             type="file"
//                             accept="image/*"
//                             onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'logo_image')}
//                         />
//                         {logoPreview && (
//                             <img src={logoPreview} alt="Logo Preview" style={{ width: '100px', height: '100px' }} />
//                         )}
//                     </Form.Group>

//                     <Form.Group controlId="swiggyImage">
//                         <Form.Label>Swiggy Image</Form.Label>
//                         <Form.Control
//                             type="file"
//                             accept="image/*"
//                             onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'swiggy_image')}
//                         />
//                         {swiggyPreview && (
//                             <img
//                                 src={swiggyPreview}
//                                 alt="Swiggy Image Preview"
//                                 style={{ width: '100px', height: '100px' }}
//                             />
//                         )}
//                     </Form.Group>

//                     <Form.Group controlId="bannerImage">
//                         <Form.Label>Banner Image</Form.Label>
//                         <Form.Control
//                             type="file"
//                             accept="image/*"
//                             onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'banner_image')}
//                         />
//                         {bannerPreview && (
//                             <img
//                                 src={bannerPreview}
//                                 alt="Banner Image Preview"
//                                 style={{ width: '100px', height: '100px' }}
//                             />
//                         )}
//                     </Form.Group>

//                     <Form.Group controlId="isActive">
//                         <Form.Check
//                             type="checkbox"
//                             label="Active"
//                             checked={formData.is_active}
//                             onChange={() => setFormData({ ...formData, is_active: !formData.is_active })}
//                         />
//                     </Form.Group>

//                     {/* <Button variant="primary" type="submit">
//                         Register Category
//                     </Button> */}
//                 </Form>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={onClose}>
//                     Close
//                 </Button>
//                 <Button variant="primary" onClick={handleSubmit}>
//                     Register Category
//                 </Button>
//             </Modal.Footer>
//         </Modal>
//     );
// };

// export default RegisterCategory;
