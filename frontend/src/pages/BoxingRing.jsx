import React, { useState, useEffect } from 'react';
import { CustomCursorClick } from '../components/CustomCursorClick';
import { CustomCursorImage } from '../components/CustomCursorImage';
import { Link , useSearchParams,useNavigate } from "react-router-dom";
import { getVictimbyId } from '../api/Victim';

const BoxingRing = () => {

  const [searchParams, setSearchParams] = useSearchParams();
   const navigate = useNavigate();
   const Id = searchParams.get('id');


   useEffect(() => {
    if (!Id) {
      setVictim(null);
      return;
    }

    const fetchVictim = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await getVictimbyId(Id);
        
        if (result.response.success) {
          setVictim(result.response.data);
        } else {
          setError('Failed to fetch victim data');
        }
      } catch (err) {
        setError('An error occurred while fetching data');
        console.error('Error fetching victim:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVictim();
  }, [Id]);

  const [Victim,setVictim] = useState({
    name : "bruh",
    reason : "bruh",
    hp : 300
  });
  const [isClicked, setIsClicked] = useState(false);
  const BG = [
    "./images/BG-sun.jpg",
    "./images/dinner.jpg",
    "./images/night.jpg"
  ];
  const Face = [
    "./images/sigmaface.jpg",
    "./images/ooface.jpg",
    "./images/stupidface.jpg",
    "./images/ahface.jpg"
  ]
  const [FaceImage,setFaceImage] = useState();
  const [hp, setHp] = useState(300);
  const [maxhp , setMaxhp] = useState(300);
  const [currentFace, setCurrentFace] = useState(Face[0]);
  const [currentBG,setcurrentBG] = useState(BG[0]);
  const [face,setface] = useState('./images/blood0.PNG')
  const [popupMessage, setPopupMessage] = useState([{
    id:Number,
    msg:String,
    x:Number,
    y:Number
  }]);
  const [weaponopen,setweaponopen] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const [currentEffect,setcurremntEffect] = useState();
  const [hitcrit,sethitcrit] = useState(false);
  const [messages,setmessage] = useState([]);
   const healthPercentage = Math.max(0, (hp / maxhp) * 100);


  const weapons = [
    { id:1,
      name:"PunchingGlove",
      WeaponImage:"./images/punch.PNG",
      Effect1:"./images/punch1.PNG",
      Effect2:"./images/punch2.PNG",
      Effect3:"./images/punch3.PNG",
      EffectCrit:"./images/critpunch.PNG"},
      { id:2,
      name:"Katana",
      WeaponImage:"./images/katana.PNG",
      Effect1:"./images/katana1.PNG",
      Effect2:"./images/katana2.PNG",
      Effect3:"./images/katana3.PNG",
      EffectCrit:"./images/katanacrit.PNG"}
  ] 
  const [weapon, setWeapon] = useState(weapons[0].id);

  

  

  const toggleWeapon = () =>{
    if(!weaponopen){
      setweaponopen(true);
    }else{
      setweaponopen(false);
    }
  }

  const handleCircleClick = (e) => {

    setCurrentFace(Face[3]);
    setIsClicked(true)
  
    const randomMessage = messages[Math.floor(Math.round(Math.random() * messages.length))];
    const rect = e.currentTarget.getBoundingClientRect();
    const randomX = Math.random() * (window.innerWidth);
    const randomY = Math.random()*300 +350;

     const newPopup = {
      id: Date.now() + Math.random(), // Unique ID
      msg: randomMessage,
      x: randomX,
      y: randomY
    };
 
    if(popupMessage.length > 20){
      popupMessage.shift();
      setPopupMessage(prev => [...prev, newPopup]);
    }else{
      setPopupMessage(prev => [...prev, newPopup]);
    }

    setTimeout(() => {
      setPopupMessage(prev => prev.filter(popup => popup.id !== newPopup.id));
    }, 5000);

    setTimeout(() => {
      setIsClicked(false)
    }, 200);

    setShowPopup(true);
    const crit = Math.round(Math.random()*10)
    if(crit <= 1){
      setHp(prev => Math.max(0, prev - 10));
      sethitcrit(true);
    }else{
      setHp(prev => Math.max(0, prev - 1));
      sethitcrit(false);
    }
     setTimeout(() => {
    if(healthPercentage > 60){
      setCurrentFace(Face[0]);
      setcurrentBG(BG[0])
    }else if(healthPercentage > 30){
      setCurrentFace(Face[1]);
      setcurrentBG(BG[1])
      setface('./images/blood2.PNG')
    }else{
      setCurrentFace(Face[2]);
      setcurrentBG(BG[2])
      setface('./images/blood1.PNG')
    }
    }, 200);
  };

  const handleWeaponChange = (e) => {
    setWeapon(parseInt(e.target.value));
    console.log('Selected weapon ID:', e.target.value);
  };

  const currentWeapon = weapons.find(w => w.id === weapon);

  const getHealthColor = () => {
    if (healthPercentage > 60) return 'bg-green-400';
    if (healthPercentage > 30) return 'bg-yellow-400';
    return 'bg-red-500';
  };

  return (
    <div >
      
    <CustomCursorClick 
      cursorImage1={currentWeapon.Effect1}
      cursorImage2={currentWeapon.Effect2}
      cursorImage3={currentWeapon.Effect3}
      cursorImagecrit={currentWeapon.EffectCrit}
      displayDuration={500}
      clickImageSize={300}
      crit={hitcrit}
      onImageClick={(position) => console.log('Clicked at:', position)
      }
    >
    <div >
      <img className=' duration-5000 transition object-cover h-screen lg:w-screen overflow-hidden' src={currentBG}></img>
      <div className="absolute bg-black top-0 flex flex-row w-screen  justify-between items-center z-10">
        <div className="bg-black text-green-400 px-4 py-2 rounded font-mono text-lg font-bold h-20">
          <div className='hidden md:block text- mt-4 ml-5'>HP = {hp}</div>
        </div>
        <div className="flex gap-2">
          <button className='text-white font-bold w-35 bg-gray-500 rounded' onClick={toggleWeapon}>
            <div className="">
      
      <select
        id="Weapon"
        value={weapon}
        className="w-full p-2 border-1 rounded bg-gray-400"
        onChange={handleWeaponChange}
      >
        {weapons.map(weaponItem => (
          <option key={weaponItem.id} value={weaponItem.id}>
            {weaponItem.name}
          </option>
        ))}
      </select>
    </div>
          </button>
          <button className="md:hidden bg-custom-lightgradient text-black font-bold text-xl px-4 py-2 rounded hover:bg-white">
            Edit
          </button>
          <button className="hidden md:block bg-custom-lightgradient text-black font-bold text-xl px-4 py-2 rounded hover:bg-white">
            Edit this guy
          </button>
          <button className="bg-gray-600 text-white text-xl px-4 py-2 rounded mr-3 hover:bg-gray-700">
            Back
          </button>
        </div>
      </div>
      <CustomCursorImage
       cursorImage = {currentWeapon.WeaponImage} 
       cursorSize = {100}/>
      
      <div>
      <div className="absolute top-50 left-1/2 transform -translate-x-1/2 text-white text-3xl font-bold text-center drop-shadow-lg shadow-black
      w-80 md:w-120">
        <div className=' break-words mb-2'>Duck you ass hole</div>
        <div className='bg-black border-2 border-black rounded-2xl shadow-2xl'>
          <div className={`h-10 rounded-2xl transition-all duration-300 ease-out ${getHealthColor()}`}
          style={{ width: `${healthPercentage}%` }}><div>{/*HP*/}</div>
          </div>
        </div>
      </div>
      <div 
        className="absolute top-6/10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-100
      "
        onClick={handleCircleClick}
      >
    
        <div className={`mt-5 bg-white rounded-full border-4 border-black relative ${
          isClicked ? 'w-90 h-50 shadow-2xl shadow-red-500' : 'w-70 h-70 shadow-xl'
        }`}>
          <img className={`rounded-full  ${isClicked ? ' w-90 h-50 object-fill' : 'w-70 h-70 object-cover'}`} src={currentFace}></img>
          <div className="absolute inset-0 rounded-full items-center justify-center">
            <img className={`${isClicked ? 'rounded-full shadow-2xl w-90 h-50' : 'w-70 h-70'}`} src={face}></img>
          </div>
        </div>
      </div>
      </div>

      {showPopup && (
      <div>  
        {popupMessage.map((box)=>(
          <div 
          key={box.id}
          className="absolute border-1 bg-white text-black px-4 py-2 rounded-lg font-bold text-lg shadow-lg z-20 pointer-events-none"
          style={{
            left: `${box.x}px`,
            top: `${box.y}px`,
          }}
        >
          {box.msg}
        </div>
        ))}
      </div> 
      )}
    </div>
    </CustomCursorClick>
    </div>
  );
};

export default BoxingRing