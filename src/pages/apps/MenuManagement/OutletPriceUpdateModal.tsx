import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

type OutletPriceUpdateModalProps = {
    show: boolean;
    outletId: string;
    itemId: string;
    price: number | '';
    onClose: () => void;
    onChange: (value: number | '') => void;
    onSave: () => void;
    previousPrice?: number; // optional, but recommended to pass
};

const OutletPriceUpdateModal: React.FC<OutletPriceUpdateModalProps> = ({
    show,
    itemId,
    outletId,
    price,
    onClose,
    onChange,
    onSave,
    previousPrice,
}) => {
    return (
        <Modal show={show} onHide={onClose} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Update Outlet Price</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    {/* {previousPrice !== undefined && (
                        <Form.Text className="text-muted mb-2">
                            Previous Price: <strong>₹{previousPrice}</strong>
                        </Form.Text>
                    )} */}

                    <Form.Group controlId="priceInput">
                        <Form.Label>New Price</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter new price"
                            // value={price}
                            value={price === '' ? previousPrice : price}
                            onChange={(e) => {
                                const val = e.target.value;
                                onChange(val === '' ? '' : Number(val));
                            }}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="success" onClick={onSave} disabled={price === ''}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OutletPriceUpdateModal;
