import React, { useEffect, useState } from 'react';

interface Outlet {
    outlet_id: string;
    name: string;
    is_active: boolean;
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
    message: string;
}

const EditCategoryStep2: React.FC<EditCategoryStep2Props> = ({ editCategory, setEditCategory }) => {
    const [selectedOutlets, setSelectedOutlets] = useState<Outlet[]>([]);

    // Initialize selected outlets based on editCategory's outlets
    useEffect(() => {
        if (editCategory?.outlets) {
            setSelectedOutlets(editCategory.outlets.filter((outlet) => outlet.is_active));
        }
    }, [editCategory]);

    const handleOutletChange = (outlet_id: string) => {
        const updatedSelectedOutlets = [...selectedOutlets];
        const outletIndex = updatedSelectedOutlets.findIndex((outlet) => outlet.outlet_id === outlet_id);

        // Toggle active status of the outlet
        if (outletIndex > -1) {
            updatedSelectedOutlets.splice(outletIndex, 1);
        } else {
            const outletToAdd = editCategory?.outlets?.find((outlet) => outlet.outlet_id === outlet_id);
            if (outletToAdd) {
                updatedSelectedOutlets.push(outletToAdd);
            }
        }

        setSelectedOutlets(updatedSelectedOutlets);

        // Update the editCategory's outlets state as well
        if (editCategory) {
            setEditCategory({
                ...editCategory,
                outlets: editCategory.outlets?.map((outlet) =>
                    updatedSelectedOutlets.find((selected) => selected.outlet_id === outlet.outlet_id)
                        ? { ...outlet, is_active: true }
                        : { ...outlet, is_active: false }
                ),
            });
        }
    };
    return (
        <div>
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
        </div>
    );
};

export default EditCategoryStep2;
