import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button, Alert, Container, Card } from 'react-bootstrap';
import { useMultistepForm } from '../../../hooks/useMultistepForm';
import { registerItem } from '../../../redux/menuManagementItem/actions';
import './RegisterNewItem.css';
import RegisterItemStep1 from './RegisterItemStep1';
import RegisterItemStep2 from './RegisterItemStep2';
import RegisterItemStep3 from './RegisterItemStep3';
import { updateItem } from '../../../redux/menuManagementItem/actions';

interface Outlet {
    outlet_id: string;
    outlet_name: string;
}
interface OutletPrice {
    outlet_id: string;
    price: number;
}

interface CategoryItem {
    selectedCategoryId: string;
    item_id: string;
    item_names: {
        hindi: string;
        english: string;
        gujarati: string;
    };
    price: number;
    dietary: string;
    available_order_type: string[];
    online_display_name: string;
    description: string;
    gst_type: string;
    category_id: string;
    business_id: string;
    logo_image?: File;
    swiggy_image?: File;
    banner_image?: File;
    is_loose: boolean;
    quantity_type: string;
    quantity_params: string;
    quantity_value: number;
    // outlets: Outlet[];
    outlet_prices: { outlet_id: string; price: number }[];
}

interface SelectedBusiness {
    id: string;
    business_id: string;
    name: string;
    business_name: string;
    // outlets: Outlet[]; // Add other required properties
}

