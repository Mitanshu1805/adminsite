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

import React, { useState, useEffect } from 'react';
import { useRedux } from '../../../hooks';
import { businessList } from '../../../redux/business/actions';

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
    business_id: string;
    setSelectedOutlets: (outlets: string[]) => void;
}

const RegisterItemStep2: React.FC<RegisterItemStep2Props> = ({ business_id, setSelectedOutlets }) => {
    const [outlets, setOutlets] = useState<Outlet[]>([]);
    const [selectedOutlets, setLocalSelectedOutlets] = useState<string[]>([]);
    const { dispatch, appSelector } = useRedux();

    useEffect(() => {
        console.log("Calling businessList API...");
        dispatch(businessList());
    }, [dispatch]);

    const businesses: Business[] = appSelector(state => state.Business.businessList);
    console.log("Businesses from Redux:", businesses);

    useEffect(() => {
        console.log("Received business_id:", business_id);
        if (businesses.length > 0) {
            console.log("Filtering business for ID:", business_id);
            const selectedBusiness = businesses.find(b => b.business_id === business_id);

            if (selectedBusiness) {
                console.log("Found matching business:", selectedBusiness);
                setOutlets(selectedBusiness.outlets);
            } else {
                console.log("No matching business found.");
                setOutlets([]);
            }
        }
    }, [business_id, businesses]);

    const handleOutletChange = (outletId: string) => {
        setLocalSelectedOutlets(prevSelected => {
            const updatedSelection = prevSelected.includes(outletId)
                ? prevSelected.filter(id => id !== outletId)
                : [...prevSelected, outletId];

            setSelectedOutlets(updatedSelection);
            return updatedSelection;
        });
    };

    console.log("Outlets to display:", outlets);

    return (
        <div>
            <h3>Select Outlets</h3>
            {outlets.length === 0 ? (
                <p>No outlets available.</p>
            ) : (
                outlets.map(outlet => (
                    <div key={outlet.outlet_id}>
                        <input
                            type="checkbox"
                            value={outlet.outlet_id}
                            checked={selectedOutlets.includes(outlet.outlet_id)}
                            onChange={() => handleOutletChange(outlet.outlet_id)}
                        />
                        <label>{outlet.outlet_name}</label>
                    </div>
                ))
            )}
        </div>
    );
};

export default RegisterItemStep2;

