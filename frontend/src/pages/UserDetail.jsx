// import React, { useEffect, useState } from 'react'
// import SettingPopup from '../components/SettingPopup.jsx'

// function UserDetail() {
//   const [savedData, setSavedData] = useState(null);
//   const [isSettingOpen, setIsSettingOpen] = useState(false);
//   const handleOpenSetting = () => {
//         setIsSettingOpen(true);
//     };

//     const handleCloseSetting = () => {
//         setIsSettingOpen(false);
//     };

//     const handleSaveData = (data) => {
//         // Here you would typically send the data to your backend or save it in state
//         setSavedData(data);
//         console.log('Saved data:', data);
//     };
//   const hateList = [
//   {
//     id: 1,
//     name: 'Hate Name 1',
//   },
//   {
//     id: 2,
//     name: 'Hate Name 2',
//   },
//   {
//     id: 3,
//     name: 'Hate Name 3',
//   },
//     {
//     id: 4,
//     name: 'Hate Name 4',
//   },
//   {
//     id: 5,
//     name: 'Hate Name 5',
//   },
//   {
//     id: 6,
//     name: 'Hate Name 6',
//   },
//     {
//     id: 7,
//     name: 'Hate Name 7',
//   },
//   {
//     id: 8,
//     name: 'Hate Name 8',
//   },
//   {
//     id: 9,
//     name: 'Hate Name 9',
//   },
//     {
//     id: 10,
//     name: 'Hate Name 10',
//   },
//   {
//     id: 11,
//     name: 'Hate Name 11',
//   },
//   {
//     id: 12,
//     name: 'Hate Name 12',
//   },
// ];

// // const testConnection = async () => {
// // 		try {
// // 			const data = await Axios.get('/:id');
// // 			console.log(data.data);
// // 		} catch (e) {
// // 			console.log(`Error fetching backend server: ${e}`);
// // 		}
// // 	};
// //   useEffect(() => {
// // 	testConnection();
// // }, []);
//   return (
//     <div className="bg-[url('/images/background.jpg')] bg-cover bg-center h-screen flex flex-col ">
    
//     <div className='pt-6 sm:pt-10 mx-10 sm:mx-20 flex flex-col flex-1'>
//       <div className='flex justify-between items-center bg-custom-lightgradient w-full max-w-[346px] h-[83px] rounded-[20px] border-1 border-black sm:max-w-[1069px] sm:h-[100px] px-6 sm:px-10 mx-auto my-4'>
//           <h1 className='text-md sm:text-xl '>username</h1>
//           <div>
//             <button className='flex sm:hidden bg-black rounded-[10px] w-10 h-10 items-center justify-center'>
//                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" >
//   <path d="M20 12H10.5M18 15L21 12L18 9M13 7V6C13 5.46957 12.7893 4.96086 12.4142 4.58579C12.0391 4.21071 11.5304 4 11 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H11C11.5304 20 12.0391 19.7893 12.4142 19.4142C12.7893 19.0391 13 18.5304 13 18V17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
// </svg>
//             </button>
//             <button className='hidden sm:block bg-black text-white rounded-[14px] px-4 py-2'>LOGOUT</button>
//           </div>
//       </div>

//       <div className='flex flex-col flex-1 min-h-0'>
//         <div className='max-w-[342px] sm:max-w-[1069px] bg-lpink rounded-t-[20px] border-1 border-black flex items-center px-6 sm:px-10 mx-auto w-full'>
//           <div className='flex items-center justify-between w-full py-4'>
//             <h3 className='text-md sm:text-2xl '>Hate List</h3>
//             <button className='w-8 h-8 sm:w-10 sm:h-10 rounded-[10px] bg-black flex items-center justify-center'>
//               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                 <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//               </svg>
//             </button>
//           </div>
//         </div>

//         <div className='bg-white max-w-[342px] rounded-b-[20px] border-1 border-black flex flex-col sm:max-w-[1069px] flex-1 pt-2 sm:pt-4 px-4 mx-auto w-full overflow-y-scroll'>
//           {hateList.map((hate, index) => (
//             <div key={`${hate.id}-${index}`}        className="hate-item bg-yellow flex flex-col items-center justify-between sm:max-w-[1024px] w-full min-h-[98px] sm:min-h-[100px] border-1 border-black rounded-[20px] px-6 sm:px-10 my-2 mx-auto ">
//               <div className='flex items-start sm:items-center flex-col sm:flex-row sm:justify-between w-full h-full pt-2 sm:pt-0'>
//                 <p className='text-md sm:text-xl pb-2'>{hate.name}</p>
//                 <div className='flex items-center gap-2 w-full sm:w-50 '>
//                   <button 
//                       className='bg-lblue text-black rounded-[14px] px-4 py-2 border w-full' onClick={handleOpenSetting} 
//                     >Edit</button>

//                         <button 
//                           className='bg-dpink text-white rounded-[14px] px-4 py-2 border border-black w-full' 
                          
//                         >
//   Forgive
// </button>

//                 </div>
//               </div>
//             </div>
//           ))}
            