const RegisterNewItem: React.FC = () => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        item_name: { hindi: '', english: '', gujarati: '' },
        online_display_name: '',
        price: '80',
        description: '',
        dietary: 'veg',
        available_order_type: [''],
        // Ok so now in available_order_type we have to implement a multiselect option where a user can select one or more options from the above given and it should be in array.
        gst_type: 'none',
        category_id: '',
        business_id: '',
        logo_image: null as File | null,
        swiggy_image: null as File | null,
        banner_image: null as File | null,
        outlet_prices: [{ outlet_id: '', price: 0 }],
        is_loose: false,
        quantity_type: 'none' as 'none' | 'piece' | 'weight' | 'volume',
        quantity_params: 'none' as 'none' | 'gm' | 'kg' | 'ml' | 'lt',
        quantity_value: 'none',
    });

    const gstTypes = ['goods', 'services'];

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [swiggyPreview, setSwiggyPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [selectedBusiness, setSelectedBusiness] = useState<SelectedBusiness | null>(null);
    const [selectedOutlets, setSelectedOutlets] = useState<Outlet[]>([]);
    // const { business_id, selectedCategoryId, item_id } =
    //     useParams<{ business_id: string; selectedCategoryId: string; item_id: string }>();
    const location = useLocation();
    const business_id = location.state?.business_id;
    const selectedCategoryId = location.state?.category_id;
    const item_id = location.state?.item_id;
    const isEditMode = Boolean(item_id);
    const navigate = useNavigate();
    const [errors, setErrors] = useState<Record<string, string>>({});
    // const [editItem, setEditItem] = useState<CategoryItem | null>(null);
    const [errorMsg, setError] = useState<string>('');
    const [successMsg, setSuccess] = useState<string>('');

    useEffect(() => {
        console.log('Before update:', formData);
        if (formData.is_loose && !formData.quantity_type) {
            setFormData((prevState) => ({ ...prevState, is_loose: false }));
        }
        console.log('After update:', formData);
    }, [formData.quantity_type]);

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

    // useEffect(() => {
    //     if (editItem) {
    //         setFormData({
    //             item_name: editItem.item_names || { hindi: '', english: '', gujarati: '' },
    //             online_display_name: editItem.online_display_name || '',
    //             price: String(editItem.price || ''),
    //             description: editItem.description || '',
    //             dietary: editItem.dietary || 'veg',
    //             available_order_type: editItem.available_order_type || [''],
    //             gst_type: editItem.gst_type || 'none',
    //             category_id: editItem.category_id || '',
    //             business_id: editItem.business_id || '',
    //             logo_image: null,
    //             swiggy_image: null,
    //             banner_image: null,
    //             outlet_prices: editItem.outlet_prices || [{ outlet_id: '', price: 0 }],
    //             is_loose: editItem.is_loose || false,
    //             quantity_type: editItem.quantity_type as 'none' | 'piece' | 'weight' | 'volume',
    //             quantity_params: editItem.quantity_params as 'none' | 'gm' | 'kg' | 'ml' | 'lt',

    //             quantity_value: String(editItem.quantity_value || ''),
    //         });
    //     }
    // }, [isEditMode, editItem]);

    // const validateCurrentStep = () => {
    //     let newErrors: Record<string, string> = {};

    //     if (currentStepIndex === 0) {
    //         if (!formData.item_name.english.trim()) {
    //             newErrors.item_name = 'Item name is required.';
    //         }

    //         if (
    //             formData.available_order_type.length === 0 ||
    //             formData.available_order_type.some((type) => !type.trim())
    //         ) {
    //             newErrors.available_order_type = 'Order Type is required.';
    //         }

    //         if (!formData.dietary) newErrors.dietary = 'Dietary Type is required';
    //     }
    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // };

    const validateCurrentStep = () => {
        console.log('Available Order TYPE VALUE:', formData.available_order_type);

        let newErrors: Record<string, string> = {};

        if (currentStepIndex === 0) {
            if (!formData.item_name.english.trim()) {
                newErrors.item_name = 'Item name is required.';
            }

            if (
                !Array.isArray(formData.available_order_type) ||
                formData.available_order_type.filter(Boolean).length === 0
            ) {
                console.log('Available Order TYPE ERROR: Required field is missing!');
                newErrors.available_order_type = 'Order Type is required.';
            }

            if (!formData.dietary) newErrors.dietary = 'Dietary Type is required';
        }

        console.log('Available Order TYPE ERROR: ', errors);

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setFormData((prevState) => {
            // Handling nested state updates for item_name fields
            if (name.startsWith('item_name.')) {
                const field = name.split('.')[1]; // Extract 'hindi', 'english', or 'gujarati'
                return {
                    ...prevState,
                    item_name: {
                        ...prevState.item_name,
                        [field]: value, // Update only the specific field
                    },
                };
            }

            // Handling multiple selection in <select multiple>
            if (e.target instanceof HTMLSelectElement && e.target.multiple) {
                const selectedValues = Array.from(e.target.selectedOptions).map((option) => option.value);
                return {
                    ...prevState,
                    [name]: selectedValues, // Store as an array
                };
            }

            // Handle normal fields
            return {
                ...prevState,
                [name]: value,
            };
        });
    };

    // const validateForm = () => {
    //     if (!formData.item_name || !formData.online_display_name || !formData.price) {
    //         setError('Please fill out all required fields.');
    //         return false;
    //     }
    //     return true;
    // };

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

    // Assuming you have a handlePriceChange function like this:

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, outlet_id: string) => {
        const updatedPrice = parseFloat(e.target.value); // Convert to number

        if (isNaN(updatedPrice) || updatedPrice <= 0) {
            return;
        }

        const updatedOutletPrices = [...formData.outlet_prices];
        const outletIndex = updatedOutletPrices.findIndex((priceEntry) => priceEntry.outlet_id === outlet_id);

        if (outletIndex !== -1) {
            updatedOutletPrices[outletIndex].price = updatedPrice; // Update price
        } else {
            updatedOutletPrices.push({ outlet_id, price: updatedPrice }); // If outlet is new, add it
        }

        // Update the form data with the new prices
        setFormData({
            ...formData,
            outlet_prices: updatedOutletPrices,
        });
    };

    const validOutletPrices = formData.outlet_prices.filter((price) => price.outlet_id !== '' && price.price !== 0);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Final Payload Before Dispatch:', JSON.stringify(formData, null, 2));
        console.log('Final Payload:', formData);
        // if (!validateForm()) {
        //     console.log('Form validation failed');
        //     return;
        // }

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
        if (validOutletPrices.length > 0) {
            formDataToSend.append('outlet_prices', JSON.stringify(validOutletPrices));
        }

        // formData.outlet_prices.forEach((price: OutletPrice, index: number) => {
        //     formDataToSend.append(`outlet_prices[${index}]`, JSON.stringify(price));
        // });

        formDataToSend.append('is_loose', formData.is_loose.toString());
        formDataToSend.append('quantity_type', formData.quantity_type);
        formDataToSend.append('quantity_params', formData.quantity_params);
        formDataToSend.append('quantity_value', formData.quantity_value);

        formDataToSend.forEach((value, key) => {
            console.log(`${key}:`, value);
        });

        try {
            if (isEditMode) {
                console.log('Dispatching EDIT API: ');
                dispatch(updateItem(formDataToSend));
            } else {
                console.log('Dispatching API request...');
                await dispatch(registerItem(formDataToSend));
                console.log('API request dispatched!');
            }

            setSuccess('Item registered successfully!');
            navigate(`/apps/manage-menu`);
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
                outlet_prices: [{ outlet_id: '', price: 0 }],
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

    // console.log('Selected outlets in parent component:', selectedOutlets);

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
            errors={errors}
        />,
        <RegisterItemStep2 selectedOutlets={selectedOutlets} setSelectedOutlets={setSelectedOutlets} />,
        // selectedBusiness ? (
        //     <RegisterItemStep2 business_id={selectedBusiness.business_id} setSelectedOutlets={setSelectedOutlets} />
        // ) : (
        //     <></>
        // ),
        <RegisterItemStep3
            formData={formData}
            handlePriceChange={handlePriceChange}
            selectedOutlets={selectedOutlets}
            business={selectedBusiness}
            handleChange={handleChange}
            setFormData={setFormData}
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

                                    // if (formData.is_loose && !formData.quantity_type) {
                                    //     setFormData((prevState) => ({
                                    //         ...prevState,
                                    //         is_loose: false,
                                    //     }));
                                    // }
                                    // if (formData.quantity_type && !formData.quantity_value) {
                                    //     setFormData((prevState) => ({
                                    //         ...prevState,
                                    //         is_loose: false,
                                    //     }));
                                    // }

                                    if (isLastStep) {
                                        handleSubmit(e);
                                    } else {
                                        next();
                                    }
                                }}
                                className="px-4 py-2">
                                {isLastStep ? (isEditMode ? 'Update' : 'Finish') : 'Next'}
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

export default RegisterNewItem;
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
