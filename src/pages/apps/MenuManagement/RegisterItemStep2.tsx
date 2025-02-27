import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Card, Row, Col, Alert } from 'react-bootstrap';
import { useRedux } from '../../../hooks';
import { useLocation } from 'react-router-dom';
import { RootState } from '../../../redux/store';
import { businessList } from '../../../redux/business/actions';
import { categoryItemList } from '../../../redux/menuManagementCategory/actions';
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

interface Category {
    category_id: string;
    category_name: string;
    outlets: string[]; // Array of outlet IDs
}

interface RegisterItemStep2Props {
    selectedOutlets: Outlet[];
    setSelectedOutlets: React.Dispatch<React.SetStateAction<Outlet[]>>;
}

const RegisterItemStep2: React.FC<RegisterItemStep2Props> = ({ selectedOutlets, setSelectedOutlets }) => {
    const location = useLocation();
    const business_id = location.state?.business_id;
    const category_id = location.state?.category_id;
    const { dispatch, appSelector } = useRedux();
    const [isChecked, setIsChecked] = useState(true);

    // Fetch businesses and categories from Redux
    const businesses = appSelector((state: RootState) => state.business.businesses || []);
    const categories = appSelector((state: RootState) => state.category.categories || []);

    // Find the business and category from the Redux state
    const business = businesses.find((biz: Business) => biz.business_id === business_id);
    const category = categories.find((cat: Category) => cat.category_id === category_id);

    useEffect(() => {
        if (!business) {
            dispatch(businessList());
        }
        if (!category) {
            dispatch(categoryItemList(business_id, category_id));
        }
    }, [dispatch, business, category, business_id, category_id]);

    useEffect(() => {
        console.log('Business Response:', business);
        console.log('Category Response:', category);
    }, [business, category]);

    // Ensure data exists before rendering
    if (!business || !category) {
        return <p className="loading">Loading data...</p>;
    }

    // Filter business outlets based on category outlet IDs
    const filteredOutlets = business.outlets.filter((outlet: Outlet) => category.outlets.includes(outlet.outlet_id));

    const toggleOutletSelection = (outlet: Outlet) => {
        setSelectedOutlets((prev) => {
            const isSelected = prev.some((o) => o.outlet_id === outlet.outlet_id);
            return isSelected ? prev.filter((o) => o.outlet_id !== outlet.outlet_id) : [...prev, outlet];
        });
    };

    const selectAllOutlets = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setSelectedOutlets(filteredOutlets);
    };

    // return (
    //     <div className="step2-container">
    //         <div className="header">
    //             <h3 className="title">Master Outlet</h3>
    //             {/* <button onClick={selectAllOutlets} className="active-all-btn">
    //                 Select All
    //             </button> */}
    //         </div>
    //         <div className="outlet-item">
    //             <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(true)} className="checkbox" />
    //             <span className="outlet-name">Master Outlet</span>
    //         </div>

    //         <div className="header">
    //             <h3 className="title">Outlet Name</h3>
    //             <button onClick={selectAllOutlets} className="active-all-btn">
    //                 Select All
    //             </button>
    //         </div>

    //         {filteredOutlets.length > 0 ? (
    //             <div className="outlet-list">
    //                 {filteredOutlets.map((outlet: Outlet) => (
    //                     <div
    //                         key={outlet.outlet_id}
    //                         className="outlet-item"
    //                         onClick={() => toggleOutletSelection(outlet)}>
    //                         <input
    //                             type="checkbox"
    //                             checked={selectedOutlets.some((o) => o.outlet_id === outlet.outlet_id)}
    //                             readOnly
    //                             className="checkbox"
    //                         />
    //                         <span className="outlet-name">{outlet.outlet_name}</span>
    //                     </div>
    //                 ))}
    //             </div>
    //         ) : (
    //             <p className="no-outlets">No outlets available for this Category.</p>
    //         )}
    //     </div>
    // );
    return (
        <Container className="register-item-container">
            <Card className="shadow-sm">
                <Card.Header as="h2" className="text-center">
                    Select Outlets
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Master Outlet</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => setIsChecked(true)}
                                    label="Master"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Label>Outlet Name</Form.Label>
                            <button onClick={selectAllOutlets} className="btn btn-primary btn-sm ms-2">
                                Select All
                            </button>
                        </Col>
                    </Row>

                    {filteredOutlets.length > 0 ? (
                        <Row>
                            {filteredOutlets.map((outlet: Outlet) => (
                                <Col md={4} key={outlet.outlet_id} className="mb-2">
                                    <Form.Check
                                        type="checkbox"
                                        label={outlet.outlet_name}
                                        checked={selectedOutlets.some((o) => o.outlet_id === outlet.outlet_id)}
                                        onChange={() => toggleOutletSelection(outlet)}
                                    />
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <p className="text-muted text-center">No outlets available for this Category.</p>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default RegisterItemStep2;

// import React, { useState, useEffect } from 'react';
// import { useRedux } from '../../../hooks';
// import { useParams, useLocation } from 'react-router-dom';
// import { RootState } from '../../../redux/store';
// import { businessList } from '../../../redux/business/actions';
// import { categoryItemList } from '../../../redux/menuManagementCategory/actions';
// import './ManageMenu'; // Importing CSS

// interface Outlet {
//     outlet_id: string;
//     outlet_name: string;
// }
// interface Business {
//     business_id: string;
//     business_name: string;
//     outlets: Outlet[];
// }

// interface Item {
//     item_id: string;
//     item_name: string;
//     // outlets: Outlet[];
// }

// interface Category {
//     category_id: string;
//     category_name: string;
//     items: Item[];
// }

// interface RegisterItemStep2Props {
//     selectedOutlets: Outlet[];
//     setSelectedOutlets: React.Dispatch<React.SetStateAction<Outlet[]>>;
// }

// const RegisterItemStep2: React.FC<RegisterItemStep2Props> = ({ selectedOutlets, setSelectedOutlets }) => {
//     // const { business_id } = useParams<{ business_id: string }>();
//     const location = useLocation();
//     const business_id = location.state?.business_id;
//     const category_id = location.state?.category_id;
//     const { dispatch, appSelector } = useRedux();
//     const businesses = appSelector((state: RootState) => state.business.businesses || []);
//     const categories = appSelector((state: RootState) => state.category.categories || []);

//     useEffect(() => {
//         const response = dispatch(businessList());
//         const categoryResponse = dispatch(categoryItemList(business_id, category_id));

//         // console.log('Business Response: ', response);
//         // console.log('Category Response: ', categoryResponse);
//     }, [dispatch]);

//     const business = businesses.find((biz: Business) => biz.business_id === business_id);
//     console.log('Business Response: ', business);
//     const category = categories.find((cat: Category) => cat.category_id === category_id);
//     console.log('Category Response: ', category);

//     const toggleOutletSelection = (outlet: Outlet) => {
//         setSelectedOutlets((prev: Outlet[]) => {
//             const isSelected = prev.some((o) => o.outlet_id === outlet.outlet_id);
//             return isSelected ? prev.filter((o) => o.outlet_id !== outlet.outlet_id) : [...prev, outlet];
//         });
//     };

//     const selectAllOutlets = (event: React.MouseEvent<HTMLButtonElement>) => {
//         event.preventDefault();
//         if (business) {
//             setSelectedOutlets(business.outlets);
//         }
//     };

//     return (
//         <div className="step2-container">
//             <div className="header">
//                 <h3 className="title">Outlet Name</h3>
//                 <button onClick={selectAllOutlets} className="active-all-btn">
//                     Select All
//                 </button>
//             </div>

//             {business && category ? (
//                 category.outlets.length > 0 ? (
//                     <div className="outlet-list">
//                         {business.outlets
//                             .filter((outlet: Outlet) => category.outlets.includes(outlet.outlet_id)) // Filtering relevant outlets
//                             .map((outlet: Outlet) => (
//                                 <div
//                                     key={outlet.outlet_id}
//                                     className="outlet-item"
//                                     onClick={() => toggleOutletSelection(outlet)}>
//                                     <input
//                                         type="checkbox"
//                                         checked={selectedOutlets.some((o) => o.outlet_id === outlet.outlet_id)}
//                                         readOnly
//                                         className="checkbox"
//                                     />
//                                     <span className="outlet-name">{outlet.outlet_name}</span>
//                                 </div>
//                             ))}
//                     </div>
//                 ) : (
//                     <p className="no-outlets">No outlets available for this Category.</p>
//                 )
//             ) : (
//                 <p className="no-outlets">Category not found.</p>
//             )}
//         </div>
//     );
// };

// export default RegisterItemStep2;
