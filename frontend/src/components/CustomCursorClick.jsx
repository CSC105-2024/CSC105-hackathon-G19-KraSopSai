import React, { use, useState } from 'react';

const CustomCursorClick = ({ 
  cursorImage1 = String,
  cursorImage2 = String,
  cursorImage3 = String,
  cursorImagecrit = String,
  displayDuration = Int,
  clickImageSize = Int,
  crit = boolean,
  className = "",
  children,
  onImageClick
}) => {
  const [clickImages, setClickImages] = useState([]);
  const [cursorImage,setcursorImage] = useState();
  const [hit,sethit] = useState('1');

  const handleClick = (e) => {

   
if(crit){
  setcursorImage(cursorImagecrit);
} else {
  if(hit == '1'){
    setcursorImage(cursorImage1);
    sethit('2');
  } else if(hit == '2'){  
    setcursorImage(cursorImage2);
    sethit('3');
  } else {  
    setcursorImage(cursorImage3);
    sethit('1');
  }
}

    const newImage = {
      id: Date.now(),
      src:cursorImage,
      x: e.clientX,
      y: e.clientY,
    };
    
    setClickImages(prev => [...prev, newImage]);
    
    if (onImageClick) {
      onImageClick({ x: e.clientX, y: e.clientY });
    }
    
    setTimeout(() => {
      setClickImages(prev => prev.filter(img => img.id !== newImage.id));
    }, displayDuration);
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        className="w-full h-full cursor-none"
        onClick={handleClick}
        style={{
          cursor: `url(${cursorImage}) 16 16, auto`
        }}
      >
        {children}
      </div>

      {/* Click images */}
      {clickImages.map((img) => (
        <img
          key={img.id}
          src={img.src}
          alt="Click effect"
          className="absolute pointer-events-none "
          style={{
            left: img.x - clickImageSize / 2,
            top: img.y - clickImageSize / 2,
            width: clickImageSize,
            height: clickImageSize,
            zIndex: 1000,
          }}
        />
      ))}
    </div>
  );
};

export { CustomCursorClick };