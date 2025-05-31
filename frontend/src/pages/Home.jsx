import React from 'react'
import {useNavigate} from 'react-router-dom'

function Home() {
  const navigate = useNavigate();
  return (
      <div className="bg-[url('/images/background.jpg')] bg-cover bg-center min-h-screen flex flex-col">
        <div className='flex flex-col items-center justify-center min-h-screen gap-4 sm:gap-6 px-4 py-8'>
          <div className='flex flex-col items-center justify-center text-center'>
            <h1 className='text-[24px] xs:text-[28px] sm:text-[36px] md:text-[42px] lg:text-[50px] font-bold leading-tight'>WELCOME TO</h1>
            <h1 className='text-[24px] xs:text-[28px] sm:text-[36px] md:text-[42px] lg:text-[50px] font-bold leading-tight'>KRASOP SAI</h1>
          </div>
          <button className='bg-custom-mediumgradient px-4 py-4 md:px-12 md:py-6 lg:px-12 lg:py-6 rounded-[16px] sm:rounded-[20px] text-sm sm:text-base md:text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200'
                  onClick={() => navigate("/auth")}
          >START YOUR REVENGE!
          </button>
        </div>
      </div>
  )
}

export default Home