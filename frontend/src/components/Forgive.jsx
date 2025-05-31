// import React, { useState } from 'react';
//
// const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
//     return (
//         <ModalOverlay isOpen={isOpen} onClose={onClose}>
//             <div className="text-center">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
//                     {title}
//                 </h2>
//
//                 {message && (
//                     <p className="text-gray-600 mb-8">
//                         {message}
//                     </p>
//                 )}
//
//                 <div className="flex gap-4 justify-center">
//                     <button
//                         onClick={onClose}
//                         className="px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors min-w-24"
//                     >
//                         No
//                     </button>
//                     <button
//                         onClick={onConfirm}
//                         className="px-8 py-3 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition-colors min-w-24"
//                     >
//                         Yes
//                     </button>
//                 </div>
//             </div>
//         </ModalOverlay>
//     );
// };
// export default confirmModal