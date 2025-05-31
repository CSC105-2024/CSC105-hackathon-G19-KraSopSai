import React, { useState } from 'react';

const FuneralPopup = ({
                          isOpen = true,
                          onClose,
                          characterData = {
                              name: 'Player',
                              image: null
                          }
                      }) => {
    const [showPopup, setShowPopup] = useState(isOpen);

    const handleRevive = () => {
        setShowPopup(false);
        onClose?.();
        // In a real game, this would trigger respawn logic
    };

    const handleAcceptDeath = () => {
        setShowPopup(false);
        onClose?.();
        // In a real game, this would end the game or go to game over screen
    };

    if (!showPopup) {
        return null;
    }

    // Get current date in DD/MM/YYYY format
    const getCurrentDate = () => {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-cyan-400 p-1 rounded-lg shadow-2xl max-w-sm w-full">
                <div className="bg-white rounded-lg overflow-hidden">
                    {/* RIP Header */}
                    <div className="bg-black text-white text-center py-6 px-6">
                        <h1 className="text-3xl font-bold tracking-wider mb-2">RIP</h1>
                        <p className="text-lg mb-1">({characterData.name})</p>
                        <p className="text-sm">Die: {getCurrentDate()}</p>
                    </div>

                    {/* Main content area */}
                    <div className="bg-gray-100 p-6">

                        {/* Character face - imported from SettingPopup */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-black bg-gray-300">
                                {characterData.image ? (
                                    <img
                                        src={characterData.image}
                                        alt="Character face"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    // Default face if no image
                                    <div className="w-full h-full bg-gray-300 flex items-center justify-center relative">
                                        {/* Eyes */}
                                        <div className="absolute top-5 left-4 w-2 h-2 bg-black rounded-full"></div>
                                        <div className="absolute top-5 right-4 w-2 h-2 bg-black rounded-full"></div>
                                        {/* Mouth */}
                                        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-black rounded"></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Speech bubble */}
                        <div className="mb-6">
                            <div className="bg-white border-2 border-black rounded-lg p-4 relative">
                                <p className="text-black text-sm font-medium text-center">
                                    This guy death now, but you have a chance to...
                                </p>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleRevive}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg border-2 border-green-800"
                            >
                                Revive!
                            </button>
                            <button
                                onClick={handleAcceptDeath}
                                className="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg border-2 border-red-900"
                            >
                                This is enough...
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FuneralPopup;