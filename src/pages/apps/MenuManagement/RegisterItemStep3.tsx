// RegisterItemStep3.tsx
import React from 'react';
import './ManageMenu';

interface Outlet {
    outlet_id: string;
    outlet_name: string;
}

interface Business {
    business_id: string;
    business_name: string;
    // outlets: Outlet[];
}

interface RegisterItemStep3Props {
    formData: {
        outlet_prices: { outlet_id: string; price: number }[]; // Array of objects with outlet_id and price
    };
    selectedOutlets: Outlet[]; // Outlets that the user has selected
    business: Business | null;
    handlePriceChange: (e: React.ChangeEvent<HTMLInputElement>, outlet_id: string) => void; // Update price based on outlet_id
}

const RegisterItemStep3: React.FC<RegisterItemStep3Props> = ({ selectedOutlets, formData, handlePriceChange }) => {
    return (
        <div className="step3-container">
            <h2 className="title">Outlet List</h2>
            {selectedOutlets.length > 0 ? (
                selectedOutlets.map((outlet) => {
                    const price = formData.outlet_prices.find(
                        (priceEntry) => priceEntry.outlet_id === outlet.outlet_id
                    )?.price;
                    return (
                        <div key={outlet.outlet_id} className="outlet-card">
                            <h3 className="outlet-name">{outlet.outlet_name}</h3>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => handlePriceChange(e, outlet.outlet_id)}
                                placeholder="Enter Item Price"
                                className="price-input"
                            />
                        </div>
                    );
                })
            ) : (
                <p className="no-outlets">No outlets selected.</p>
            )}
        </div>
    );
};

export default RegisterItemStep3;
