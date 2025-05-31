import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

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

// Funeral Popup Component
const FuneralPopup = ({
                          isOpen = false,
                          onClose,
                          characterData = {
                              name: 'Player',
                              image: null
                          }
                      }) => {
    const handleRevive = () => {
        onClose?.();
    };

    const handleAcceptDeath = () => {
        onClose?.();
    };

    if (!isOpen) {
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
                        {/* Character face */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-black bg-gray-300">
                                {characterData.image ? (
                                    <img
                                        src={characterData.image}
                                        alt="Character face"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
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

// Setting Popup Component
const SettingPopup = ({ isOpen, onClose, initialData, onSave }) => {
    const [activeTab, setActiveTab] = useState('Detail');
    const [name, setName] = useState(initialData?.name || 'Stupid worker friend master of desto');
    const [reason, setReason] = useState(initialData?.reason || 'He stupid as f*** so annoying ahhhhhhhhhhhhhh');
    const [hitEffects, setHitEffects] = useState(initialData?.hitEffects || ['Ahhhh', 'Sorry it my fau..']);
    const [characterImage, setCharacterImage] = useState(initialData?.image || null);
    const [editingEffect, setEditingEffect] = useState(null);
    const [editValue, setEditValue] = useState('');

    if (!isOpen) return null;

    const addHitEffect = () => {
        setHitEffects([...hitEffects, 'New effect']);
    };

    const editHitEffect = (index, value) => {
        const newEffects = [...hitEffects];
        newEffects[index] = value;
        setHitEffects(newEffects);
        setEditingEffect(null);
    };

    const deleteHitEffect = (index) => {
        setHitEffects(hitEffects.filter((_, i) => i !== index));
    };

    const startEditing = (index) => {
        setEditingEffect(index);
        setEditValue(hitEffects[index]);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCharacterImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setCharacterImage(null);
    };

    const handleSave = () => {
        const data = {
            name,
            reason,
            hitEffects,
            image: characterImage
        };
        onSave?.(data);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4">
                    <h2 className="text-2xl font-bold text-black">Setting</h2>
                    <button
                        onClick={onClose}
                        className="text-black hover:text-gray-600 text-2xl font-bold"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-6">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        {['Detail', 'Hit Effect', 'Image'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                                    activeTab === tab
                                        ? 'bg-blue-300 text-black font-bold'
                                        : 'text-gray-600 hover:text-black'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 pt-4">
                    {activeTab === 'Detail' && (
                        <div className="bg-lblue rounded-lg p-4 space-y-4">
                            <div>
                                <label className="block text-black font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-ourwhite w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-black font-medium mb-2">Why you hate it?</label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows={4}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-ourwhite"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'Hit Effect' && (
                        <div className="bg-blue-100 rounded-lg p-4">
                            <h3 className="text-black font-medium mb-4">Add you hit effect!</h3>
                            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                                {hitEffects.map((effect, index) => (
                                    <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg">
                                        {editingEffect === index ? (
                                            <input
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onBlur={() => editHitEffect(index, editValue)}
                                                onKeyDown={(e) => e.key === 'Enter' && editHitEffect(index, editValue)}
                                                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                autoFocus
                                            />
                                        ) : (
                                            <span className="flex-1 text-black">{effect}</span>
                                        )}
                                        <button
                                            onClick={() => startEditing(index)}
                                            className="bg-pink-200 hover:bg-pink-300 px-3 py-1 rounded text-black font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteHitEffect(index)}
                                            className="bg-black hover:bg-gray-800 text-white w-8 h-8 rounded flex items-center justify-center font-bold"
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={addHitEffect}
                                className="w-full p-3 border-2 border-dashed border-gray-400 rounded-lg text-gray-600 hover:border-gray-600 hover:text-black"
                            >
                                + Add Effect
                            </button>
                        </div>
                    )}

                    {activeTab === 'Image' && (
                        <div className="bg-blue-100 rounded-lg p-4">
                            <p className="text-center text-black font-medium mb-6">
                                *We don't save this Image for you*
                            </p>
                            <div className="flex items-center gap-6">
                                {/* Image Preview */}
                                <div className="w-24 h-24 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden border-2 border-gray-400">
                                    {characterImage ? (
                                        <img
                                            src={characterImage}
                                            alt="Character preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-xs text-gray-500">No Image</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-2">
                                    {/* Upload Button */}
                                    <label htmlFor="image-upload" className="block">
                                        <div className="bg-pink-200 rounded-lg p-6 text-center border-2 border-dashed border-pink-300 hover:border-pink-400 cursor-pointer transition-colors">
                                            <Upload className="mx-auto mb-2 text-black" size={24} />
                                            <p className="text-black font-medium">Upload Your Image</p>
                                        </div>
                                    </label>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />

                                    {/* Remove Image Button */}
                                    {characterImage && (
                                        <button
                                            onClick={removeImage}
                                            className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                                        >
                                            Remove Image
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Save Button */}
                <div className="p-6 pt-0">
                    <button
                        onClick={handleSave}
                        className="w-full py-4 bg-gradient-to-r from-blue-400 to-pink-400 hover:from-blue-500 hover:to-pink-500 text-white font-bold rounded-lg transition-all"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main Test Component
function Test() {
    const [isSettingOpen, setIsSettingOpen] = useState(false);
    const [savedData, setSavedData] = useState(null);
    const [showFuneral, setShowFuneral] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleConfirm = () => {
        console.log('User confirmed action - removing from hate list');
        setIsConfirmModalOpen(false);

        if (savedData) {
            console.log(`Forgiving ${savedData.name} and removing from hate list`);
            setSavedData({...savedData, forgiven: true});
        }
    };

    const handleCancel = () => {
        console.log('User cancelled action');
        setIsConfirmModalOpen(false);
    };

    const handleOpenSetting = () => {
        setIsSettingOpen(true);
    };

    const handleCloseSetting = () => {
        setIsSettingOpen(false);
    };

    const handleSaveData = (data) => {
        setSavedData(data);
        console.log('Saved data:', data);
    };

    const getCharacterData = () => {
        return {
            name: savedData?.name || 'Player',
            image: savedData?.image || null
        };
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4">
            <div className="mb-6 text-2xl font-bold">Test All Components</div>

            {/* Buttons */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={handleOpenSetting}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                >
                    Open Settings
                </button>

                <button
                    onClick={() => setShowFuneral(true)}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                    disabled={!savedData}
                >
                    Kill Character (Show Funeral)
                </button>

                <button
                    onClick={() => {
                        console.log('Forgive button clicked');
                        setIsConfirmModalOpen(true);
                    }}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                    disabled={!savedData}
                >
                    Open Forgive Modal
                </button>
            </div>

            {/* Display saved data */}
            {savedData && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 border">
                    <h2 className="text-xl font-bold mb-4">Saved Settings:</h2>
                    <div className="space-y-2">
                        <p><strong>Name:</strong> {savedData.name}</p>
                        <p><strong>Reason:</strong> {savedData.reason}</p>
                        <p><strong>Hit Effects:</strong> {savedData.hitEffects?.join(', ')}</p>
                        {savedData.forgiven && (
                            <p className="text-green-600 font-semibold">✓ Forgiven and removed from hate list</p>
                        )}
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
                                <p className="text-sm text-gray-600">
                                    {savedData.forgiven ? 'Forgiven ✓' : 'Ready for funeral...'}
                                </p>
                                {savedData.image && (
                                    <p className="text-xs text-green-600">✓ Image uploaded</p>
                                )}
                            </div>

                            {!savedData.forgiven && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            console.log('Character preview forgive button clicked');
                                            setIsConfirmModalOpen(true);
                                        }}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                                    >
                                        Forgive
                                    </button>
                                    <button
                                        onClick={() => setShowFuneral(true)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                                    >
                                        Kill
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* All Popups */}
            <SettingPopup
                isOpen={isSettingOpen}
                onClose={handleCloseSetting}
                onSave={handleSaveData}
                initialData={savedData}
            />

            <FuneralPopup
                isOpen={showFuneral}
                onClose={() => setShowFuneral(false)}
                characterData={getCharacterData()}
            />

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={handleCancel}
                onConfirm={handleConfirm}
                title="Are you sure you want to forgive him and remove him from the Hate List?"
                message="This action will remove the person from your hate list and they will be forgiven."
            />
        </div>
    );
}

export default Test;