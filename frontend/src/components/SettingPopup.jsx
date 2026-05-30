import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { Axios } from '../utils/axiosInstance';
import { createHitEffect, editHitEffect, deleteHitEffect, getMyHitEffects } from '../api/hitEffectAPI';

function SettingPopup({ isOpen, onClose, victim, onSave }) {
    const victimId = victim?.id;
    const [activeTab, setActiveTab] = useState('Detail');
    const [name, setName] = useState(victim?.name || '');
    const [reason, setReason] = useState(victim?.reason || '');
    const [hp, setHp] = useState(victim?.hp ?? 100);
    const [hitEffects, setHitEffects] = useState([]); // Array of strings or objects
    const [characterImage, setCharacterImage] = useState(null);
    const [editingEffect, setEditingEffect] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [newEffect, setNewEffect] = useState('');

    // Create mode = no victim id yet. Hit Effect + Image tabs need an id, so
    // they only show in edit mode. Same UI either way.
    const isCreate = !victim?.id;
    const tabs = isCreate ? ['Detail'] : ['Detail', 'Hit Effect', 'Image'];

    // Prefill name/reason + load image from localStorage when popup opens for a victim
    useEffect(() => {
        if (!isOpen) return;
        setActiveTab('Detail');
        setName(victim?.name || '');
        setReason(victim?.reason || '');
        setHp(victim?.hp ?? 100);
        const savedImage = victim?.id
            ? localStorage.getItem(`victim_image_${victim.id}`)
            : null;
        setCharacterImage(savedImage);

        // Load this victim's hit effects from the server (edit mode only)
        if (victim?.id) {
            (async () => {
                const res = await getMyHitEffects();
                const all = res?.data?.data ?? [];
                setHitEffects(all.filter((eff) => eff.victimId === victim.id));
            })();
        } else {
            setHitEffects([]);
        }
    }, [isOpen, victim?.id, victim?.name, victim?.reason]);

    if (!isOpen) {
        return null;
    }

    // Add Hit Effect
    const addHitEffect = async () => {
        // For now, just add a placeholder. You can modify this to open an input dialog
        const effectText = prompt('Enter new hit effect:');
        if (!effectText?.trim()) return;

        try {
            const response = await createHitEffect({
                title: effectText,
                victimId,
            });

            if (response.success && response.data?.data) {
                // If API returns an object with title property
                const newEffectData = typeof response.data.data === 'object' ? response.data.data.title : response.data.data;
                setHitEffects([...hitEffects, newEffectData]);
            } else {
                // Fallback: add locally if API fails
                setHitEffects([...hitEffects, effectText]);
            }
        } catch (e) {
            console.error('Error adding hit effect:', e);
            // Fallback: add locally if API fails
            setHitEffects([...hitEffects, effectText]);
        }
    };

    // Edit Hit Effect
    const editHitEffectHandler = async (index, value) => {
        console.log('Editing hit effect at index:', index, 'with value:', value);

        const currentEffect = hitEffects[index];

        try {
            // If this is an object with an ID, try to update via API
            if (typeof currentEffect === 'object' && currentEffect.id) {
                const response = await editHitEffect(currentEffect.id, {
                    title: value,
                    victimId
                });

                if (response.success && response.data?.data) {
                    const newEffects = [...hitEffects];
                    newEffects[index] = typeof response.data.data === 'object' ? response.data.data.title : response.data.data;
                    setHitEffects(newEffects);
                } else {
                    // Fallback to local update
                    const newEffects = [...hitEffects];
                    newEffects[index] = value;
                    setHitEffects(newEffects);
                }
            } else {
                // Local update only (string values)
                const newEffects = [...hitEffects];
                newEffects[index] = value;
                setHitEffects(newEffects);
            }
            setEditingEffect(null);
        } catch (e) {
            console.error('Error editing hit effect:', e);
            // Fallback to local update
            const newEffects = [...hitEffects];
            newEffects[index] = value;
            setHitEffects(newEffects);
            setEditingEffect(null);
        }
    };

    // Delete Hit Effect
    const deleteHitEffectHandler = async (index) => {
        const effect = hitEffects[index];

        try {
            // If this is an object with an ID, try to delete via API
            if (typeof effect === 'object' && effect.id) {
                const response = await deleteHitEffect(effect.id);
                if (response.success) {
                    setHitEffects(hitEffects.filter((_, i) => i !== index));
                } else {
                    // Fallback to local deletion
                    setHitEffects(hitEffects.filter((_, i) => i !== index));
                }
            } else {
                // Local deletion only (string values)
                setHitEffects(hitEffects.filter((_, i) => i !== index));
            }
        } catch (e) {
            console.error('Error deleting hit effect:', e);
            // Fallback to local deletion
            setHitEffects(hitEffects.filter((_, i) => i !== index));
        }
    };

    const startEditing = (index) => {
        setEditingEffect(index);
        // Handle both string and object formats
        const effect = hitEffects[index];
        setEditValue(typeof effect === 'object' ? effect.title : effect);
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
            id: victim?.id,
            name,
            reason,
            hp: Number(hp) || 100,
        };
        // Persist image to localStorage keyed by victim id (only if we have an id).
        if (victim?.id) {
            if (characterImage) {
                localStorage.setItem(`victim_image_${victim.id}`, characterImage);
            } else {
                localStorage.removeItem(`victim_image_${victim.id}`);
            }
        }
        onSave?.(data);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-ourwhite rounded-2xl w-full max-w-xs sm:max-w-md lg:max-w-lg shadow-2xl max-h-[95vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 pb-3 sm:pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-black">{isCreate ? 'Create Victim' : 'Edit Victim'}</h2>
                    <button
                        onClick={onClose}
                        className="text-black hover:text-gray-600 text-xl sm:text-2xl font-bold p-1"
                    >
                        <X size={20} className="sm:w-6 sm:h-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-4 sm:px-6">
                    <div className="flex bg-ourwhite rounded-lg p-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2 px-2 sm:px-4 rounded-md font-medium transition-colors text-sm sm:text-base ${
                                    activeTab === tab
                                        ? 'bg-lblue text-ourblack font-extrabold shadow-sm'
                                        : 'text-gray-700 hover:text-ourblack hover:bg-white hover:bg-opacity-50'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 pt-3 sm:pt-4">
                    {activeTab === 'Detail' && (
                        <div className="bg-lblue rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4">
                            <div>
                                <label className="block text-black font-bold mb-2 text-sm sm:text-base">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-ourwhite w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lblue text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-black font-bold mb-2 text-sm sm:text-base">Why you hate it?</label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows={3}
                                    className="w-full p-2 sm:p-3 bg-ourwhite border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lblue resize-none text-sm sm:text-base sm:rows-4"
                                />
                            </div>
                            <div>
                                <label className="block text-black font-bold mb-2 text-sm sm:text-base">Health (HP)</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={hp}
                                    onChange={(e) => setHp(e.target.value)}
                                    className="bg-ourwhite w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lblue text-sm sm:text-base"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'Hit Effect' && (
                        <div className="bg-lblue rounded-lg p-3 sm:p-4">
                            <h3 className="text-black font-medium mb-3 sm:mb-4 text-sm sm:text-base">Add your hit effect!</h3>
                            <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 max-h-40 sm:max-h-48 overflow-y-auto">
                                {hitEffects.map((effect, index) => (
                                    <div key={index} className="flex items-center gap-2 sm:gap-3 bg-white p-2 sm:p-3 rounded-lg">
                                        {editingEffect === index ? (
                                            <input
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onBlur={() => editHitEffectHandler(index, editValue)}
                                                onKeyDown={(e) => e.key === 'Enter' && editHitEffectHandler(index, editValue)}
                                                className="flex-1 p-1.5 sm:p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lblue text-sm sm:text-base"
                                                autoFocus
                                            />
                                        ) : (
                                            <span className="flex-1 text-black text-sm sm:text-base break-words">
                                                {typeof effect === 'object' ? effect.title : effect}
                                            </span>
                                        )}
                                        <button
                                            onClick={() => startEditing(index)}
                                            className="bg-pink-200 hover:bg-pink-300 px-2 sm:px-3 py-1 rounded text-black font-medium text-xs sm:text-sm flex-shrink-0"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteHitEffectHandler(index)}
                                            className="bg-black hover:bg-gray-800 text-white w-6 h-6 sm:w-8 sm:h-8 rounded flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0"
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={addHitEffect}
                                className="w-full p-2 sm:p-3 border-2 border-dashed border-gray-400 rounded-lg text-gray-600 hover:border-gray-600 hover:text-black text-sm sm:text-base"
                            >
                                + Add Effect
                            </button>
                        </div>
                    )}

                    {activeTab === 'Image' && (
                        <div className="bg-lblue rounded-lg p-3 sm:p-4">
                            <p className="text-center text-black font-medium mb-4 sm:mb-6 text-sm sm:text-base">
                                *Saved locally on this browser only*
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                                {/* Image Preview */}
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden border-2 border-gray-400">
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

                                <div className="flex-1 w-full space-y-2">
                                    {/* Upload Button */}
                                    <label htmlFor="image-upload" className="block">
                                        <div className="bg-pink-200 rounded-lg p-4 sm:p-6 text-center border-2 border-dashed border-pink-300 hover:border-pink-400 cursor-pointer transition-colors">
                                            <Upload className="mx-auto mb-2 text-black" size={20} />
                                            <p className="text-black font-medium text-sm sm:text-base">Upload Your Image</p>
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
                                            className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors text-sm sm:text-base"
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
                <div className="p-4 sm:p-6 pt-0">
                    <button
                        onClick={handleSave}
                        className="w-full py-3 sm:py-4 bg-custom-lightgradient text-ourblack font-bold rounded-lg transition-all text-sm sm:text-base border-1 border-ourblack"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SettingPopup;