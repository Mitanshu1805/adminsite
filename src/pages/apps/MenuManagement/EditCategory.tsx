import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useRedux } from '../../../hooks';
import { useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { updateCategory } from '../../../redux/actions';
import { useMultistepForm } from '../../../hooks/useMultistepForm';
import { Alert, Container, Card } from 'react-bootstrap';
import { categoryItemList } from '../../../redux/actions';
import EditCategoryStep1 from './EditCategoryStep1';
import EditCategoryStep2 from './EditCategoryStep2';

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
    const { dispatch, appSelector } = useRedux();
    const [editItem, setEditItem] = useState<UpdateCategory | null>(null);
    const [message, setMessage] = useState<string>('');
    const [successMsg, setSuccess] = useState<string>('');
    const [editCategory, setEditCategory] = useState<UpdateCategory | null>(null);
    // const { business_id, selectedCategoryId } = useParams<{ business_id: string; selectedCategoryId: string }>();
    const location = useLocation();
    const business_id = location.state?.business_id;
    const selectedCategoryId = location.state?.category_id;
    // console.log('Params:', { business_id, selectedCategoryId });

    const categories = appSelector((state: RootState) => state.category.categories || []);
    const isEditMode = Boolean(editCategory && selectedCategoryId);
    const [isEditing, setIsEditing] = useState(false); // 🔹 Track if user has edited data

    const [errorMsg, setError] = useState<string>('');
    const navigate = useNavigate();
    const [selectedOutlets, setSelectedOutlets] = useState<string[]>([]);

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [swiggyPreview, setSwiggyPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!editCategory) return;
        console.log('Updated category:', editCategory);
    }, [editCategory]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsEditing(true); // ✅ Set editing state so `useEffect` doesn’t reset
        const { name, value } = e.target;
        setEditCategory((prev) =>
            prev
                ? {
                      ...prev,
                      category_names: {
                          ...prev.category_names,
                          [name]: value,
                      },
                  }
                : null
        );
    };

    useEffect(() => {
        if (!selectedCategoryId || editCategory || isEditing) return;

        console.log('Fetching categories from Redux:', categories);

        if (categories.length === 0) {
            dispatch(categoryItemList(business_id!));
        }

        const categoryToEdit = categories.find(
            (category: UpdateCategory) => category.category_id === selectedCategoryId
        );

        if (categoryToEdit) {
            console.log('Category to EDIT found:', categoryToEdit);

            setEditCategory((prev) => {
                const updatedCategory = { ...categoryToEdit, business_id };

                console.log('Setting editCategory:', updatedCategory);
                return updatedCategory;
            });

            if (categoryToEdit.outlets) {
                const activeOutlets = categoryToEdit.outlets
                    .filter((outlet: any) => outlet.is_active)
                    .map((outlet: any) => outlet.id);
                setSelectedOutlets(activeOutlets);
            }
        } else {
            setMessage('Category to EDIT not found');
        }
    }, [selectedCategoryId, categories, business_id, dispatch]);

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: 'logo_image' | 'swiggy_image' | 'banner_image'
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setEditCategory((prev) => {
            if (!prev) return null; // Ensure prev exists
            return {
                ...prev,
                [field]: file, // Update file field
            };
        });

        // Update preview images
        const reader = new FileReader();
        reader.onloadend = () => {
            if (field === 'logo_image') setLogoPreview(reader.result as string);
            if (field === 'swiggy_image') setSwiggyPreview(reader.result as string);
            if (field === 'banner_image') setBannerPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        console.log('Submitting payload:', editCategory);
        e.preventDefault();
        console.log('Form submitted');

        if (!editCategory) {
            console.log('No Category Save');
            setMessage('No Category Save');
            return;
        }

        const updatedCategory = selectedOutlets.map((outlet_data: any) => outlet_data?.outlet_id);
        console.log('Selected Outlets: ', selectedOutlets);

        console.log('Updated Category Before Dispatch:', updatedCategory);

        const formData = new FormData();
        formData.append('category_name', JSON.stringify(editCategory.category_names));
        formData.append('is_active', editCategory.is_active.toString());
        formData.append('category_id', editCategory.category_id);
        formData.append('business_id', editCategory.business_id);

        if (editCategory.logo_image) formData.append('logo_image', editCategory.logo_image);
        if (editCategory.swiggy_image) formData.append('swiggy_image', editCategory.swiggy_image);
        if (editCategory.banner_image) formData.append('banner_image', editCategory.banner_image);
        formData.append('outlet_id', JSON.stringify(selectedOutlets));

        console.log('Dispatching API call with data:', Object.fromEntries(formData.entries()));
        console.log('Final EditCategory:', editCategory);

        dispatch(updateCategory(formData));
        setSuccess('Category Updated successfully!');
        navigate(`/apps/manage-menu/`, { state: { business_id: business_id } });
    };

    const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } = useMultistepForm([
        <EditCategoryStep1
            handleSubmit={handleSubmit}
            handleFileChange={handleFileChange}
            editCategory={editCategory}
            setEditCategory={(updatedCategory) => {
                console.log('Persisting editCategory across steps:', updatedCategory);
                // setEditCategory((prev) => ({ ...prev, ...updatedCategory })); // Merge changes
            }}
            message={message}
            handleInputChange={handleInputChange}
        />,

        <EditCategoryStep2
            handleSubmit={handleSubmit}
            editCategory={editCategory}
            setEditCategory={setEditCategory}
            message={message}
            selectedOutlets={selectedOutlets}
            setSelectedOutlets={setSelectedOutlets}
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
                                    console.log('Before clicking next:', editCategory);
                                    if (isLastStep) {
                                        handleSubmit(e);
                                    } else {
                                        next();
                                    }
                                    console.log('After clicking next:', editCategory);
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

export default EditCategory;

{
    /* <Modal show={show} onHide={onClose}>
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
        </Modal> */
}
