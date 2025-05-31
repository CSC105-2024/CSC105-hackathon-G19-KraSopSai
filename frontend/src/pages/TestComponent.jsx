// import React, { useState } from 'react';
// import SettingPopup from "../components/SettingPopup.jsx";
// import FuneralPopup from '../components/FuneralPopup.jsx';
// import ConfirmModal from '../components/Forgive.jsx'; // Fixed import name
//
// function Test() {
//     const [isSettingOpen, setIsSettingOpen] = useState(false);
//     const [savedData, setSavedData] = useState(null);
//     const [showFuneral, setShowFuneral] = useState(false);
//     const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
//
//     const handleConfirm = () => {
//         console.log('User confirmed action - removing from hate list');
//         setIsConfirmModalOpen(false);
//
//         // Add your confirmation logic here
//         if (savedData) {
//             console.log(`Forgiving ${savedData.name} and removing from hate list`);
//             // Update the savedData to reflect forgiveness
//             setSavedData({...savedData, forgiven: true});
//
//             // Here you could also:
//             // - Call an API to update the backend
//             // - Update local state to remove from hate list
//             // - Show a success message
//         }
//     };
//
//     const handleCancel = () => {
//         console.log('User cancelled action');
//         setIsConfirmModalOpen(false);
//     };
//
//     const handleOpenSetting = () => {
//         setIsSettingOpen(true);
//     };
//
//     const handleCloseSetting = () => {
//         setIsSettingOpen(false);
//     };
//
//     const handleSaveData = (data) => {
//         setSavedData(data);
//         console.log('Saved data:', data);
//         // Here you can send data to your backend, save to localStorage, etc.
//         // Note: Image is stored as base64 string in memory only
//     };
//
//     // Prepare character data for FuneralPopup
//     const getCharacterData = () => {
//         return {
//             name: savedData?.name || 'Player',
//             image: savedData?.image || null
//         };
//     };
//
//     return (
//         <div className="max-w-4xl mx-auto mt-10 ml-10">
//             <div className="mb-6 text-2xl">Test All Components</div>
//
//             {/* Buttons */}
//             <div className="flex gap-4 mb-8">
//                 <button
//                     onClick={handleOpenSetting}
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
//                 >
//                     Open Settings
//                 </button>
//
//                 <button
//                     onClick={() => setShowFuneral(true)}
//                     className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
//                     disabled={!savedData}
//                 >
//                     Kill Character (Show Funeral)
//                 </button>
//             </div>
//
//             {/* Display saved data */}
//             {savedData && (
//                 <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//                     <h2 className="text-xl font-bold mb-4">Saved Settings:</h2>
//                     <div className="space-y-2">
//                         <p><strong>Name:</strong> {savedData.name}</p>
//                         <p><strong>Reason:</strong> {savedData.reason}</p>
//                         <p><strong>Hit Effects:</strong> {savedData.hitEffects?.join(', ')}</p>
//                         {savedData.forgiven && (
//                             <p className="text-green-600 font-semibold">✓ Forgiven and removed from hate list</p>
//                         )}
//                     </div>
//
//                     {/* Character Preview */}
//                     <div className="mt-4 p-4 bg-gray-100 rounded-lg">
//                         <h3 className="font-bold mb-2">Character Preview:</h3>
//                         <div className="flex items-center gap-4">
//                             <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-400 bg-gray-300">
//                                 {savedData.image ? (
//                                     <img
//                                         src={savedData.image}
//                                         alt="Character"
//                                         className="w-full h-full object-cover"
//                                     />
//                                 ) : (
//                                     <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs">
//                                         No Image
//                                     </div>
//                                 )}
//                             </div>
//                             <div>
//                                 <p className="font-bold">{savedData.name}</p>
//                                 <p className="text-sm text-gray-600">
//                                     {savedData.forgiven ? 'Forgiven ✓' : 'Ready for funeral...'}
//                                 </p>
//                                 {savedData.image && (
//                                     <p className="text-xs text-green-600">✓ Image uploaded</p>
//                                 )}
//                             </div>
//
//                             {!savedData.forgiven && (
//                                 <button
//                                     onClick={() => setIsConfirmModalOpen(true)}
//                                     className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors ml-4"
//                                 >
//                                     Remove from Hate List
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}
//
//             {/* Setting Popup */}
//             <SettingPopup
//                 isOpen={isSettingOpen}
//                 onClose={handleCloseSetting}
//                 onSave={handleSaveData}
//                 initialData={savedData}
//             />
//
//             {/* Funeral Popup */}
//             {showFuneral && (
//                 <FuneralPopup
//                     isOpen={showFuneral}
//                     onClose={() => setShowFuneral(false)}
//                     characterData={getCharacterData()}
//                 />
//             )}
//
//             {/* Confirmation Modal */}
//             <ConfirmModal
//                 isOpen={isConfirmModalOpen}
//                 onClose={handleCancel}
//                 onConfirm={handleConfirm}
//                 title="Are you sure you want to forgive him and remove him from the Hate List?"
//                 message="This action will remove the person from your hate list and they will be forgiven."
//             />
//         </div>
//     );
// }
//
// export default Test;