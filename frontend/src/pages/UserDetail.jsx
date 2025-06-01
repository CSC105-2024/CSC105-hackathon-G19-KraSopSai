import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Axios } from '../utils/axiosInstance.js'
import SettingPopup from '../components/SettingPopup.jsx'
import { createVictimAPI, getVictimbyUserId } from '../api/Victim.jsx';

function UserDetail() {
  const navigate = useNavigate();
  const [savedData, setSavedData] = useState(null);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);
  const [hateList, setHateList] = useState([]);

  // Get user data from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/auth');
      }
    } else {
      console.warn('No user data found in localStorage');
      navigate('/auth');
    }
  }, [navigate]);

  const handleOpenSetting = (victim = null) => {
    setSavedData(victim);
    setIsSettingOpen(true);
  };

  const handleCloseSetting = () => {
    setIsSettingOpen(false);
    setSavedData(null);
  };

  const handleSaveData = async (data) => {
    setSavedData(data);
    console.log('Saved data:', data);

    let _user = localStorage.getItem('user');
    _user = JSON.parse(_user);
    if (!_user || !_user.id) {
      return;
    }

    let newData = data;
    newData.userId = _user.id; // Ensure userId is set from localStorage
    await createVictimAPI(newData);

    // Refresh the hate list after saving
    fetchHateList();
  };

  const handleForgive = async (victimId) => {
    if (window.confirm('Are you sure you want to forgive this person?')) {
      try {
        // You'll need to implement this API call
        // await deleteVictim(victimId);
        console.log('Forgiving victim:', victimId);
        // Refresh the list after forgiving
        fetchHateList();
      } catch (error) {
        console.error('Error forgiving victim:', error);
      }
    }
  };

  // Logout function
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await Axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('authToken');
      setIsLoading(false);

      setShowLogoutSuccess(true);

      setTimeout(() => {
        setShowLogoutSuccess(false);
        navigate('/auth');
      }, 2000);
    }
  };

  // Memoize fetchHateList to prevent unnecessary re-renders
  const fetchHateList = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const response = await getVictimbyUserId(user.id);
      
      if (response.success) {
        setHateList(response.data?.data || []); // Adjust according to your API response structure
        console.log(response.data);
      } else {
        setHateList([]);
      }
    } catch (error) {
      console.error('Failed to fetch hate list:', error);
      setHateList([]);
    }
  }, [user?.id]);

  // Fixed useEffect with proper dependencies
  useEffect(() => {
    if (user && user.id) {
      fetchHateList();
    }
  }, [user, fetchHateList]);

  if (!user) {
    return (
        <div className="bg-[url('/images/background.jpg')] bg-cover bg-center h-screen flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
    );
  }

  return (
      <div className="bg-[url('/images/background.jpg')] bg-cover bg-center h-screen flex flex-col overflow-hidden">
        {/* Logout Success Notification */}
        {showLogoutSuccess && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Logged out successfully!</span>
            </div>
        )}

        <div className='pt-6 sm:pt-10 mx-10 sm:mx-20 flex flex-col flex-1 min-h-0'>
          <div className='flex justify-between items-center bg-custom-lightgradient w-full max-w-[346px] h-[83px] rounded-[20px] border-1 border-black sm:max-w-[1069px] sm:h-[100px] px-6 sm:px-10 mx-auto my-4 flex-shrink-0'>
            <h1 className='text-md sm:text-xl truncate pr-4'>
              {user.username || user.email || 'User'}
            </h1>
            <div>
              {/* Mobile logout button */}
              <button
                  className='flex sm:hidden bg-black rounded-[10px] w-10 h-10 items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50'
                  onClick={handleLogout}
                  disabled={isLoading}
                  title="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 12H10.5M18 15L21 12L18 9M13 7V6C13 5.46957 12.7893 4.96086 12.4142 4.58579C12.0391 4.21071 11.5304 4 11 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H11C11.5304 20 12.0391 19.7893 12.4142 19.4142C12.7893 19.0391 13 18.5304 13 18V17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Desktop logout button */}
              <button
                  className='hidden sm:block bg-black text-white rounded-[14px] px-4 py-2 hover:bg-gray-800 transition-colors disabled:opacity-50'
                  onClick={handleLogout}
                  disabled={isLoading}
              >
                {isLoading ? 'LOGGING OUT...' : 'LOGOUT'}
              </button>
            </div>
          </div>

          <div className='flex flex-col flex-1 min-h-0 max-h-full'>
            <div className='max-w-[342px] sm:max-w-[1069px] bg-lpink rounded-t-[20px] border-1 border-black flex items-center px-6 sm:px-10 mx-auto w-full flex-shrink-0'>
              <div className='flex items-center justify-between w-full py-4'>
                <h3 className='text-md sm:text-2xl'>Hate List</h3>
                <button 
                  className='w-8 h-8 sm:w-10 sm:h-10 rounded-[10px] bg-black flex items-center justify-center hover:bg-gray-800 transition-colors'
                  onClick={() => handleOpenSetting()}
                  title="Add new victim"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className='bg-white max-w-[342px] rounded-b-[20px] border-1 border-black flex flex-col sm:max-w-[1069px] flex-1 pt-2 sm:pt-4 px-4 mx-auto w-full overflow-y-auto min-h-0'>
              {hateList.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  <p>No victims in your hate list yet.</p>
                </div>
              ) : (
                hateList.map((victim, index) => (
                  <div key={`${victim.id}-${index}`} className="hate-item bg-yellow flex flex-col items-center justify-between sm:max-w-[1024px] w-full min-h-[98px] sm:min-h-[100px] border-1 border-black rounded-[20px] px-6 sm:px-10 my-2 mx-auto">
                    <div className='flex items-start sm:items-center flex-col sm:flex-row sm:justify-between w-full h-full pt-2 sm:pt-0'>
                      <div className='flex flex-col'>
                        <p className='text-md sm:text-xl pb-1 font-semibold'>{victim.name || 'Unnamed Victim'}</p>
                        {victim.reason && (
                          <p className='text-sm text-gray-600 pb-2'>Reason: {victim.reason}</p>
                        )}
                        {/* {victim.hp !== undefined && (
                          <p className='text-sm text-red-600'>HP: {victim.hp}</p>
                        )} */}
                      </div>
                      <div className='flex items-center gap-2 w-full sm:w-50'>
                        <button
                            className='bg-lblue text-black rounded-[14px] px-4 py-2 border w-full hover:bg-blue-200 transition-colors'
                            onClick={() => handleOpenSetting(victim)}
                        >
                          Edit
                        </button>
                        <button
                            className='bg-dpink text-white rounded-[14px] px-4 py-2 border border-black w-full hover:bg-pink-600 transition-colors'
                            onClick={() => handleForgive(victim.id)}
                        >
                          Forgive
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {isSettingOpen && (
            <SettingPopup
                isOpen={isSettingOpen}
                onClose={handleCloseSetting}
                onSave={handleSaveData}
                initialData={savedData}
            />
        )}
      </div>
  )
}

export default UserDetail