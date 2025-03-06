import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Card, Row, Col, Alert } from 'react-bootstrap';

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

interface EditCategoryStep1Props {
    handleSubmit: (e: React.FormEvent) => void;
    editCategory: UpdateCategory | null;
    setEditCategory: React.Dispatch<React.SetStateAction<UpdateCategory | null>>;
    message: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFileChange: (
        e: React.ChangeEvent<HTMLInputElement>,
        field: 'logo_image' | 'swiggy_image' | 'banner_image'
    ) => void;
}

const EditCategoryStep1: React.FC<EditCategoryStep1Props> = ({
    editCategory,
    setEditCategory,
    handleSubmit,
    message,
    handleInputChange,
    handleFileChange,
}) => {
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [swiggyPreview, setSwiggyPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    useEffect(() => {
        if (editCategory) {
            if (editCategory.logo_image instanceof File) {
                setLogoPreview(URL.createObjectURL(editCategory.logo_image));
            } else if (typeof editCategory.logo_image === 'string') {
                setLogoPreview(editCategory.logo_image); // For previously saved image URL
            }

            if (editCategory.swiggy_image instanceof File) {
                setSwiggyPreview(URL.createObjectURL(editCategory.swiggy_image));
            } else if (typeof editCategory.swiggy_image === 'string') {
                setSwiggyPreview(editCategory.swiggy_image);
            }

            if (editCategory.banner_image instanceof File) {
                setBannerPreview(URL.createObjectURL(editCategory.banner_image));
            } else if (typeof editCategory.banner_image === 'string') {
                setBannerPreview(editCategory.banner_image);
            }
        }
    }, [editCategory]); // Runs whenever editCategory changes

    if (!editCategory) return <p>Loading...</p>;

    // const handleFileChange = (
    //     e: React.ChangeEvent<HTMLInputElement>,
    //     field: 'logo_image' | 'swiggy_image' | 'banner_image'
    // ) => {
    //     const file = e.target.files?.[0];
    //     console.log(`Selected ${field}:`, file);

    //     if (!file) return;

    //     setEditCategory((prev) => ({
    //         ...(prev as UpdateCategory),
    //         [field]: file,
    //     }));

    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //         if (field === 'logo_image') setLogoPreview(reader.result as string);
    //         if (field === 'swiggy_image') setSwiggyPreview(reader.result as string);
    //         if (field === 'banner_image') setBannerPreview(reader.result as string);
    //     };
    //     reader.readAsDataURL(file);
    // };

    // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = e.target;

    //     setEditCategory((prev) => {
    //         const updatedCategory = prev
    //             ? {
    //                   ...prev,
    //                   category_names: {
    //                       ...prev.category_names,
    //                       [name]: value,
    //                   },
    //               }
    //             : null;

    //         console.log('Updated inside setState:', updatedCategory);
    //         return updatedCategory;
    //     });
    // };

    return (
        <Container className="register-item-container">
            <Card className="shadow-sm">
                <Card.Header as="h2" className="text-center">
                    Edit Category
                </Card.Header>
                <Card.Body>
                    {message && <Alert variant="warning">{message}</Alert>}

                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Menu Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="logo_image"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleFileChange(e, 'logo_image')
                                    }
                                />
                                {logoPreview && (
                                    <img
                                        src={logoPreview}
                                        alt="Logo Preview"
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover',
                                            borderRadius: '5px',
                                        }}
                                        className="img-thumbnail mt-2"
                                        width="100"
                                    />
                                )}
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Swiggy Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="swiggy_image"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleFileChange(e, 'swiggy_image')
                                    }
                                />
                                {swiggyPreview && (
                                    <img
                                        src={swiggyPreview}
                                        alt="Swiggy Preview"
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover',
                                            borderRadius: '5px',
                                        }}
                                        className="img-thumbnail mt-2"
                                        width="100"
                                    />
                                )}
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Banner Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="banner_image"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleFileChange(e, 'banner_image')
                                    }
                                />
                                {bannerPreview && (
                                    <img
                                        src={bannerPreview}
                                        alt="Banner Preview"
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover',
                                            borderRadius: '5px',
                                        }}
                                        className="img-thumbnail mt-2"
                                        width="100"
                                    />
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Item Name (English)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="english"
                                    required
                                    value={editCategory?.category_names.english || ''}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Item Name (Hindi)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="hindi"
                                    required
                                    value={editCategory?.category_names.hindi || ''}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Item Name (Gujarati)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="gujarati"
                                    required
                                    value={editCategory?.category_names.gujarati || ''}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EditCategoryStep1;
