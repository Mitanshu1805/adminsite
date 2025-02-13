import React from 'react';

interface Outlet {
    outlet_id: string;
    outlet_name: string;
    price: number;
    sequence_no: number;
    disable_until: string | null;
}

interface OutletPrice {
    outlet_id: string;
    price: number;
}

interface CategoryItem {
    selectedCategoryId: string;
    item_id: string;
    item_names: {
        hindi: string;
        english: string;
        gujarati: string;
    };
    price: number;
    dietary: string;
    available_order_type: string[];
    online_display_name: string;
    description: string;
    gst_type: string;
    category_id: string;
    business_id: string;
    logo_image?: File;
    swiggy_image?: File;
    banner_image?: File;
    is_loose: boolean;
    quantity_type: string;
    quantity_params: string;
    quantity_value: number;
    outlets: Outlet[];
    outlet_prices: { outlet_id: string; price: number }[];
}

interface EditItemStep3Props {
    handleSubmit: (e: React.FormEvent) => void;
    editItem: CategoryItem | null;
    setEditItem: React.Dispatch<React.SetStateAction<CategoryItem | null>>;
    message: string;
}

const EditItemStep3: React.FC<EditItemStep3Props> = ({ editItem, setEditItem, handleSubmit, message }) => {
    if (!editItem) {
        return <p>Loading...</p>;
    }

    // ✅ Ensure selectedOutlets is properly defined
    const selectedOutlets = editItem.outlets || [];

    // ✅ Define handlePriceChange
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, outletId: string) => {
        const newPrice = parseFloat(e.target.value);
        setEditItem((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                outlet_prices: prev.outlet_prices.map((priceEntry) =>
                    priceEntry.outlet_id === outletId ? { ...priceEntry, price: newPrice } : priceEntry
                ),
            };
        });
    };

    return (
        <div className="step3-container">
            <h2 className="title">Outlet List</h2>
            {selectedOutlets.length > 0 ? (
                selectedOutlets.map((outlet) => {
                    const price =
                        editItem.outlet_prices?.find((priceEntry) => priceEntry.outlet_id === outlet.outlet_id)
                            ?.price || '';

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

export default EditItemStep3;
