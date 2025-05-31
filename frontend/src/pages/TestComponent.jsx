import React, {useState} from 'react'
import SettingPopup from "../components/SettingPopup.jsx";
import FuneralPopup from '../components/FuneralPopup.jsx';

function Test() {
    const [isSettingOpen, setIsSettingOpen] = useState(false);
    const [savedData, setSavedData] = useState(null);
    const [showFuneral, setShowFuneral] = useState(false);

    const handleOpenSetting = () => {
        setIsSettingOpen(true);
    };

    const handleCloseSetting = () => {
        setIsSettingOpen(false);
    };

    const handleSaveData = (data) => {
        setSavedData(data);
        console.log('Saved data:', data);
        // Here you can send data to your backend, save to localStorage, etc.
        // Note: Image is stored as base64 string in memory only
    };

    // Prepare character data for FuneralPopup
    const getCharacterData = () => {
        return {
            name: savedData?.name || 'Player',
            image: savedData?.image || null
        };
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 ml-10 ">
            <div className="mb-6 text-2xl">test all component</div>

            {/* Buttons */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={handleOpenSetting}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
                >
                    Open Settings
                </button>

                <button
                    onClick={() => setShowFuneral(true)}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
                    disabled={!savedData}
                >
                    Kill Character (Show Funeral)
                </button>
            </div>

            {/* Display saved data */}
            {savedData && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-bold mb-4">Saved Settings:</h2>
                    <div className="space-y-2">
                        <p><strong>Name:</strong> {savedData.name}</p>
                        <p><strong>Reason:</strong> {savedData.reason}</p>
                        <p><strong>Hit Effects:</strong> {savedData.hitEffects.join(', ')}</p>
                    </div>

                    {/* Character Preview */}
                    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                        <h3 className="font-bold mb-2">Character Preview:</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-400 bg-gray-300">
                                {savedData.image ? (
                                    <img
                                        src={savedData.image}
                                        alt="Character"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="font-bold">{savedData.name}</p>
                                <p className="text-sm text-gray-600">Ready for funeral...</p>
                                {savedData.image && (
                                    <p className="text-xs text-green-600">✓ Image uploaded</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Setting Popup */}
            <SettingPopup
                isOpen={isSettingOpen}
                onClose={handleCloseSetting}
                onSave={handleSaveData}
                initialData={savedData}
            />

            {/* Funeral Popup */}
            {showFuneral && (
                <FuneralPopup
                    isOpen={showFuneral}
                    onClose={() => setShowFuneral(false)}
                    characterData={getCharacterData()}
                />
            )}
        </div>
    )
}

export default Test