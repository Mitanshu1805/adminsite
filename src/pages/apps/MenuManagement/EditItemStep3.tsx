import React from 'react';

interface Outlet {
    outlet_id: string;
    outlet_name: string;
    price: number;
}

interface OutletPrice {
    outlet_id: string;
    price: number;
    outlet_name: string;
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
    outlet_prices: { outlet_id: string; price: number }[]; // This should default to an empty array if undefined
}

interface EditItemStep3Props {
    handleSubmit: (e: React.FormEvent) => void;
    editItem: CategoryItem | null;
    setEditItem: React.Dispatch<React.SetStateAction<CategoryItem | null>>;
    message: string;
    selectedOutlets: Outlet[];
}

const EditItemStep3: React.FC<EditItemStep3Props> = ({
    editItem,
    setEditItem,
    handleSubmit,
    message,
    selectedOutlets,
}) => {
    if (!editItem) {
        return <p>Loading...</p>;
    }

    // Ensure outlet_prices is never undefined
    const outletPrices = editItem.outlet_prices ?? [];

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, outletId: string) => {
        const newPrice = parseFloat(e.target.value);

        if (newPrice < 0 || isNaN(newPrice)) {
            return; // Ignore invalid or negative values
        }

        setEditItem((prev) => {
            if (!prev) return prev;

            const updatedPrices = (prev.outlet_prices ?? []).map((priceEntry) =>
                priceEntry.outlet_id === outletId ? { ...priceEntry, price: newPrice } : priceEntry
            );

            console.log('Updated prices:', updatedPrices); // Debugging the state update

            return {
                ...prev,
                outlet_prices: updatedPrices,
            };
        });
    };

    return (
        <div className="step3-container">
            <h2 className="title">Outlet List</h2>
            {selectedOutlets.length > 0 ? (
                selectedOutlets.map((outlet: OutletPrice) => {
                    const price = outletPrices.find((priceEntry) => priceEntry.outlet_id === outlet.outlet_id)?.price;

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
