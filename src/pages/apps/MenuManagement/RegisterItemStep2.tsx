// import React, { useState } from 'react';
// import { Card, Row, Col, Button, Alert, Form } from 'react-bootstrap';

// interface Outlet {
//     outlet_id: string;
//     outlet_name: string;
// }

// interface SelectedBusiness {
//     outlets: Outlet[];
// }

// interface RegisterItemStepTwoProps {
//     selectedBusiness: SelectedBusiness;
//     onNext: (selectedOutlets: Outlet[]) => void;
//     errorMsg: string;
//     successMsg: string;
//     handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     handleSubmit: (e: React.FormEvent) => void;
// }

// const RegisterItemStepTwo: React.FC<RegisterItemStepTwoProps> = ({ selectedBusiness, onNext }) => {
//     const [selectedOutlets, setSelectedOutlets] = useState<Outlet[]>([]);

//     const handleOutletChange = (outlet: Outlet) => {
//         setSelectedOutlets((prevSelectedOutlets) => {
//             if (prevSelectedOutlets.some((o) => o.outlet_id === outlet.outlet_id)) {
//                 return prevSelectedOutlets.filter((o) => o.outlet_id !== outlet.outlet_id);
//             } else {
//                 return [...prevSelectedOutlets, outlet];
//             }
//         });
//     };

//     const handleNextClick = () => {
//         onNext(selectedOutlets); // Pass the selected outlets to the parent component
//     };

//     return (
//         <Card>
//             <Card.Body>
//                 <Row>
//                     <Col md={12}>
//                         {selectedBusiness.outlets.length > 0 ? (
//                             selectedBusiness.outlets.map((outlet) => (
//                                 <div key={outlet.outlet_id}>
//                                     <Form.Check
//                                         type="checkbox"
//                                         label={outlet.outlet_name}
//                                         checked={selectedOutlets.some((o) => o.outlet_id === outlet.outlet_id)}
//                                         onChange={() => handleOutletChange(outlet)}
//                                     />
//                                 </div>
//                             ))
//                         ) : (
//                             <Alert variant="info">No outlets found for this business.</Alert>
//                         )}
//                     </Col>
//                 </Row>
//                 <Row className="mt-3">
//                     <Col md={12} className="text-center">
//                         <Button onClick={handleNextClick} variant="primary">
//                             Next
//                         </Button>
//                     </Col>
//                 </Row>
//             </Card.Body>
//         </Card>
//     );
// };

// export default RegisterItemStepTwo;

//Here in this code , from which we can access the selectedOutlets which user selects and can display in the next step of the form ?

import React, { useState, useEffect } from 'react';
import { useRedux } from '../../../hooks';
import { useParams } from 'react-router-dom';
import { RootState } from '../../../redux/store';
import { businessList } from '../../../redux/business/actions';
import './ManageMenu'; // Importing CSS

interface Outlet {
    outlet_id: string;
    outlet_name: string;
}
interface Business {
    business_id: string;
    business_name: string;
    outlets: Outlet[];
}

interface RegisterItemStep2Props {
    selectedOutlets: Outlet[];
    setSelectedOutlets: React.Dispatch<React.SetStateAction<Outlet[]>>;
}

const RegisterItemStep2: React.FC<RegisterItemStep2Props> = ({ selectedOutlets, setSelectedOutlets }) => {
    const { business_id } = useParams<{ business_id: string }>();
    const { dispatch, appSelector } = useRedux();
    const businesses = appSelector((state: RootState) => state.business.businesses || []);

    useEffect(() => {
        const response = dispatch(businessList());
        console.log("Response: ", response)
    }, [dispatch]);

    const business = businesses.find((biz: Business) => biz.business_id === business_id);
    console.log("Response: ", business)


    const toggleOutletSelection = (outlet: Outlet) => {
        setSelectedOutlets((prev: Outlet[]) => {
            const isSelected = prev.some((o) => o.outlet_id === outlet.outlet_id);
            return isSelected ? prev.filter((o) => o.outlet_id !== outlet.outlet_id) : [...prev, outlet];
        });
    };

    const selectAllOutlets = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (business) {
            setSelectedOutlets(business.outlets);
        }
    };

    return (
        <div className="step2-container">
            <div className="header">
                <h3 className="title">Outlet Name</h3>
                <button onClick={selectAllOutlets} className="active-all-btn">
                    Select All
                </button>
            </div>

            {business ? (
                business.outlets.length > 0 ? (
                    <div className="outlet-list">
                        {business.outlets.map((outlet: Outlet) => (
                            <div
                                key={outlet.outlet_id}
                                className="outlet-item"
                                onClick={() => toggleOutletSelection(outlet)}>
                                <input
                                    type="checkbox"
                                    checked={selectedOutlets.some((o) => o.outlet_id === outlet.outlet_id)}
                                    readOnly
                                    className="checkbox"
                                />
                                <span className="outlet-name">{outlet.outlet_name}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-outlets">No outlets available for this business.</p>
                )
            ) : (
                <p className="no-outlets">Business not found.</p>
            )}
        </div>
    );
};

export default RegisterItemStep2;
