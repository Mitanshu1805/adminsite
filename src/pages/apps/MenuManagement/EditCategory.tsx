import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useRedux } from '../../../hooks';
import { registerCategory } from '../../../redux/actions';

interface UpdateCategoryProps {
    show: boolean;
    onClose: () => void;
}

interface UpdateCategory {
    category_names: {
        hindi: string;
        english: string;
        gujarati: string;
    };
    business_id: string;
    logo_image?: File;
    swiggy_image?: File;
    banner_image?: File;
    category_id: string;
    is_active: boolean;
}

const EditCategory: React.FC<UpdateCategoryProps> = ({ show, onClose }) => {
    const { dispatch } = useRedux();
    const [editItem, setEditItem] = useState<UpdateCategory | null>(null);
    const [message, setMessage] = useState<string>('');
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [swiggyPreview, setSwiggyPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    useEffect(() => {
        // If the modal is shown, reset or load the category data
        if (show && editItem === null) {
            // You might want to fetch the category data based on category_id here
            // Example: setEditItem(fetchedCategory);
        }
    }, [show]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (editItem) {
            setEditItem({
                ...editItem,
                category_names: {
                    ...editItem.category_names,
                    [name]: value,
                },
            });
        }
    };

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: 'logo_image' | 'swiggy_image' | 'banner_image'
    ) => {
        const file = e.target.files?.[0];
        if (file && editItem) {
            const updatedItem = { ...editItem };
            updatedItem[field] = file;
            setEditItem(updatedItem);

            // Set image preview
            const reader = new FileReader();
            reader.onloadend = () => {
                if (field === 'logo_image') {
                    setLogoPreview(reader.result as string);
                } else if (field === 'swiggy_image') {
                    setSwiggyPreview(reader.result as string);
                } else if (field === 'banner_image') {
                    setBannerPreview(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = () => {
        if (editItem) {
            const formData = new FormData();
            formData.append('category_name', JSON.stringify(editItem.category_names));
            if (editItem.logo_image) {
                formData.append('logo_image', editItem.logo_image);
            }
            if (editItem.swiggy_image) {
                formData.append('swiggy_image', editItem.swiggy_image);
            }
            if (editItem.banner_image) {
                formData.append('banner_image', editItem.banner_image);
            }
            formData.append('is_active', editItem.is_active.toString());
            formData.append('category_id', editItem.category_id);
            formData.append('business_id', editItem.business_id);

            dispatch(registerCategory(formData));
        } else {
            setMessage('No Category Save');
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message && <p>{message}</p>}
                <Form>
                    <Form.Group controlId="categoryName">
                        <Form.Label>Category Name (English)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="English"
                            value={editItem?.category_names.english || ''}
                            name="english"
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="categoryNameHindi">
                        <Form.Label>Category Name (Hindi)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Hindi"
                            value={editItem?.category_names.hindi || ''}
                            name="hindi"
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="categoryNameGujarati">
                        <Form.Label>Category Name (Gujarati)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Gujarati"
                            value={editItem?.category_names.gujarati || ''}
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
                            <img src={swiggyPreview} alt="Swiggy Preview" style={{ width: '100px', height: '100px' }} />
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
                            <img src={bannerPreview} alt="Banner Preview" style={{ width: '100px', height: '100px' }} />
                        )}
                    </Form.Group>
                    <Form.Group controlId="isActive">
                        <Form.Label>Is Active?</Form.Label>
                        <Form.Check
                            type="checkbox"
                            checked={editItem?.is_active || false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                if (editItem) {
                                    setEditItem({
                                        ...editItem,
                                        is_active: e.target.checked,
                                    });
                                }
                            }}
                            label="Active"
                        />
                    </Form.Group>

                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditCategory;
