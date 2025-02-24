// import React, { useEffect, useState } from 'react';
// import { useParams, useLocation } from 'react-router-dom';
// import { useRedux } from '../../../hooks';
// import { RootState } from '../../../redux/store';
// import { businessList } from '../../../redux/business/actions';
// import './ManageMenu.css';
// import { categoryItemList } from '../../../redux/actions';

// interface Outlet {
//     outlet_id: string;
//     outlet_name: string;
//     price: number;
// }

// interface Business {
//     business_id: string;
//     business_name: string;
//     // outlets: Outlet[];
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

// interface EditItemStep2Props {
//     selectedOutlets: Outlet[];
//     setSelectedOutlets: React.Dispatch<React.SetStateAction<Outlet[]>>;
// }

// const EditItemStep2: React.FC<EditItemStep2Props> = ({ selectedOutlets, setSelectedOutlets }) => {
//     const location = useLocation();
//     const business_id = location.state?.business_id;
//     const item_id = location.state?.item_id;
//     const category_id = location.state?.category_id;
//     const { dispatch, appSelector } = useRedux();
//     // const [selectedOutlets, setSelectedOutlets] = useState<Outlet[]>([]);
//     const businesses = appSelector((state: RootState) => state.business.businesses || []);
//     const [allOutlets, setAllOutlets] = useState<Outlet[]>([]);

//     const categories = appSelector((state: RootState) => state.category.categories || []);

//     console.log('Business ID: ', business_id);
//     console.log('Category ID: ', category_id);
//     console.log('Item ID: ', item_id);
//     // useEffect(() => {
//     //     dispatch(businessList()); // Fetch all businesses with their outlets
//     // }, [dispatch]);
//     useEffect(() => {
//         if (business_id) {
//             dispatch(categoryItemList(business_id));
//             dispatch(businessList());
//         }
//     }, [dispatch, business_id]);

//     useEffect(() => {
//         const business = businesses.find((biz: Business) => biz.business_id === business_id);
//         if (business) {
//             setAllOutlets(business.outlets);
//         }
//     }, [businesses, business_id]);

//     // Find the matching category
//     const category = categories.find((cat: Category) => cat.category_id === category_id);

//     // Find the matching item inside the category
//     const item = category?.items?.find((itm: Item) => itm.item_id === item_id);

//     useEffect(() => {
//         if (item) {
//             // Preselect outlets that are part of item.outlets from allOutlets
//             const preselectedOutlets = allOutlets.filter((outlet) =>
//                 item.outlets.some((itemOutlet: Outlet) => itemOutlet.outlet_id === outlet.outlet_id)
//             );
//             setSelectedOutlets(preselectedOutlets); // Set the selected outlets
//         }
//     }, [item, allOutlets]); // Trigger this effect when item or allOutlets change

//     const toggleOutletSelection = (outlet: Outlet) => {
//         setSelectedOutlets((prevSelected) =>
//             prevSelected.some((o) => o.outlet_id === outlet.outlet_id)
//                 ? prevSelected.filter((o) => o.outlet_id !== outlet.outlet_id)
//                 : [...prevSelected, outlet]
//         );
//     };

//     return (
//         <div>
//             <h3 className="title">Select Outlets</h3>
//             {allOutlets.length > 0 ? (
//                 <div className="outlet-list">
//                     {allOutlets.map((outlet: Outlet) => (
//                         <div
//                             key={outlet.outlet_id}
//                             className={`outlet-item ${
//                                 selectedOutlets.some((o) => o.outlet_id === outlet.outlet_id) ? 'selected' : ''
//                             }`}
//                             onClick={() => toggleOutletSelection(outlet)}>
//                             <input
//                                 type="checkbox"
//                                 checked={selectedOutlets.some((o) => o.outlet_id === outlet.outlet_id)}
//                                 className="checkbox"
//                             />
//                             <span className="outlet-name">{outlet.outlet_name}</span>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <p>No outlets available for this business.</p>
//             )}
//         </div>
//     );
// };

