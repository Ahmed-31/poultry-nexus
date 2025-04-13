import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import StockFormModal from "@/src/components/Stock/StockFormModal";
import StockSelectorModal from "@/src/components/Stock/StockSelectorModal.jsx";
import StockCountModal from "@/src/components/Stock/StockCountModal.jsx";
import ItemFormModal from "@/src/components/Stock/ItemFormModal.jsx";
import ItemSelectorModal from "@/src/components/Stock/ItemSelectorModal.jsx";
import WarehouseFormModal from "@/src/components/Stock/WarehouseFormModal.jsx";
import WarehouseSelectorModal from "@/src/components/Stock/WarehouseSelectorModal.jsx";

const ActionHandler = ({action}) => {
    const navigate = useNavigate();
    const [activeModal, setActiveModal] = useState(null);

    const handleClick = () => {
        switch (action.type) {
            case "navigate":
                navigate(action.route);
                break;

            case "modal":
            case "wizard":
                setActiveModal(action.key);
                break;

            default:
                console.warn("Unknown action type:", action.type);
        }
    };

    return (
        <>
            <Button onClick={handleClick} className="mt-2 w-full btn">
                {action.action}
            </Button>

            {activeModal === "addStock" && (
                <>
                    <StockFormModal showModal={activeModal} onClose={() => setActiveModal(null)}/>
                </>
            )}

            {activeModal === "issueStock" && (
                <StockSelectorModal
                    showModal={true}
                    onClose={() => setActiveModal(null)}
                    action={"issueStock"}
                />
            )}

            {activeModal === "transferStock" && (
                <StockSelectorModal
                    showModal={true}
                    onClose={() => setActiveModal(null)}
                    action={"transferStock"}
                />
            )}

            {activeModal === "adjustStock" && (
                <StockSelectorModal
                    showModal={true}
                    onClose={() => setActiveModal(null)}
                    action={"adjustStock"}
                />
            )}

            {activeModal === "stockCount" && (
                <StockCountModal
                    showModal={true}
                    onClose={() => setActiveModal(null)}
                />
            )}

            {activeModal === "createItem" && (
                <ItemFormModal
                    showModal={true}
                    onClose={() => setActiveModal(null)}
                />
            )}

            {activeModal === "editItem" && (
                <ItemSelectorModal
                    showModal={true}
                    onClose={() => setActiveModal(null)}
                    action={"editItem"}
                />
            )}

            {activeModal === "removeItem" && (
                <ItemSelectorModal
                    showModal={true}
                    onClose={() => setActiveModal(null)}
                    action={"removeItem"}
                />
            )}

            {activeModal === "createWarehouse" && (
                <WarehouseFormModal
                    showModal={true}
                    onClose={() => setActiveModal(null)}
                />
            )}

            {activeModal === "editWarehouse" && (
                <WarehouseSelectorModal
                    showModal={true}
                    onClose={() => setActiveModal(null)}
                    action={"editWarehouse"}
                />
            )}

            {activeModal === "removeWarehouse" && (
                <WarehouseSelectorModal
                    showModal={true}
                    onClose={() => setActiveModal(null)}
                    action={"removeWarehouse"}
                />
            )}
        </>
    );
};

export default ActionHandler;
