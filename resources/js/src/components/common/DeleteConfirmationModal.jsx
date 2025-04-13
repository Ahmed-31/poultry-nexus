import React from "react";
import Modal from "@/src/components/common/Modal.jsx";
import {Button} from "@/components/ui/button";

const DeleteConfirmationModal = ({
                                     showModal,
                                     entityName = "Item",
                                     entityId,
                                     onConfirm,
                                     onCancel,
                                 }) => {
    return (
        <Modal isOpen={showModal} onClose={onCancel}>
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-sm text-gray-700 mb-6">
                Are you sure you want to delete this {entityName.toLowerCase()} (ID: {entityId})?
                This action cannot be undone.
            </p>

            <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button variant="destructive" onClick={onConfirm}>
                    Delete
                </Button>
            </div>
        </Modal>
    );
};

export default DeleteConfirmationModal;
