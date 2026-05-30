import React from 'react';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Forgive this person?',
    message = 'They will be removed from your hate list for good.',
    name,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-ourblack p-1 rounded-lg shadow-2xl max-w-lg w-full">
                <div className="bg-white rounded-lg overflow-hidden">

                    <div className="bg-black text-white text-center py-8 px-8">
                        <h1 className="text-4xl font-rye font-bold tracking-wider mb-2">FORGIVE</h1>
                        {name && <p className="text-2xl font-rye">({name})</p>}
                    </div>

                    <div className="bg-[url('/images/funeral.jpg')] bg-cover bg-center p-8">
                        <div className="mb-8">
                            <div className="bg-white border-2 border-black rounded-lg p-3">
                                <p className="text-black text-base font-medium text-center">
                                    {message}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={onClose}
                                className="flex-1 bg-gradient-to-t from-black to-gray-600 hover:from-gray-900 hover:to-black text-white font-bold py-4 px-4 text-lg rounded-lg transition-colors shadow-lg"
                            >
                                No, keep
                            </button>
                            <button
                                onClick={onConfirm}
                                className="flex-1 bg-gradient-to-t from-black to-pink-600 hover:bg-pink-800 text-white font-bold py-4 px-4 text-lg rounded-lg transition-colors shadow-lg"
                            >
                                Yes, forgive
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
