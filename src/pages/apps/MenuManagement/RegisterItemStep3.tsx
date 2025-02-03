import React from 'react';

interface RegisterItemStepThreeProps {
    selectedOutlets: string[];
}

const RegisterItemStepThree: React.FC<RegisterItemStepThreeProps> = ({ selectedOutlets }) => {
    return (
        <div>
            <h2>Selected Outlets</h2>
            {selectedOutlets.length > 0 ? (
                <ul>
                    {selectedOutlets.map((outletId) => (
                        <li key={outletId}>{outletId}</li>
                    ))}
                </ul>
            ) : (
                <p>No outlets selected</p>
            )}
        </div>
    );
};

export default RegisterItemStepThree;
