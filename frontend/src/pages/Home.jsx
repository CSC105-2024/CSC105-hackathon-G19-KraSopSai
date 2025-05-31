import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate();
  return (
    <div className="bg-[url('/images/background.jpg')] bg-cover bg-center h-screen flex flex-col">
      <div className='flex flex-col items-center justify-center h-screen gap-8'>
        <div className='flex flex-col items-center justify-center'>
          <h1 className='text-[32px] sm:text-[50px]'>WELCOME TO</h1>
          <h1 className='text-[32px] sm:text-[50px]'>KRASOP SAI</h1>
        </div>
        <button className='bg-custom-mediumgradient 
         py-[26px] px-[160px] rounded-[20px]' onClick={()=>navigate("/auth")}>START YOUR REVENGE!</button>
      </div>
    </div>
  )
}

export default Home

//  const handleClick = () => {
//     navigate('/auth');
//   };