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
    // business_id: string;
    // setSelectedOutlets: (outlets: string[]) => void;
}

const RegisterItemStep2: React.FC<RegisterItemStep2Props> = () => {
    const { business_id } = useParams<{ business_id: string }>();
    const [outlets, setOutlets] = useState<Outlet[]>([]);
    const { dispatch, appSelector } = useRedux();
    const businesses = appSelector((state: RootState) => state.business.businesses || []);
    const [selectedOutlets, setSelectedOutlets] = useState<string[]>([]);

    useEffect(() => {
        console.log('Calling businessList API...');
        dispatch(businessList());
    }, [dispatch]);

    const business = businesses.find((biz: Business) => biz.business_id === business_id);
    console.log('This is Business', business);

    const toggleOutletSelection = (outletId: string) => {
        setSelectedOutlets((prev) =>
            prev.includes(outletId) ? prev.filter((id) => id !== outletId) : [...prev, outletId]
        );
    };

    const selectAllOutlets = () => {
        if (business) {
            setSelectedOutlets(business.outlets.map((outlet: Outlet) => outlet.outlet_id));
        }
    };
    // if (business_id) {
    //     const business = businesses.find((business: Business) => business.business_id === business_id);

    //     if (business) {
    //         console.log('Business Found: ', business);
    //         console.log('Outlets: ', business.outlets);
    //     }
    // }

    // const businesses: Business[] = appSelector((state) => state.Business.businessList);
    // console.log('Businesses from Redux:', businesses);

    // useEffect(() => {
    //     console.log('Received business_id:', business_id);
    //     if (businesses.length > 0) {
    //         console.log('Filtering business for ID:', business_id);
    //         const selectedBusiness = businesses.find((b) => b.business_id === business_id);

    //         if (selectedBusiness) {
    //             console.log('Found matching business:', selectedBusiness);
    //             setOutlets(selectedBusiness.outlets);
    //         } else {
    //             console.log('No matching business found.');
    //             setOutlets([]);
    //         }
    //     }
    // }, [business_id, businesses]);

    // const handleOutletChange = (outletId: string) => {
    //     setLocalSelectedOutlets((prevSelected) => {
    //         const updatedSelection = prevSelected.includes(outletId)
    //             ? prevSelected.filter((id) => id !== outletId)
    //             : [...prevSelected, outletId];

    //         setSelectedOutlets(updatedSelection);
    //         return updatedSelection;
    //     });
    // };

    return (
        <div className="bg-cream p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-black">Outlet Name</h3>
                <button
                    onClick={selectAllOutlets}
                    className="bg-red-400 text-white px-4 py-2 rounded-lg font-semibold shadow-md">
                    Active All
                </button>
            </div>

            {business ? (
                business.outlets.length > 0 ? (
                    <div className="space-y-4">
                        {business.outlets.map((outlet: Outlet) => (
                            <div
                                key={outlet.outlet_id}
                                className="flex items-center bg-white p-4 rounded-lg shadow-sm cursor-pointer"
                                onClick={() => toggleOutletSelection(outlet.outlet_id)}>
                                <input
                                    type="checkbox"
                                    checked={selectedOutlets.includes(outlet.outlet_id)}
                                    readOnly
                                    className="w-6 h-6 mr-4"
                                />
                                <span className="text-lg text-black font-medium">{outlet.outlet_name}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No outlets available for this business.</p>
                )
            ) : (
                <p className="text-gray-500">Business not found.</p>
            )}
        </div>
    );
};

export default RegisterItemStep2;
