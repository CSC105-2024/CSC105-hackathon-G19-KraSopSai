import React, {useState} from 'react';
import { X, Upload } from 'lucide-react';

function SettingPopup({isOpen, onClose, initialData, onSave}) {
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
            image: characterImage // Include image in saved data
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
                                        ? 'bg-blue-200 text-black'
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
                        <div className="bg-blue-100 rounded-lg p-4 space-y-4">
                            <div>
                                <label className="block text-black font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-black font-medium mb-2">Why you hate it?</label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows={4}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
                                                onKeyPress={(e) => e.key === 'Enter' && editHitEffect(index, editValue)}
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
}

export default SettingPopup