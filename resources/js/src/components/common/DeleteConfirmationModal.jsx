import React from "react";
import Modal from "@/src/components/common/Modal.jsx";
import {Button} from "@/components/ui/button";
import {useTranslation} from "react-i18next";

const DeleteConfirmationModal = ({
                                     showModal,
                                     entityName = "Item",
                                     entityId,
                                     onConfirm,
                                     onCancel,
                                 }) => {
    const {t} = useTranslation();
    return (
        <Modal isOpen={showModal} onClose={onCancel}>
            <h2 className="text-lg font-semibold mb-4">{t('deleteModal.title')}</h2>
            <p className="text-sm text-gray-700 mb-6">
                {t('deleteModal.message', {entity: entityName.toLowerCase(), id: entityId})}
            </p>

            <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={onCancel}>
                    {t('global.cancel')}
                </Button>
                <Button variant="destructive" onClick={onConfirm}>
                    {t('deleteModal.confirm')}
                </Button>
            </div>
        </Modal>
    );
};

export default DeleteConfirmationModal;
