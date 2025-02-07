import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { registerCategory } from '../../../redux/actions';

interface RegisterCategoryProps {
    show: boolean;
    onClose: () => void;
    // businessId: string;
}

// Define the Outlet type
interface Outlet {
    outlet_id: string;
    business_id: string;
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
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [swiggyPreview, setSwiggyPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [errorMsg, setError] = useState<string>('');
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

    // Handle file changes
    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        fileType: 'logo_image' | 'swiggy_image' | 'banner_image'
    ) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setFormData({
                ...formData,
                [fileType]: file,
            });
            const previewUrl = URL.createObjectURL(file);
            if (fileType === 'logo_image') setLogoPreview(previewUrl);
            if (fileType === 'swiggy_image') setSwiggyPreview(previewUrl);
            if (fileType === 'banner_image') setBannerPreview(previewUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('category_name', JSON.stringify(formData.category_name));
        formDataToSend.append('outlet_id', JSON.stringify(formData.outlet_id));
        formDataToSend.append('business_id', formData.business_id);
        formDataToSend.append('is_active', formData.is_active.toString());

        if (formData.logo_image) {
            formDataToSend.append('logo_image', formData.logo_image);
        }
        if (formData.swiggy_image) {
            formDataToSend.append('swiggy_image', formData.swiggy_image);
        }
        if (formData.banner_image) {
            formDataToSend.append('banner_image', formData.banner_image);
        }

        try {
            console.log('Dispatching API request...');
            await dispatch(registerCategory(formDataToSend));
            console.log('API request dispatched!');

            setSuccess('Category registration successful');
            setError('');
            // Reset form state
            setFormData({
                category_name: { hindi: '', english: '', gujarati: '' },
                outlet_id: outletIds,
                business_id: '',
                logo_image: null,
                swiggy_image: null,
                banner_image: null,
                is_active: false,
            });
            setLogoPreview(null);
            setSwiggyPreview(null);
            setBannerPreview(null);
        } catch (err) {
            setError('Error registering Category, please try again.');
            setSuccess('');
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Register New Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="categoryName">
                        <Form.Label>Category Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="English"
                            value={formData.category_name.english}
                            name="english"
                            onChange={handleInputChange}
                        />
                        <Form.Control
                            type="text"
                            placeholder="Hindi"
                            value={formData.category_name.hindi}
                            name="hindi"
                            onChange={handleInputChange}
                        />
                        <Form.Control
                            type="text"
                            placeholder="Gujarati"
                            value={formData.category_name.gujarati}
                            name="gujarati"
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="logoImage">
                        <Form.Label>Logo Image</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'logo_image')}
                        />
                        {logoPreview && (
                            <img src={logoPreview} alt="Logo Preview" style={{ width: '100px', height: '100px' }} />
                        )}
                    </Form.Group>

                    <Form.Group controlId="swiggyImage">
                        <Form.Label>Swiggy Image</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'swiggy_image')}
                        />
                        {swiggyPreview && (
                            <img
                                src={swiggyPreview}
                                alt="Swiggy Image Preview"
                                style={{ width: '100px', height: '100px' }}
                            />
                        )}
                    </Form.Group>

                    <Form.Group controlId="bannerImage">
                        <Form.Label>Banner Image</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'banner_image')}
                        />
                        {bannerPreview && (
                            <img
                                src={bannerPreview}
                                alt="Banner Image Preview"
                                style={{ width: '100px', height: '100px' }}
                            />
                        )}
                    </Form.Group>

                    <Form.Group controlId="isActive">
                        <Form.Check
                            type="checkbox"
                            label="Active"
                            checked={formData.is_active}
                            onChange={() => setFormData({ ...formData, is_active: !formData.is_active })}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Register Category
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Register Category
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RegisterCategory;
