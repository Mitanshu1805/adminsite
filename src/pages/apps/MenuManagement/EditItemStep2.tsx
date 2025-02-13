import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRedux } from '../../../hooks';
import { RootState } from '../../../redux/store';
import { businessList } from '../../../redux/business/actions';
import './ManageMenu.css'; // Import styles if needed

interface Outlet {
    outlet_id: string;
    outlet_name: string;
    price: number;
    sequence_no: number;
    disable_until: string | null;
}

interface Business {
    business_id: string;
    business_name: string;
    outlets: Outlet[];
}

interface EditItemStep2Props {
    selectedOutlets: Outlet[]; // Outlets user selected during registration
    setSelectedOutlets: React.Dispatch<React.SetStateAction<Outlet[]>>;
}

const EditItemStep2: React.FC<EditItemStep2Props> = ({ selectedOutlets, setSelectedOutlets }) => {
    const { business_id } = useParams<{ business_id: string }>();
    const { dispatch, appSelector } = useRedux();
    const businesses = appSelector((state: RootState) => state.business.businesses || []);
    const [allOutlets, setAllOutlets] = useState<Outlet[]>([]);

    useEffect(() => {
        dispatch(businessList()); // Fetch all businesses with their outlets
    }, [dispatch]);

    useEffect(() => {
        console.log('Selected outlets in EditItem:', selectedOutlets);
    }, [selectedOutlets]);

    useEffect(() => {
        const business = businesses.find((biz: Business) => biz.business_id === business_id);
        if (business) {
            setAllOutlets(business.outlets); // Store all outlets for the business
        }
    }, [businesses, business_id]);

    const toggleOutletSelection = (outlet: Outlet) => {
        setSelectedOutlets((prev: Outlet[]) => {
            const isSelected = prev.some((o) => o.outlet_id === outlet.outlet_id);
            return isSelected ? prev.filter((o) => o.outlet_id !== outlet.outlet_id) : [...prev, outlet];
        });
    };

    return (
        <div className="step2-container">
            <h3 className="title">Select Outlets</h3>
            {allOutlets.length > 0 ? (
                <div className="outlet-list">
                    {allOutlets.map((outlet: Outlet) => (
                        <div
                            key={outlet.outlet_id}
                            className={`outlet-item ${
                                selectedOutlets.some((o) => o.outlet_id === outlet.outlet_id) ? 'selected' : ''
                            }`}
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
            )}
        </div>
    );
};

export default EditItemStep2;
