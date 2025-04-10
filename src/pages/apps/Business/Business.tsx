import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import {
    resetBusiness,
    businessList,
    updateBusinessList,
    deleteBusinessList,
    businessUpdateIsActive,
} from '../../../redux/business/actions';
import { useRedux } from '../../../hooks';
import { RootState } from '../../../redux/store';
import { setAuthorization, getUserFromLocalStorage } from '../../../helpers/api/apiCore';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import ToggleSwitch from '../MenuManagement/ToggleSwitch';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteItem';

interface Outlet {
    outlet_id: string;
    outlet_name: string;
    outlet_type: string;
    is_primary_outlet: boolean;
    outlet_address: string;
    outlet_gst_no: string;
    currency: string;
    language_id: string;
    url: string;
}

interface Business {
    business_id: string;
    business_name: string;
    business_contact: string;
    business_logo: string;
    business_address: string;
    cuisine: string;
    gst_no: string;
    outlets: Outlet[];
    business_users: any[];
    url: string;
    is_active: boolean;
    isEditing?: boolean;
}

interface UpdateBusiness {
    business_id: string;
    business_name: string;
    business_contact: string;
    business_logo: string;
    business_address: string;
    cuisine: string;
    gst_no: string;
}

const BusinessDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
    const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
    const [message, setMessage] = useState<string>('');
    const { dispatch, appSelector } = useRedux();
    const businesses = appSelector((state: RootState) => state.business.businesses);
    console.log('yes BUSINESSES : ', businesses);
    const navigate = useNavigate();
    const [editedBusinessLogoFile, setEditedBusinessLogoFile] = useState<File | null>(null); // State for storing the selected logo file
    const [toggleStates, setToggleStates] = useState<{ [key: string]: boolean }>({});

    const [isEditing, setIsEditing] = useState<boolean>(false); // Separate state for editing
    const [editedBusiness, setEditedBusiness] = useState<Business | null>(null);
    const [businessDelete, setBusinessDelete] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        if (id) {
            const business = businesses.find((business: Business) => business.business_id === id);
            if (business) {
                setSelectedBusiness(business);
                setEditedBusiness({ ...business }); // Initialize editedBusiness with current business
            } else {
                setMessage('Business not found');
            }
        }
    }, [id, businesses]);

    useEffect(() => {
        dispatch(resetBusiness());
        dispatch(businessList());
        const user = getUserFromLocalStorage();
        if (user && user.token) {
            setAuthorization(user.token);
            dispatch(businessList());
        }
    }, [dispatch]);

    const handleLogoClick = (business_id: string) => {
        setSelectedBusinessId(business_id === selectedBusinessId ? null : business_id);
    };

    const handleBusinessNameClick = (business_id: string) => {
        navigate(`/apps/business-details`, { state: { business_id: business_id } });
    };

    const handleRegisterBusiness = () => {
        navigate('/apps/business-register');
    };

    const handleEditClick = (business_id: string) => {
        const businessToUpdate = businesses.find((business: Business) => business.business_id === business_id);
        if (!businessToUpdate) {
            setMessage('Business not found.');
            return;
        }
        console.log('Edit button clicked for business:', businessToUpdate);
        setIsEditing(true); // Start editing mode
        setEditedBusiness({ ...businessToUpdate }); // Copy business details to editedBusiness for modification
        setSelectedBusiness({ ...businessToUpdate });
    };
    // useEffect(() => {
    //     if (isEditing && selectedBusiness) {
    //         console.log('Selected Business in edit mode:', selectedBusiness);
    //         console.log('Edited Business:', editedBusiness);
    //     }
    // }, [isEditing, selectedBusiness, editedBusiness]);

    const handleBusinessUpdateTogggle = (business_id: string, is_active: boolean) => {
        console.log('handleBusinessUpdateTogggle called with:', business_id, is_active);

        setToggleStates((prev) => ({
            ...prev,
            [business_id]: is_active,
        }));

        dispatch(businessUpdateIsActive(business_id, is_active));

        setTimeout(() => {
            setMessage('');
            dispatch(businessList());
        }, 500);
    };

    const handleSaveChanges = () => {
        if (editedBusiness) {
            let payload: FormData | UpdateBusiness;

            if (editedBusinessLogoFile) {
                // Create FormData when there is a new logo file
                const formData = new FormData();
                formData.append('business_id', editedBusiness.business_id);
                formData.append('business_name', editedBusiness.business_name);
                formData.append('business_contact', editedBusiness.business_contact);
                formData.append('business_address', editedBusiness.business_address);
                formData.append('gst_no', editedBusiness.gst_no);
                formData.append('cuisine', editedBusiness.cuisine);
                formData.append('business_logo', editedBusinessLogoFile); // Attach the new logo file

                // Dispatch the action with FormData payload
                dispatch(updateBusinessList(formData));

                payload = formData;
            } else {
                // If no logo file, send plain object
                payload = {
                    business_id: editedBusiness.business_id,
                    business_name: editedBusiness.business_name,
                    business_contact: editedBusiness.business_contact,
                    business_logo: editedBusiness.business_logo ?? '',
                    business_address: editedBusiness.business_address,
                    gst_no: editedBusiness.gst_no,
                    cuisine: editedBusiness.cuisine,
                };
            }

            console.log('Dispatching update with payload:', payload);

            // Dispatch the appropriate payload
            dispatch(updateBusinessList(payload));

            setIsEditing(false); // Exit editing mode
            setMessage('Business details updated successfully.');
            setTimeout(() => {
                setMessage('');
                dispatch(businessList());
            }, 500);
            setSelectedBusiness(editedBusiness); // Update selected business
        }
    };

    // useEffect(() => {
    //     console.log('Selected Business:', selectedBusiness); // Check the selected business when state changes
    //     console.log('Edited Business:', editedBusiness); // Check if the edited business is set
    // }, [selectedBusiness, editedBusiness]);

    const handleCancelEdit = () => {
        setIsEditing(false); // Cancel editing mode
        setEditedBusiness(null); // Reset the edited business
    };

    const handleDeleteClick = (business_id: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this business?');
        if (confirmDelete) {
            dispatch(deleteBusinessList(business_id));
            setMessage('Business has been deleted successfully!');
            setTimeout(() => {
                setMessage('');
                dispatch(businessList());
            });
        }
    };

    const handleDeleteBusiness = (business_id: string) => {
        setBusinessDelete(business_id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (businessDelete) {
            dispatch(deleteBusinessList(businessDelete));
        }
        setTimeout(() => {
            dispatch(businessList());
        }, 500);
        setShowDeleteModal(false);
    };

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && editedBusiness) {
            const logoPreviewUrl = URL.createObjectURL(file);
            setEditedBusiness((prev) => (prev ? { ...prev, business_logo: logoPreviewUrl } : null));
            setEditedBusinessLogoFile(file);
        }
    };

    return (
        <Card>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="header-title">Business List</h4>
                    <Button variant="primary" onClick={handleRegisterBusiness}>
                        Register New Business
                    </Button>
                </div>
                {message && <div className="alert alert-success">{message}</div>}
                <div className="table-responsive">
                    <Table className="mb-0">
                        <thead>
                            <tr>
                                <th>Logo</th>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>Address</th>
                                <th>Is Active?</th>
                                <th>GST Number</th>
                                <th>Cuisine</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {businesses.length > 0 ? (
                                businesses.map((business: Business) => (
                                    <React.Fragment key={business.business_id}>
                                        <tr>
                                            <td>
                                                {isEditing && selectedBusiness?.business_id === business.business_id ? (
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleLogoChange} // This triggers the logo change
                                                    />
                                                ) : (
                                                    <img
                                                        src={business.business_logo ?? '/default-logo.png'} // Fallback to default if no logo
                                                        alt={`${business.business_name} Logo`}
                                                        width="50"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => handleLogoClick(business.business_id)}
                                                    />
                                                )}
                                            </td>

                                            <td>
                                                {/* Business Name */}
                                                {isEditing && selectedBusiness?.business_id === business.business_id ? (
                                                    <input
                                                        type="text"
                                                        value={editedBusiness?.business_name}
                                                        onChange={(e) =>
                                                            setEditedBusiness((prev) =>
                                                                prev ? { ...prev, business_name: e.target.value } : null
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <button
                                                        className="btn btn-link p-0"
                                                        onClick={() => handleBusinessNameClick(business.business_id)}>
                                                        {business.business_name}
                                                    </button>
                                                )}
                                            </td>
                                            <td>
                                                {/* Business Contact */}
                                                {isEditing && selectedBusiness?.business_id === business.business_id ? (
                                                    <input
                                                        type="text"
                                                        value={editedBusiness?.business_contact}
                                                        onChange={(e) =>
                                                            setEditedBusiness((prev) =>
                                                                prev
                                                                    ? { ...prev, business_contact: e.target.value }
                                                                    : null
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    business.business_contact
                                                )}
                                            </td>
                                            <td>
                                                {/* Business Address */}
                                                {isEditing && selectedBusiness?.business_id === business.business_id ? (
                                                    <input
                                                        type="text"
                                                        value={editedBusiness?.business_address}
                                                        onChange={(e) =>
                                                            setEditedBusiness((prev) =>
                                                                prev
                                                                    ? { ...prev, business_address: e.target.value }
                                                                    : null
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    business.business_address
                                                )}
                                            </td>
                                            <td>
                                                <ToggleSwitch
                                                    checked={toggleStates[business.business_id] ?? business.is_active}
                                                    onChange={(checked) =>
                                                        handleBusinessUpdateTogggle(business.business_id, checked)
                                                    }
                                                />
                                            </td>

                                            <td>
                                                {/* GST Number */}
                                                {isEditing && selectedBusiness?.business_id === business.business_id ? (
                                                    <input
                                                        type="text"
                                                        value={editedBusiness?.gst_no}
                                                        onChange={(e) =>
                                                            setEditedBusiness((prev) =>
                                                                prev ? { ...prev, gst_no: e.target.value } : null
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    business.gst_no
                                                )}
                                            </td>
                                            <td>
                                                {/* Cuisine */}
                                                {isEditing && selectedBusiness?.business_id === business.business_id ? (
                                                    <input
                                                        type="text"
                                                        value={editedBusiness?.cuisine}
                                                        onChange={(e) =>
                                                            setEditedBusiness((prev) =>
                                                                prev ? { ...prev, cuisine: e.target.value } : null
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    business.cuisine
                                                )}
                                            </td>

                                            <td className="d-flex align-items-center">
                                                {/* Edit/Delete Buttons */}
                                                {isEditing && selectedBusiness?.business_id === business.business_id ? (
                                                    <>
                                                        <Button
                                                            variant="success"
                                                            style={{ padding: '5px 10px', fontSize: '14px' }}
                                                            onClick={handleSaveChanges}>
                                                            Save
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            style={{
                                                                padding: '5px 10px',
                                                                fontSize: '14px',
                                                                marginLeft: '5px',
                                                            }}
                                                            onClick={handleCancelEdit}>
                                                            Cancel
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td>
                                                            <FaRegEdit
                                                                size={20}
                                                                style={{ cursor: 'pointer', marginRight: '10px' }}
                                                                onClick={() => handleEditClick(business.business_id)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <FaTrash
                                                                size={20}
                                                                style={{ cursor: 'pointer', color: 'red' }}
                                                                onClick={() =>
                                                                    handleDeleteBusiness(business.business_id)
                                                                }
                                                            />
                                                            <ConfirmDeleteModal
                                                                show={showDeleteModal}
                                                                onClose={() => setShowDeleteModal(false)}
                                                                onConfirm={confirmDelete}
                                                                title="Delete this Business"
                                                                message="Are you sure you want to delete this Business? This action cannot be undone."
                                                            />
                                                        </td>
                                                    </>
                                                )}
                                            </td>
                                        </tr>

                                        {selectedBusinessId === business.business_id && (
                                            <tr>
                                                <td colSpan={7}>
                                                    <Table bordered size="sm">
                                                        <thead>
                                                            <tr>
                                                                <th>Outlet Name</th>
                                                                <th>Type</th>
                                                                <th>Address</th>
                                                                <th>GST Number</th>
                                                                <th>Currency</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {business.outlets.map((outlet: Outlet) => (
                                                                <tr key={outlet.outlet_id}>
                                                                    <td>{outlet.outlet_name}</td>
                                                                    <td>{outlet.outlet_type}</td>
                                                                    <td>{outlet.outlet_address}</td>
                                                                    <td>{outlet.outlet_gst_no}</td>
                                                                    <td>{outlet.currency}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7}>No businesses found.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>
        </Card>
    );
};

export default BusinessDetails;
