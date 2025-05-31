import React, { useState, useEffect } from 'react';

const CustomCursorImage = ({ 
  cursorImage = String, 
  cursorSize = Int,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  },[]);

  return (
    <>
      {/* Hide default cursor */}
      <style jsx>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Custom cursor */}
      <div
        className={`fixed pointer-events-none z-50 transition-transform duration-100 ${
          isClicking ? 'scale-75' : 'scale-100'
        }`}
        style={{
          left: mousePosition.x - cursorSize / 2,
          top: mousePosition.y - cursorSize / 2,
          transform: `translate(-20%, -30%) scale(${isClicking ? 0.8 : 1})`,
        }}
      >
        {/* Cursor Image or Default Star */}
        {cursorImage ? (
          <img 
            src={cursorImage} 
            alt="cursor" 
            className="w-full h-full object-contain"
            style={{ width: cursorSize, height: cursorSize }}
          />
        ) : (
          <div className="relative" style={{ width: cursorSize, height: cursorSize }}>
          </div>
        )}
      </div>
    </>
  );
};

export {CustomCursorImage};