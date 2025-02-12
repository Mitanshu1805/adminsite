import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRedux } from '../../../hooks';
import { RootState } from '../../../redux/store';
import { businessList } from '../../../redux/business/actions';

interface Outlet {
    outlet_id: string;
    outlet_name: string;
    business_id: string;
    is_active: boolean;
}

interface Business {
    business_id: string;
    business_name: string;
    outlets: Outlet[];
}

interface RegisterCategoryTwoProps {
    formData: {
        outlet_id: string[];
    };
    selectedOutlets: string[]; // Expect selectedOutlets as a separate prop
    setSelectedOutlets: React.Dispatch<React.SetStateAction<string[]>>; // Expect setSelectedOutlets as a separate prop
}

const RegisterCategoryStep2: React.FC<RegisterCategoryTwoProps> = ({
    formData,
    setSelectedOutlets,
    selectedOutlets,
}) => {
    const { business_id } = useParams<{ business_id: string }>();
    const { dispatch, appSelector } = useRedux();
    const businesses = appSelector((state: RootState) => state.business.businesses || []);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (business_id) {
            dispatch(businessList());
        }
    }, [dispatch, business_id]);

    useEffect(() => {
        if (businesses.length > 0) {
            setLoading(false);
        }
    }, [businesses]);

    const business = businesses.find((biz: Business) => biz.business_id === business_id);

    const toggleOutletSelection = (outlet: Outlet) => {
        const isSelected = selectedOutlets.includes(outlet.outlet_id); // Use selectedOutlets directly

        setSelectedOutlets((prev: string[]) => {
            const newSelected = isSelected ? prev.filter((id) => id !== outlet.outlet_id) : [...prev, outlet.outlet_id];

            return newSelected;
        });
    };

    const selectAllOutlets = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (business) {
            const allSelected = business.outlets.every(
                (outlet: Outlet) => selectedOutlets.includes(outlet.outlet_id) // Use selectedOutlets directly
            );
            const newSelected = allSelected ? [] : business.outlets.map((outlet: Outlet) => outlet.outlet_id);
            setSelectedOutlets(newSelected);
        }
    };

    return (
        <div className="step2-container">
            <div className="header">
                <h3 className="title">Outlet Name</h3>
                <button onClick={selectAllOutlets} className="active-all-btn">
                    {business && business.outlets.length > 0 && selectedOutlets.length === business.outlets.length
                        ? 'Deselect All'
                        : 'Select All'}
                </button>
            </div>
            {loading ? (
                <p className="loading-text">Loading...</p>
            ) : business ? (
                business.outlets.length > 0 ? (
                    <div className="outlet-list">
                        {business.outlets.map((outlet: Outlet) => (
                            <div
                                key={outlet.outlet_id}
                                className={`outlet-item ${
                                    selectedOutlets.includes(outlet.outlet_id) ? 'selected' : ''
                                }`}
                                onClick={() => toggleOutletSelection(outlet)}>
                                <input
                                    type="checkbox"
                                    checked={selectedOutlets.includes(outlet.outlet_id)}
                                    readOnly
                                    className="checkbox"
                                />
                                <span className="outlet-name">{outlet.outlet_name}</span>
                                <span className={`status ${outlet.is_active ? 'active' : 'inactive'}`}>
                                    {outlet.is_active}
                                </span>
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

export default RegisterCategoryStep2;
