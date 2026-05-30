import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyVictims } from '../api/victim.js'

function Home() {
  const navigate = useNavigate();
  const [victims, setVictims] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) return;
    setLoggedIn(true);
    (async () => {
      const res = await getMyVictims();
      // unwrap { success, data: { success, data: [...] } }
      const list = res?.data?.data ?? [];
      setVictims(Array.isArray(list) ? list : []);
    })();
  }, []);

  const hasVictims = victims.length > 0;
  const recent = hasVictims
    ? victims.reduce((a, b) => (b.id > a.id ? b : a))
    : null;
  const mostDeath = hasVictims
    ? victims.reduce((a, b) => (b.deathCount > a.deathCount ? b : a))
    : null;
  const mostHit = hasVictims
    ? victims.reduce((a, b) => (b.hitCount > a.hitCount ? b : a))
    : null;

  return (
      <div className="bg-[url('/images/background.jpg')] bg-cover bg-center min-h-screen flex flex-col">
        <div className='flex flex-col items-center justify-center min-h-screen gap-4 sm:gap-6 px-4 py-8'>
          <div className='flex flex-col items-center justify-center text-center'>
            <h1 className='text-[24px] xs:text-[28px] sm:text-[36px] md:text-[42px] lg:text-[50px] font-bold leading-tight'>WELCOME TO</h1>
            <h1 className='text-[24px] xs:text-[28px] sm:text-[36px] md:text-[42px] lg:text-[50px] font-bold leading-tight'>KRASOP SAI</h1>
          </div>
          <button className='bg-custom-mediumgradient px-4 py-4 md:px-12 md:py-6 lg:px-12 lg:py-6 rounded-[16px] sm:rounded-[20px] text-sm sm:text-base md:text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200'
                  onClick={() => navigate(loggedIn ? "/userDetail" : "/auth")}
          >START YOUR REVENGE!
          </button>

          {loggedIn && (
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mt-4'>
              {/* Recent victim */}
              <div className='bg-white/90 border-2 border-black rounded-[20px] p-5 text-center shadow-lg'>
                <p className='text-sm font-bold text-gray-500 mb-1'>RECENT VICTIM</p>
                {recent ? (
                  <p className='text-xl font-bold truncate'>{recent.name}</p>
                ) : (
                  <p className='text-base font-semibold text-dpink'>Wow you forgive already</p>
                )}
              </div>

              {/* Most death */}
              <div className='bg-white/90 border-2 border-black rounded-[20px] p-5 text-center shadow-lg'>
                <p className='text-sm font-bold text-gray-500 mb-1'>MOST DEATH</p>
                {mostDeath && mostDeath.deathCount > 0 ? (
                  <>
                    <p className='text-xl font-bold truncate'>{mostDeath.name}</p>
                    <p className='text-sm text-red-600'>{mostDeath.deathCount} deaths</p>
                  </>
                ) : (
                  <p className='text-base font-semibold text-gray-400'>No deaths yet</p>
                )}
              </div>

              {/* Most hit got */}
              <div className='bg-white/90 border-2 border-black rounded-[20px] p-5 text-center shadow-lg'>
                <p className='text-sm font-bold text-gray-500 mb-1'>MOST HIT GOT</p>
                {mostHit && mostHit.hitCount > 0 ? (
                  <>
                    <p className='text-xl font-bold truncate'>{mostHit.name}</p>
                    <p className='text-sm text-dblue'>{mostHit.hitCount} hits</p>
                  </>
                ) : (
                  <p className='text-base font-semibold text-gray-400'>No hits yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
  )
}

export default Home
