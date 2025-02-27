import React, { useState, useEffect } from 'react';
import { Card, Table, Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import {
    resetBusiness,
    businessList,
    deleteOutlet,
    updateOutlet,
    deleteBusinessUser,
    updateBusinessUser,
    outletUpdateIsActive,
} from '../../../redux/business/actions';
import { useRedux } from '../../../hooks';
import { RootState } from '../../../redux/store';
import { languageList } from '../../../redux/business/actions';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import RegisterOutletModal from './RegisterNewOutlet';
import RegisterBusinessUserModal from './RegisterNewBusinessUser';
import { categoryItemList } from '../../../helpers/api/auth';
import { FaHamburger } from 'react-icons/fa';
import ToggleSwitch from '../MenuManagement/ToggleSwitch';

interface Outlet {
    outlet_id: string;
    outlet_name: string;
    outlet_type: string;
    is_primary_outlet: boolean;
    outlet_address: string;
    outlet_gst_no: string;
    business_id: string;
    currency: string;
    language_id: string;
    url: string;
    is_active: boolean;
}

interface BusinessUser {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    address: string;
    user_id: string;
    business_id: string;
}

interface Business {
    business_id: string;
    business_name: string;
    business_logo: string;
    business_address: string;
    business_contact: string;
    cuisine: string;
    gst_no: string;
    outlets: Outlet[];
    business_users: BusinessUser[];
    is_active: boolean;
    user_id: string;
}

interface UpdateOutlet {
    outlet_id: string;
    outlet_name: string;
    outlet_type: string;
    outlet_address: string;
    gst_no: string;
    business_id: string;
    language_id: string;
}

const BusinessDetails: React.FC = () => {
    // const { id } = useParams<{ id: string }>(); // Extracting 'id' from URL params
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
    const location = useLocation();
    const id = location.state?.business_id;

    const { dispatch, appSelector } = useRedux();
    const businesses = appSelector((state: RootState) => state.business.businesses || []);
    const navigate = useNavigate();
    const [showOutletModal, setShowOutletModal] = useState(false);
    const [showBusinessUserModal, setShowBusinessUserModal] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [toggleStates, setToggleStates] = useState<{ [key: string]: boolean }>({});
    const [isOutletEditing, setIsOutletEditing] = useState<boolean>(false); // Separate state for editing
    const [isBusinessUserEditing, setIsBusinessUserEditing] = useState<boolean>(false);
    const [editedOutlet, setEditedOutlet] = useState<Outlet | null>(null); // Store
    const [editedBusinessUser, setEditedBusinessUser] = useState<BusinessUser | null>(null);
    const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
    const [selectedBusinessUser, setSelectedBusinessUser] = useState<BusinessUser | null>(null);
    const { languages, loading, error } = useSelector((state: RootState) => state.language) as {
        languages: { id: string; name: string }[];
        loading: boolean;
        error: string | null;
    };

    useEffect(() => {
        console.log('Dispatching actions for business list');
        dispatch(resetBusiness());
        dispatch(businessList());
    }, [dispatch]);

    useEffect(() => {
        if (!languages.length) {
            dispatch(languageList());
        }
    }, [dispatch, languages.length]);

    useEffect(() => {
        console.log('Business ID from URL:', id); // Log the 'id' variable from useParams
        console.log('Available businesses:', businesses); // Log the businesses array

        if (id) {
            // Ensure that 'id' is a string and matches the format of business.business_id
            const business = businesses.find((business: Business) => business.business_id === id);
            console.log('business res: ', business);

            if (business) {
                setSelectedBusiness(business);
            } else {
                console.log('Business not found in the list!');
            }
        }
    }, [id, businesses]);

    if (!businesses.length) {
        return <div>Loading business details...</div>;
    }

    if (!selectedBusiness) {
        return <div>Business not found!</div>;
    }

    const handleManageMenu = (business_id: string) => {
        navigate(`/apps/manage-menu`, { state: { business_id: business_id } });
        // console.log('Dispatching action:', categoryItemList(business_id));
        // dispatch(categoryItemList(business_id));
    };

    const handleOutletMenu = (business_id: string, outlet_id: string) => {
        navigate(`/apps/outlet-menu`, { state: { business_id: business_id, outlet_id: outlet_id } });
    };

    const handleDeleteOutlet = (outlet_id: string, business_id: string) => {
        const confirmDeleteOutlet = window.confirm('Are you sure you want to delete this Outlet?');
        if (confirmDeleteOutlet) {
            console.log('businessId here OUTLET >>>>>> ', business_id);
            dispatch(deleteOutlet(outlet_id, business_id));
            setMessage('Outlet deleted successfully');
            // setTimeout(() => {
            //     setMessage('');
            //     dispatch(deleteOutlet(outlet_id, business_id));
            // });
        }
    };

    const handleDeleteBusinessUser = (user_id: string, business_id: string) => {
        const confirmDeleteBusinessUser = window.confirm('Are you sure you want to delete this Outlet?');
        if (confirmDeleteBusinessUser) {
            console.log('userId here >>>>>> ', user_id);
            console.log('businessId here >>>>>> ', business_id);
            dispatch(deleteBusinessUser(user_id, business_id));
            setMessage('BusinessUser deleted successfully');
            // setTimeout(() => {
            //     setMessage('');
            //     dispatch(deleteOutlet(outlet_id, business_id));
            // });
        }
    };

    const handleRegisterNewOutlet = () => {
        if (!showOutletModal) {
            // Only toggle if the modal isn't already open
            setShowOutletModal(true);
        }
    };

    const handleRegisterNewBusinessUser = () => {
        if (!showBusinessUserModal) {
            // Only toggle if the modal isn't already open
            setShowBusinessUserModal(true);
        }
    };

    const handleCloseOutletModal = () => {
        console.log('Closing modal');
        setShowOutletModal(false); // Hide the modal when clicked
    };

    const handleCloseBusinessUserModal = () => {
        console.log('Closing modal');
        setShowBusinessUserModal(false); // Hide the modal when clicked
    };

    const handleEditOutletClick = (
        outlet_id: string,
        outlet_name: string,
        outlet_type: string,
        outlet_address: string,
        outlet_gst_no: string,
        business_id: string,
        language_id: string
    ) => {
        const outletToUpdate = selectedBusiness.outlets.find((outlet: Outlet) => outlet.outlet_id === outlet_id);
        if (!outletToUpdate) {
            setMessage('Outlet not found');
            return;
        }
        console.log('Edit Button clicked for Outlet:', outletToUpdate);
        setIsOutletEditing(true);
        setEditedOutlet({ ...outletToUpdate, business_id: selectedBusiness.business_id });
        setSelectedOutlet({ ...outletToUpdate });
    };

    const handleOutletUpdateToggle = (outlet_id: string, is_active: boolean) => {
        console.log('handleOutletUpdateToggle called with:', outlet_id, is_active);

        setToggleStates((prev) => ({
            ...prev,
            [outlet_id]: is_active,
        }));

        dispatch(outletUpdateIsActive(outlet_id, is_active));

        setTimeout(() => {
            setMessage('');
            dispatch(businessList());
        }, 500);
    };

    const handleEditBusinessUserClick = (
        first_name: string,
        last_name: string,
        email: string,
        phone_number: string,
        address: string,
        user_id: string
    ) => {
        const businessUserToUpdate = selectedBusiness.business_users.find(
            (business_users: BusinessUser) => business_users.user_id === user_id
        );
        if (!businessUserToUpdate) {
            setMessage('BusinessUser not found');
            return;
        }
        console.log('Edit Button clicked for BusinessUser:', businessUserToUpdate);
        setIsBusinessUserEditing(true);
        setEditedBusinessUser({ ...businessUserToUpdate });
        setSelectedBusinessUser({ ...businessUserToUpdate });
    };

    const handleSaveOutletChanges = () => {
        if (editedOutlet) {
            const payload: UpdateOutlet = {
                outlet_id: editedOutlet.outlet_id,
                outlet_name: editedOutlet.outlet_name,
                outlet_type: editedOutlet.outlet_type,
                outlet_address: editedOutlet.outlet_address,
                gst_no: editedOutlet.outlet_gst_no,
                business_id: editedOutlet.business_id || selectedBusiness.business_id,
                language_id: editedOutlet.language_id,
            };

            console.log('Payload ready for submission:', payload);
            dispatch(updateOutlet(payload));

            setIsOutletEditing(false); // Exit editing mode
            setMessage('Outlet details updated successfully.');
            setTimeout(() => {
                setMessage('');
                dispatch(businessList());
            }, 500);
            setSelectedOutlet(editedOutlet);
        }
    };

    const handleCancelOutletEdit = () => {
        setIsOutletEditing(false); // Cancel editing mode
        setEditedOutlet(null); // Reset the edited business
    };

    const handleSaveBusinessUserChanges = () => {
        console.log('Business', editedBusinessUser);
        if (editedBusinessUser) {
            const payload: BusinessUser = {
                business_id: editedBusinessUser.business_id,
                user_id: editedBusinessUser.user_id,
                first_name: editedBusinessUser.first_name,
                last_name: editedBusinessUser.last_name,
                email: editedBusinessUser.email,
                phone_number: editedBusinessUser.phone_number,
                address: editedBusinessUser.address,
            };

            console.log('Payload ready for submission:', payload);
            dispatch(updateBusinessUser(payload));

            setIsBusinessUserEditing(false); // Exit editing mode
            setMessage('BusinessUser details updated successfully.');
            setTimeout(() => {
                setMessage('');
                dispatch(businessList());
            }, 500);
            setSelectedBusinessUser(editedBusinessUser);
        }
    };

    const handleCancelBusinessUserEdit = () => {
        setIsBusinessUserEditing(false); // Cancel editing mode
        setEditedBusinessUser(null); // Reset the edited business
    };

    return (
        <>
            <Card className="mb-3">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        {/* Business Logo and Name */}
                        <div className="d-flex align-items-center">
                            <img
                                src={selectedBusiness.business_logo}
                                alt={`${selectedBusiness.business_name} Logo`}
                                style={{ width: '80px', height: '80px', borderRadius: '50%', marginRight: '20px' }}
                            />
                            <h3 className="header-title">{selectedBusiness.business_name}</h3>
                        </div>

                        {/* Edit and Delete Buttons */}
                        <div>
                            <Button className="me-2" onClick={() => handleManageMenu(selectedBusiness.business_id)}>
                                Manage Menu
                            </Button>
                            <Button
                                variant="outline-primary"
                                className="me-2"
                                onClick={() => {
                                    console.log('Edit button clicked');
                                    // Add your edit logic here
                                }}>
                                <FaRegEdit size={20} />
                            </Button>
                            <Button
                                variant="outline-danger"
                                onClick={() => {
                                    console.log('Delete button clicked');
                                    // Add your delete logic here
                                }}>
                                <FaTrash size={20} />
                            </Button>
                        </div>
                    </div>

                    {/* Business Details */}
                    <div>
                        <p>
                            <strong>Contact: </strong>
                            {selectedBusiness.business_contact}
                        </p>
                        <p>
                            <strong>Address: </strong>
                            {selectedBusiness.business_address}
                        </p>
                        <p>
                            <strong>Cuisine: </strong>
                            {selectedBusiness.cuisine}
                        </p>
                        <p>
                            <strong>GST Number: </strong>
                            {selectedBusiness.gst_no}
                        </p>
                        <p>
                            <strong>Active Status: </strong>
                            {selectedBusiness.is_active ? 'Active' : 'Inactive'}
                        </p>
                    </div>
                </Card.Body>
            </Card>

            <Card>
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="header-title">{selectedBusiness.business_name} - Outlets:</h4>
                        <Button onClick={handleRegisterNewOutlet}>Register New Outlet</Button>
                        <RegisterOutletModal
                            show={showOutletModal}
                            onClose={handleCloseOutletModal}
                            businessId={selectedBusiness.business_id}
                        />
                    </div>
                    <div className="table-responsive">
                        <Table className="mb-0">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Address</th>
                                    <th>GST Number</th>
                                    <th>Language</th>
                                    <th>Currency</th>
                                    <th>Menu</th>
                                    <th>Is Active?</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedBusiness.outlets.length > 0 ? (
                                    selectedBusiness.outlets.map((outlet: Outlet) => (
                                        <tr key={outlet.outlet_id}>
                                            <td>
                                                {isOutletEditing && selectedOutlet?.outlet_id === outlet.outlet_id ? (
                                                    <input
                                                        type="text"
                                                        value={editedOutlet?.outlet_name || ''}
                                                        onChange={(e) =>
                                                            setEditedOutlet((prev) =>
                                                                prev ? { ...prev, outlet_name: e.target.value } : null
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    outlet.outlet_name
                                                )}
                                            </td>
                                            <td>
                                                {isOutletEditing && selectedOutlet?.outlet_id === outlet.outlet_id ? (
                                                    <input
                                                        type="text"
                                                        value={editedOutlet?.outlet_type || ''}
                                                        onChange={(e) =>
                                                            setEditedOutlet((prev) =>
                                                                prev ? { ...prev, outlet_type: e.target.value } : null
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    outlet.outlet_type
                                                )}
                                            </td>
                                            <td>
                                                {isOutletEditing && selectedOutlet?.outlet_id === outlet.outlet_id ? (
                                                    <input
                                                        type="text"
                                                        value={editedOutlet?.outlet_address || ''}
                                                        onChange={(e) =>
                                                            setEditedOutlet((prev) =>
                                                                prev
                                                                    ? { ...prev, outlet_address: e.target.value }
                                                                    : null
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    outlet.outlet_address
                                                )}
                                            </td>
                                            <td>
                                                {isOutletEditing && selectedOutlet?.outlet_id === outlet.outlet_id ? (
                                                    <input
                                                        type="text"
                                                        value={editedOutlet?.outlet_gst_no || ''}
                                                        onChange={(e) =>
                                                            setEditedOutlet((prev) =>
                                                                prev ? { ...prev, outlet_gst_no: e.target.value } : null
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    outlet.outlet_gst_no
                                                )}
                                            </td>
                                            <td>
                                                {isOutletEditing && selectedOutlet?.outlet_id === outlet.outlet_id ? (
                                                    <Form.Select
                                                        value={editedOutlet?.language_id || ''}
                                                        onChange={(e) =>
                                                            setEditedOutlet((prev) =>
                                                                prev ? { ...prev, language_id: e.target.value } : null
                                                            )
                                                        }>
                                                        <option value="">Select Language</option>
                                                        {languages.map((language) => (
                                                            <option key={language.id} value={language.id}>
                                                                {language.name}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                ) : (
                                                    // Check if language is found, fallback to 'N/A'
                                                    languages.find((lang) => lang.id === outlet.language_id)?.name ||
                                                    'N/A'
                                                )}
                                            </td>

                                            {/* <td>
                                                {isEditing && selectedOutlet?.outlet_id === outlet.outlet_id ? (
                                                    <input
                                                        type="text"
                                                        value={editedOutlet?.currency || ''}
                                                        onChange={(e) =>
                                                            setEditedOutlet((prev) =>
                                                                prev ? { ...prev, currency: e.target.value } : null
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    outlet.currency
                                                )}
                                            </td> */}
                                            <td>
                                                {isOutletEditing && selectedOutlet?.outlet_id === outlet.outlet_id ? (
                                                    // Show currency value as plain text when editing
                                                    <span>{outlet.currency}</span>
                                                ) : (
                                                    // Display currency in view mode
                                                    outlet.currency
                                                )}
                                            </td>

                                            <td>
                                                <FaHamburger
                                                    onClick={() =>
                                                        handleOutletMenu(selectedBusiness.business_id, outlet.outlet_id)
                                                    }
                                                    size={20}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </td>

                                            {/* <td>
                                                {isOutletEditing && selectedOutlet?.outlet_id === outlet.outlet_id ? (
                                                    // Show the "Is Active" status as plain text (non-editable)
                                                    <span>{outlet.is_active}</span>
                                                ) : (
                                                    <Form.Check type="switch" />
                                                )}
                                            </td> */}
                                            <td>
                                                <ToggleSwitch
                                                    checked={toggleStates[outlet.outlet_id] ?? outlet.is_active}
                                                    onChange={(checked) =>
                                                        handleOutletUpdateToggle(outlet.outlet_id, checked)
                                                    }
                                                />
                                            </td>
                                            <td className="d-flex align-items-center">
                                                {isOutletEditing && selectedOutlet?.outlet_id === outlet.outlet_id ? (
                                                    <>
                                                        <Button
                                                            variant="success"
                                                            style={{ padding: '5px 10px', fontSize: '14px' }}
                                                            onClick={handleSaveOutletChanges}>
                                                            Save
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            style={{
                                                                padding: '5px 10px',
                                                                marginLeft: '5px',
                                                                fontSize: '14px',
                                                            }}
                                                            onClick={handleCancelOutletEdit}>
                                                            Cancel
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaRegEdit
                                                            size={20}
                                                            style={{ cursor: 'pointer', marginRight: '10px' }}
                                                            onClick={() =>
                                                                handleEditOutletClick(
                                                                    outlet.outlet_id,
                                                                    outlet.outlet_name,
                                                                    outlet.outlet_type,
                                                                    outlet.outlet_address,
                                                                    outlet.outlet_gst_no,
                                                                    selectedBusiness.business_id,
                                                                    outlet.language_id
                                                                )
                                                            }
                                                        />
                                                        <FaTrash
                                                            size={20}
                                                            style={{ cursor: 'pointer', color: 'red' }}
                                                            onClick={() =>
                                                                handleDeleteOutlet(
                                                                    outlet.outlet_id,
                                                                    selectedBusiness.business_id
                                                                )
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7}>No outlets found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            <Card>
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="header-title">{selectedBusiness.business_name} - Business Owners:</h4>
                        <Button onClick={handleRegisterNewBusinessUser}>Register New Business Owner</Button>
                        <RegisterBusinessUserModal
                            show={showBusinessUserModal}
                            onClose={handleCloseBusinessUserModal}
                            businessId={selectedBusiness.business_id}
                        />
                    </div>
                    <div className="table-responsive">
                        <Table className="mb-0">
                            <thead>
                                <tr>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Address</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedBusiness.business_users.length > 0 ? (
                                    selectedBusiness.business_users.map((business_users: BusinessUser) => (
                                        <tr key={business_users.user_id}>
                                            {/* {console.log('user_id >>>>>>>>>>>', business_users.user_id)} */}
                                            <td>
                                                {isBusinessUserEditing &&
                                                selectedBusinessUser?.user_id === business_users.user_id ? (
                                                    <input
                                                        type="text"
                                                        value={editedBusinessUser?.first_name || ''}
                                                        onChange={(e) =>
                                                            setEditedBusinessUser((prev) =>
                                                                prev ? { ...prev, first_name: e.target.value } : null
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    business_users.first_name
                                                )}
                                            </td>
                                            <td>
                                                {isBusinessUserEditing &&
                                                selectedBusinessUser?.user_id === business_users.user_id ? (
                                                    <input
                                                        type="text"
                                                        value={editedBusinessUser?.last_name || ''}
                                                        onChange={(e) =>
                                                            setEditedBusinessUser((prev) =>
                                                                prev ? { ...prev, last_name: e.target.value } : null
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    business_users.last_name
                                                )}
                                            </td>
                                            <td>
                                                {isBusinessUserEditing &&
                                                selectedBusinessUser?.user_id === business_users.user_id ? (
                                                    <input
                                                        type="text"
                                                        value={editedBusinessUser?.email || ''}
                                                        onChange={(e) =>
                                                            setEditedBusinessUser((prev) =>
                                                                prev ? { ...prev, email: e.target.value } : null
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    business_users.email
                                                )}
                                            </td>
                                            <td>
                                                {isBusinessUserEditing &&
                                                selectedBusinessUser?.user_id === business_users.user_id ? (
                                                    <input
                                                        type="text"
                                                        value={editedBusinessUser?.phone_number || ''}
                                                        onChange={(e) =>
                                                            setEditedBusinessUser((prev) =>
                                                                prev ? { ...prev, phone_number: e.target.value } : null
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    business_users.phone_number
                                                )}
                                            </td>
                                            <td>
                                                {isBusinessUserEditing &&
                                                selectedBusinessUser?.user_id === business_users.user_id ? (
                                                    <input
                                                        type="text"
                                                        value={editedBusinessUser?.address || ''}
                                                        onChange={(e) =>
                                                            setEditedBusinessUser((prev) =>
                                                                prev ? { ...prev, address: e.target.value } : null
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    business_users.address
                                                )}
                                            </td>

                                            <td className="d-flex align-items-center">
                                                {isBusinessUserEditing &&
                                                selectedBusinessUser?.user_id === business_users.user_id ? (
                                                    <>
                                                        <Button
                                                            variant="success"
                                                            style={{ padding: '5px 10px', fontSize: '14px' }}
                                                            onClick={handleSaveBusinessUserChanges}>
                                                            Save
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            style={{
                                                                padding: '5px 10px',
                                                                marginLeft: '5px',
                                                                fontSize: '14px',
                                                            }}
                                                            onClick={handleCancelBusinessUserEdit}>
                                                            Cancel
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaRegEdit
                                                            size={20}
                                                            style={{ cursor: 'pointer', marginRight: '10px' }}
                                                            onClick={() =>
                                                                handleEditBusinessUserClick(
                                                                    business_users.first_name,
                                                                    business_users.last_name,
                                                                    business_users.email,
                                                                    business_users.phone_number,
                                                                    business_users.address,
                                                                    business_users.user_id
                                                                )
                                                            }
                                                        />
                                                        <FaTrash
                                                            size={20}
                                                            style={{ cursor: 'pointer', color: 'red' }}
                                                            onClick={() =>
                                                                handleDeleteBusinessUser(
                                                                    business_users.user_id,
                                                                    selectedBusiness.business_id
                                                                )
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7}>No outlets found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </>
    );
};

export default BusinessDetails;
