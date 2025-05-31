import React from 'react';

// Modal Overlay Component
const ModalOverlay = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 transform transition-all">
                {children}
            </div>
        </div>
    );
};

// Confirmation Modal Component
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    return (
        <ModalOverlay isOpen={isOpen} onClose={onClose}>
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
                    {title}
                </h2>

                {message && (
                    <p className="text-gray-600 mb-8">
                        {message}
                    </p>
                )}

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors min-w-24"
                    >
                        No
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-8 py-3 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition-colors min-w-24"
                    >
                        Yes
                    </button>
                </div>
            </div>
        </ModalOverlay>
    );
};

export default ConfirmModal;