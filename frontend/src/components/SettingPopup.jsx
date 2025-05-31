import React, {useState} from 'react';
import { X, Upload } from 'lucide-react';
import { Axios } from '../utils/axiosInstance';
import { createHitEffect } from '../api/hitEffectAPI';

function SettingPopup({isOpen, onClose, victimId, onSave}) {
    const [activeTab, setActiveTab] = useState('Detail');
    const [name, setName] = useState();
    const [reason, setReason] = useState();
    const [hitEffects, setHitEffects] = useState([]);
    const [characterImage, setCharacterImage] = useState(victimId?.image || null);
    const [editingEffect, setEditingEffect] = useState(null);
    const [editValue, setEditValue] = useState('');

    if (!isOpen) {
        return null;
    }


const addHitEffect = async (data) => {
  try {
    const response = await createHitEffect('/hitEffect', data);
    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    console.error(
      'Error in createHitEffect:',
      e?.response?.data || e?.message || e
    );
    return {
      success: false,
      data: e?.response?.data || null,
    };
  }
};

    const edit = async (index, value) => {
        console.log('Editing hit effect at index:', index, 'with value:', value);

        const effectId = newEffects[index].title = value;
        const data = await editHitEffect({
            id: effectId,
            title: value,
        });
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
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-ourwhite rounded-2xl w-full max-w-xs sm:max-w-md lg:max-w-lg shadow-2xl max-h-[95vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 pb-3 sm:pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-black">Setting</h2>
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
                        {['Detail', 'Hit Effect', 'Image'].map((tab) => (
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
                        </div>
                    )}

                    {activeTab === 'Hit Effect' && (
                        <div className="bg-lblue rounded-lg p-3 sm:p-4">
                            <h3 className="text-black font-medium mb-3 sm:mb-4 text-sm sm:text-base">Add you hit effect!</h3>
                            <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 max-h-40 sm:max-h-48 overflow-y-auto">
                                {hitEffects.map((effect, index) => (
                                    <div key={index} className="flex items-center gap-2 sm:gap-3 bg-white p-2 sm:p-3 rounded-lg">
                                        {editingEffect === index ? (
                                            <input
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onBlur={() => editHitEffect(index, editValue)}
                                                onKeyDown={(e) => e.key === 'Enter' && editHitEffect(index, editValue)}
                                                className="flex-1 p-1.5 sm:p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lblue text-sm sm:text-base"
                                                autoFocus
                                            />
                                        ) : (
                                            <span className="flex-1 text-black text-sm sm:text-base break-words">{effect}</span>
                                        )}
                                        <button
                                            onClick={() => startEditing(index)}
                                            className="bg-pink-200 hover:bg-pink-300 px-2 sm:px-3 py-1 rounded text-black font-medium text-xs sm:text-sm flex-shrink-0"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteHitEffect(index)}
                                            className="bg-black hover:bg-gray-800 text-white w-6 h-6 sm:w-8 sm:h-8 rounded flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0"
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {/* <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newEffect}
                                    onChange={e => setNewEffect(e.target.value)}
                                    placeholder="Enter new effect"
                                    className="flex-1 p-2 border border-gray-300 rounded"
                                />
                                <button
                                    onClick={addHitEffect}
                                    className="px-4 py-2 bg-blue-400 text-white rounded"
                                >
                                    + Add Effect
                                </button>
                            </div> */}
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
                                *We don't save this Image for you*
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
                        className="w-full py-3 sm:py-4 bg-custom-lightgradient text-ourblack font-bold rounded-lg transition-all text-sm sm:text-base  border-1 border-ourblack"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SettingPopup