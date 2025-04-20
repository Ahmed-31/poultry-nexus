import {useEffect, useRef} from "react";
import {X} from "lucide-react";
import {useTranslation} from "react-i18next";

const Modal = ({isOpen, onClose, children}) => {
    const modalRef = useRef(null);
    const {t} = useTranslation();

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("overflow-hidden");
            setTimeout(() => modalRef.current?.focus(), 10);
        } else {
            document.body.classList.remove("overflow-hidden");
        }

        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose?.();
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                ref={modalRef}
                tabIndex={-1}
                className="relative bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200 animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={onClose}
                    aria-label={t('modal.close')}
                >
                    <X className="w-5 h-5 sm:w-6 sm:h-6"/>
                </button>

                <div id="modal-title" className="sr-only">{t('modal.title')}</div>

                {children}
            </div>
        </div>
    );
};

export default Modal;
