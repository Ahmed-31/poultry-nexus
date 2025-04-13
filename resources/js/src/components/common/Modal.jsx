import {useEffect} from "react";
import {X} from "lucide-react";

const Modal = ({isOpen, onClose, children}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }

        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 cursor-default"
            onClick={onClose}
        >
            <div
                className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 max-h-screen overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <X className="w-6 h-6"/>
                </button>

                {children}
            </div>
        </div>
    );
};

export default Modal;