// export default EditItemStep2;

// ok done, now i dont want this, this is just my approach, i want to show the total outlet lists of the particular business and then from that list, i want to preselect the outlets which we have accessed above .

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useRedux } from '../../../hooks';
import { RootState } from '../../../redux/store';
import { businessList } from '../../../redux/business/actions';
import { categoryItemList } from '../../../redux/menuManagementCategory/actions'; // Ensure correct import
import './ManageMenu.css';

interface Outlet {
    outlet_id: string;
    outlet_name: string;
    price: number;
}

interface Business {
    business_id: string;
    business_name: string;
    outlets: Outlet[];
}

interface Item {
    item_id: string;
    item_name: string;
    outlets: Outlet[];
}

interface Category {
    category_id: string;
    category_name: string;
    items: Item[];
    outlets: string[]; // Array of outlet IDs belonging to this category
}

interface EditItemStep2Props {
    selectedOutlets: Outlet[];
    setSelectedOutlets: React.Dispatch<React.SetStateAction<Outlet[]>>;
}

const EditItemStep2: React.FC<EditItemStep2Props> = ({ selectedOutlets, setSelectedOutlets }) => {
    const location = useLocation();
    const business_id = location.state?.business_id;
    const category_id = location.state?.category_id;
    const item_id = location.state?.item_id;
    const { dispatch, appSelector } = useRedux();

    // Fetch businesses and categories from Redux
    const businesses = appSelector((state: RootState) => state.business.businesses || []);
    const categories = appSelector((state: RootState) => state.category.categories || []);

    // Find business and category from Redux state
    const business = businesses.find((biz: Business) => biz.business_id === business_id);
    const category = categories.find((cat: Category) => cat.category_id === category_id);
    const item = category?.items.find((itm: Item) => itm.item_id === item_id);

    // Fetch data if not available
    useEffect(() => {
        if (!category) {
            dispatch(categoryItemList(business_id, category_id));
        }
        if (!business) {
            dispatch(businessList());
        }
    }, [dispatch, business, category, business_id, category_id]);

    // Filter only category-specific outlets from business outlets
    const categoryOutlets =
        business?.outlets.filter((outlet: Outlet) => category?.outlets.includes(outlet.outlet_id)) || [];

    // Set preselected outlets from item
    useEffect(() => {
        if (item) {
            const preselectedOutlets = categoryOutlets.filter((outlet: Outlet) =>
                item.outlets.some((itemOutlet: Outlet) => itemOutlet.outlet_id === outlet.outlet_id)
            );
            setSelectedOutlets(preselectedOutlets);
        }
    }, [item, categoryOutlets]);

    const toggleOutletSelection = (outlet: Outlet) => {
        setSelectedOutlets((prevSelected) =>
            prevSelected.some((o) => o.outlet_id === outlet.outlet_id)
                ? prevSelected.filter((o) => o.outlet_id !== outlet.outlet_id)
                : [...prevSelected, outlet]
        );
    };

    return (
        <div>
            <h3 className="title">Select Outlets</h3>
            {categoryOutlets.length > 0 ? (
                <div className="outlet-list">
                    {categoryOutlets.map((outlet: Outlet) => (
                        <div
                            key={outlet.outlet_id}
                            className={`outlet-item ${
                                selectedOutlets.some((o) => o.outlet_id === outlet.outlet_id) ? 'selected' : ''
                            }`}
                            onClick={() => toggleOutletSelection(outlet)}>
                            <input
                                type="checkbox"
                                checked={selectedOutlets.some((o) => o.outlet_id === outlet.outlet_id)}
                                className="checkbox"
                                readOnly
                            />
                            <span className="outlet-name">{outlet.outlet_name}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No outlets available for this Category.</p>
            )}
        </div>
    );
};

export default EditItemStep2;
