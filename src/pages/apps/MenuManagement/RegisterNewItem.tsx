import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, Alert, Container, Card } from 'react-bootstrap';
import { useMultistepForm } from '../../../hooks/useMultistepForm';
import { registerItem } from '../../../redux/menuManagementItem/actions';
import './RegisterNewItem.css';
import RegisterItemStep1 from './RegisterItemStep1';
import RegisterItemStep2 from './RegisterItemStep2';
import RegisterItemStep3 from './RegisterItemStep3';
import { on } from 'events';

interface Outlet {
    outlet_id: string;
    outlet_name: string;
}

interface SelectedBusiness {
    id: string;
    business_id: string;
    name: string;
    outlets: Outlet[]; // Add other required properties
}

const RegisterNewItem: React.FC = () => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        item_name: { hindi: '', english: '', gujarati: '' },
        online_display_name: '',
        price: '80',
        description: '',
        dietary: 'veg',
        available_order_type: ['dine_in'],
        // Ok so now in available_order_type we have to implement a multiselect option where a user can select one or more options from the above given and it should be in array.
        gst_type: 'none',
        category_id: '',
        business_id: '',
        logo_image: null as File | null,
        swiggy_image: null as File | null,
        banner_image: null as File | null,
        outlet_prices: ['20000'],
        is_loose: false,
        quantity_type: 'none' as 'none' | 'piece' | 'weight' | 'volume',
        quantity_params: 'none' as 'none' | 'gm' | 'kg' | 'ml' | 'l',
        quantity_value: '',
    });

    const gstTypes = ['goods', 'services'];

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [swiggyPreview, setSwiggyPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [selectedBusiness, setSelectedBusiness] = useState<SelectedBusiness | null>(null);
    const [selectedOutlets, setSelectedOutlets] = useState<string[]>([]);
    const { business_id, selectedCategoryId } = useParams<{ business_id: string; selectedCategoryId: string }>();

    const [errorMsg, setError] = useState<string>('');
    const [successMsg, setSuccess] = useState<string>('');

    useEffect(() => {
        if (business_id && selectedCategoryId) {
            setFormData((prevData) => ({
                ...prevData,
                business_id,
                category_id: selectedCategoryId,
            }));
        }
    }, [business_id, selectedCategoryId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name.startsWith('item_name')) {
            const language = name.split('.')[1]; // Get 'hindi', 'english', 'gujarati'
            setFormData((prevData) => ({
                ...prevData,
                item_name: {
                    ...prevData.item_name,
                    [language]: value, // Update the specific language field
                },
            }));
        } else if (e.target instanceof HTMLSelectElement) {
            // Handle multi-select for available_order_type
            const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
            setFormData((prevData) => ({
                ...prevData,
                [name]: selectedValues,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type, checked, value } = e.target;

        setFormData((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value, // ✅ Properly updates boolean values
        }));
    };

    const validateForm = () => {
        if (!formData.item_name || !formData.online_display_name || !formData.price) {
            setError('Please fill out all required fields.');
            return false;
        }
        return true;
    };

    useEffect(() => {
        console.log('Selected Business:', selectedBusiness); // Debugging
    }, [selectedBusiness]);

    useEffect(() => {
        console.log('business_id:', business_id); // Debugging
        console.log('category_id:', selectedCategoryId); // Debugging

        if (business_id) {
            setFormData((prevData) => ({
                ...prevData,
                business_id, // Set the business_id
            }));
        }
    }, [business_id]);

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

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Final Payload:', formData);
        if (!validateForm()) {
            console.log('Form validation failed');
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('item_name', JSON.stringify(formData.item_name));
        formDataToSend.append('online_display_name', formData.online_display_name);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('dietary', formData.dietary);
        formDataToSend.append('available_order_type', JSON.stringify(formData.available_order_type));
        formDataToSend.append('gst_type', formData.gst_type);
        formDataToSend.append('category_id', formData.category_id);
        formDataToSend.append('business_id', formData.business_id);
        if (formData.logo_image) {
            formDataToSend.append('logo_image', formData.logo_image);
        }
        if (formData.swiggy_image) {
            formDataToSend.append('swiggy_image', formData.swiggy_image);
        }
        if (formData.banner_image) {
            formDataToSend.append('banner_image', formData.banner_image);
        }
        formData.outlet_prices.forEach((price, index) => {
            formDataToSend.append(`outlet_prices[${index}]`, price);
        });
        formDataToSend.append('is_loose', formData.is_loose.toString());
        formDataToSend.append('quantity_type', formData.quantity_type);
        formDataToSend.append('quantity_params', formData.quantity_params);
        formDataToSend.append('quantity_value', formData.quantity_value);

        formDataToSend.forEach((value, key) => {
            console.log(`${key}:`, value);
        });

        try {
            console.log('Dispatching API request...');
            await dispatch(registerItem(formDataToSend));
            console.log('API request dispatched!');

            setSuccess('Item registered successfully!');
            setError('');
            setFormData({
                item_name: { hindi: '', english: '', gujarati: '' },
                online_display_name: '',
                price: '',
                description: '',
                dietary: '',
                available_order_type: [''],
                gst_type: '',
                category_id: '',
                business_id: '',
                logo_image: null,
                swiggy_image: null,
                banner_image: null,
                outlet_prices: [''],
                is_loose: false,
                quantity_type: 'none',
                quantity_params: 'none',
                quantity_value: '',
            });
            setLogoPreview(null);
            setSwiggyPreview(null);
            setBannerPreview(null);
        } catch (err) {
            setError('Error registering item, please try again.');
            setSuccess('');
        }
    };

    const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } = useMultistepForm([
        <RegisterItemStep1
            formData={formData}
            errorMsg={errorMsg}
            successMsg={successMsg}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            logoPreview={logoPreview}
            swiggyPreview={swiggyPreview}
            bannerPreview={bannerPreview}
        />,
        <RegisterItemStep2 />,
        // selectedBusiness ? (
        //     <RegisterItemStep2 business_id={selectedBusiness.business_id} setSelectedOutlets={setSelectedOutlets} />
        // ) : (
        //     <></>
        // ),
        <RegisterItemStep3 selectedOutlets={selectedOutlets} />,
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
        // <div className="register-new-item-container">
        //     <h2>Register New Item</h2>

        //     {errorMsg && <p className="error-message">{errorMsg}</p>}
        //     {successMsg && <p className="success-message">{successMsg}</p>}

        //     <form onSubmit={handleSubmit}>
        //         <div className="form-group">
        //             <label>Item Name (Hindi)</label>
        //             <input
        //                 type="text"
        //                 name="item_name.hindi"
        //                 value={formData.item_name.hindi}
        //                 onChange={handleInputChange}
        //             />
        //         </div>

        //         <div className="form-group">
        //             <label>Item Name (English)</label>
        //             <input
        //                 type="text"
        //                 name="item_name.english"
        //                 value={formData.item_name.english}
        //                 onChange={handleInputChange}
        //             />
        //         </div>

        //         <div className="form-group">
        //             <label>Item Name (Gujarati)</label>
        //             <input
        //                 type="text"
        //                 name="item_name.gujarati"
        //                 value={formData.item_name.gujarati}
        //                 onChange={handleInputChange}
        //             />
        //         </div>

        //         <div className="form-group">
        //             <label>Online Display Name</label>
        //             <input
        //                 type="text"
        //                 name="online_display_name"
        //                 value={formData.online_display_name}
        //                 onChange={handleInputChange}
        //                 required
        //             />
        //         </div>

        //         <div className="form-group">
        //             <label>Price</label>
        //             <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
        //         </div>

        //         <div className="form-group">
        //             <label>Description</label>
        //             <textarea name="description" value={formData.description} onChange={handleInputChange} />
        //         </div>

        //         <div className="form-group">
        //             <label>Dietary</label>
        //             <textarea name="dietary" value={formData.dietary} onChange={handleInputChange} />
        //         </div>

        //         <div className="form-group">
        //             <label>Available Order Type</label>
        //             <select
        //                 name="available_order_type"
        //                 multiple
        //                 value={formData.available_order_type} // Keep the state value synced
        //                 onChange={handleInputChange}>
        //                 <option value="delivery">Delivery</option>
        //                 <option value="pick-up">Pick-up</option>
        //                 <option value="dine_in">Dine-in</option>
        //                 <option value="online">Online</option>
        //             </select>
        //         </div>

        //         <div className="form-group">
        //             <label>GST Type</label>
        //             <select name="gst_type" value={formData.gst_type} onChange={handleInputChange}>
        //                 <option value="">Select GST Type</option>
        //                 <option value="goods">Goods</option>
        //                 <option value="services">Services</option>
        //             </select>
        //         </div>

        //         <div className="form-group">
        //             <label>Logo Image</label>
        //             <input type="file" name="logo_image" onChange={handleFileChange} accept="image/*" />
        //             {logoPreview && <img src={logoPreview} alt="Logo Preview" className="image-preview" />}
        //         </div>

        //         <div className="form-group">
        //             <label>Swiggy Image</label>
        //             <input type="file" name="swiggy_image" onChange={handleFileChange} accept="image/*" />
        //             {swiggyPreview && <img src={swiggyPreview} alt="Swiggy Preview" className="image-preview" />}
        //         </div>

        //         <div className="form-group">
        //             <label>Banner Image</label>
        //             <input type="file" name="banner_image" onChange={handleFileChange} accept="image/*" />
        //             {bannerPreview && <img src={bannerPreview} alt="Banner Preview" className="image-preview" />}
        //         </div>

        //         <div className="form-group">
        //             <label>Outlet Price</label>
        //             <input
        //                 type="number"
        //                 name="outlet_prices"
        //                 value={formData.outlet_prices[0]}
        //                 onChange={(e) => setFormData({ ...formData, outlet_prices: [e.target.value] })}
        //             />
        //         </div>

        //         <button type="submit">Register Item</button>
        //     </form>
        // </div>
    );
};

export default RegisterNewItem;