//         </div>
//       </div>
//     </div>
//     {
//       isSettingOpen && (
//         <SettingPopup
//                 isOpen={isSettingOpen}
//                 onClose={handleCloseSetting}
//                 onSave={handleSaveData}
//                 initialData={savedData}
//             />
//       )
//     }
//     </div>
//   )
// }

// export default UserDetail
import React, { useEffect, useState } from 'react'
import SettingPopup from '../components/SettingPopup.jsx'

function UserDetail() {
  const [savedData, setSavedData] = useState(null);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const handleOpenSetting = () => {
        setIsSettingOpen(true);
    };

    const handleCloseSetting = () => {
        setIsSettingOpen(false);
    };

    const handleSaveData = (data) => {
        // Here you would typically send the data to your backend or save it in state
        setSavedData(data);
        console.log('Saved data:', data);
    };
  const hateList = [
  {
    id: 1,
    name: 'Hate Name 1',
  },
  {
    id: 2,
    name: 'Hate Name 2',
  },
  {
    id: 3,
    name: 'Hate Name 3',
  },
    {
    id: 4,
    name: 'Hate Name 4',
  },
  {
    id: 5,
    name: 'Hate Name 5',
  },
  {
    id: 6,
    name: 'Hate Name 6',
  },
    {
    id: 7,
    name: 'Hate Name 7',
  },
  {
    id: 8,
    name: 'Hate Name 8',
  },
  {
    id: 9,
    name: 'Hate Name 9',
  },
    {
    id: 10,
    name: 'Hate Name 10',
  },
  {
    id: 11,
    name: 'Hate Name 11',
  },
  {
    id: 12,
    name: 'Hate Name 12',
  },
];

// const testConnection = async () => {
// 		try {
// 			const data = await Axios.get('/:id');
// 			console.log(data.data);
// 		} catch (e) {
// 			console.log(`Error fetching backend server: ${e}`);
// 		}
// 	};
//   useEffect(() => {
// 	testConnection();
// }, []);
  return (
    <div className="bg-[url('/images/background.jpg')] bg-cover bg-center h-screen flex flex-col overflow-hidden">
    
    <div className='pt-6 sm:pt-10 mx-10 sm:mx-20 flex flex-col flex-1 min-h-0'>
      <div className='flex justify-between items-center bg-custom-lightgradient w-full max-w-[346px] h-[83px] rounded-[20px] border-1 border-black sm:max-w-[1069px] sm:h-[100px] px-6 sm:px-10 mx-auto my-4 flex-shrink-0'>
          <h1 className='text-md sm:text-xl '>username</h1>
          <div>
            <button className='flex sm:hidden bg-black rounded-[10px] w-10 h-10 items-center justify-center'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" >
  <path d="M20 12H10.5M18 15L21 12L18 9M13 7V6C13 5.46957 12.7893 4.96086 12.4142 4.58579C12.0391 4.21071 11.5304 4 11 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H11C11.5304 20 12.0391 19.7893 12.4142 19.4142C12.7893 19.0391 13 18.5304 13 18V17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
            </button>
            <button className='hidden sm:block bg-black text-white rounded-[14px] px-4 py-2'>LOGOUT</button>
          </div>
      </div>

      <div className='flex flex-col flex-1 min-h-0 max-h-full'>
        <div className='max-w-[342px] sm:max-w-[1069px] bg-lpink rounded-t-[20px] border-1 border-black flex items-center px-6 sm:px-10 mx-auto w-full flex-shrink-0'>
          <div className='flex items-center justify-between w-full py-4'>
            <h3 className='text-md sm:text-2xl '>Hate List</h3>
            <button className='w-8 h-8 sm:w-10 sm:h-10 rounded-[10px] bg-black flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className='bg-white max-w-[342px] rounded-b-[20px] border-1 border-black flex flex-col sm:max-w-[1069px] flex-1 pt-2 sm:pt-4 px-4 mx-auto w-full overflow-y-auto min-h-0'>
          {hateList.map((hate, index) => (
            <div key={`${hate.id}-${index}`}        className="hate-item bg-yellow flex flex-col items-center justify-between sm:max-w-[1024px] w-full min-h-[98px] sm:min-h-[100px] border-1 border-black rounded-[20px] px-6 sm:px-10 my-2 mx-auto ">
              <div className='flex items-start sm:items-center flex-col sm:flex-row sm:justify-between w-full h-full pt-2 sm:pt-0'>
                <p className='text-md sm:text-xl pb-2'>{hate.name}</p>
                <div className='flex items-center gap-2 w-full sm:w-50 '>
                  <button 
                      className='bg-lblue text-black rounded-[14px] px-4 py-2 border w-full' onClick={handleOpenSetting} 
                    >Edit</button>

                        <button 
                          className='bg-dpink text-white rounded-[14px] px-4 py-2 border border-black w-full' 
                          
                        >
  Forgive
</button>

                </div>
              </div>
            </div>
          ))}
            
        </div>
      </div>
    </div>
    {
      isSettingOpen && (
        <SettingPopup
                isOpen={isSettingOpen}
                onClose={handleCloseSetting}
                onSave={handleSaveData}
                initialData={savedData}
            />
      )
    }
    </div>
  )
}

export default UserDetail