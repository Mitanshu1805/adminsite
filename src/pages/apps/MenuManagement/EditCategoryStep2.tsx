import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useRedux } from '../../../hooks';
import { RootState } from '../../../redux/store';
import { businessList } from '../../../redux/business/actions';
import './ManageMenu.css';
import { categoryItemList } from '../../../redux/actions';

interface Outlet {
    outlet_id: string;
    outlet_name: string;
    is_active: boolean;
}

interface Category {
    category_id: string;
    category_name: string;
    // items: Item[];
}

interface Business {
    business_id: string;
    business_name: string;
    outlets: Outlet[];
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
    outlets?: Outlet[]; // ✅ Add this property
}

interface EditCategoryStep2Props {
    handleSubmit: (e: React.FormEvent) => void;
    editCategory: UpdateCategory | null;
    setEditCategory: React.Dispatch<React.SetStateAction<UpdateCategory | null>>;
    selectedOutlets: string[]; // ✅ Accept selectedOutlets
    setSelectedOutlets: React.Dispatch<React.SetStateAction<string[]>>; // ✅ Accept setter function
    message: string;
}

const EditCategoryStep2: React.FC<EditCategoryStep2Props> = ({
    editCategory,
    setEditCategory,
    selectedOutlets,
    setSelectedOutlets,
}) => {
    // const [selectedOutlets, setSelectedOutlets] = useState<Outlet[]>([]);
    // const { business_id, selectedCategoryId, item_id } =
    //     useParams<{ business_id: string; selectedCategoryId: string; item_id: string }>();
    const location = useLocation();
    const business_id = location.state?.business_id;
    const selectedCategoryId = location.state?.category_id;
    const { dispatch, appSelector } = useRedux();
    // const [selectedOutlets, setSelectedOutlets] = useState<Outlet[]>([]);
    const businesses = appSelector((state: RootState) => state.business.businesses || []);
    const [allOutlets, setAllOutlets] = useState<Outlet[]>([]);

    const categories = appSelector((state: RootState) => state.category.categories || []);

    // console.log('Business ID: ', business_id);
    // console.log('Category ID: ', selectedCategoryId);

    useEffect(() => {
        if (business_id) {
            dispatch(categoryItemList(business_id));
            dispatch(businessList());
        }
    }, [dispatch, business_id]);

    useEffect(() => {
        const business = businesses.find((biz: Business) => biz.business_id === business_id);
        if (business) {
            setAllOutlets(business.outlets);
        }
    }, [businesses, business_id]);

    const category = categories.find((cat: Category) => cat.category_id === selectedCategoryId);

    useEffect(() => {
        if (category && allOutlets.length > 0) {
            console.log('Category outlets:', category.outlets); // Debugging
            console.log('All outlets:', allOutlets); // Debugging

            const preselectedOutlets = allOutlets.filter(
                (outlet: Outlet) => category.outlets.includes(outlet.outlet_id) // ✅ Compare IDs directly
            );

            console.log('Preselected outlets:', preselectedOutlets); // Debugging
            setSelectedOutlets(preselectedOutlets.map((outlet) => outlet.outlet_id));
        }
    }, [category, allOutlets]); // This effect runs when category or allOutlets change

    useEffect(() => {
        if (editCategory?.outlets && editCategory.outlets.length > 0) {
            console.log('Updating from editCategory:', editCategory.outlets);
            setSelectedOutlets(
                editCategory.outlets.filter((outlet) => outlet.is_active).map((outlet) => outlet.outlet_id)
            );
        }
    }, [editCategory]); // ✅ Runs only when editCategory changes

    const toggleOutletSelection = (outletId: any) => {
        setSelectedOutlets(
            (prevSelected) =>
                prevSelected.includes(outletId)
                    ? prevSelected.filter((id: any) => id !== outletId)
                    : [...prevSelected, outletId]

            // ? prevSelected.filter((id: any) => id?.outlet_id === outletId.outlet_id)
            // : []
        );
    };

    return (
        <div>
            <h3 className="title">Select Outlets</h3>
            {allOutlets.length > 0 ? (
                <div className="outlet-list">
                    {allOutlets.map((outlet: Outlet) => (
                        <div
                            key={outlet.outlet_id}
                            className={`outlet-item ${
                                selectedOutlets.filter((o: any) => o?.outlet_id === outlet?.outlet_id) ? 'selected' : ''
                            }`}
                            onClick={() => toggleOutletSelection(outlet.outlet_id)}>
                            <input
                                type="checkbox"
                                checked={selectedOutlets.includes(outlet.outlet_id)}
                                className="checkbox"
                            />
                            <span className="outlet-name">{outlet.outlet_name}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No outlets available for this business.</p>
            )}
        </div>
    );
};

export default EditCategoryStep2;

{
    /* <div>
            <h4>Select Outlets</h4>
            {editCategory?.outlets && editCategory.outlets.length > 0 ? (
                <ul>
                    {editCategory.outlets.map((outlet) => (
                        <li key={outlet.outlet_id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedOutlets.some((sel) => sel.outlet_id === outlet.outlet_id)}
                                    onChange={() => handleOutletChange(outlet.outlet_id)}
                                />
                                {outlet.name}
                            </label>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No outlets available.</p>
            )}
        </div> */
}
