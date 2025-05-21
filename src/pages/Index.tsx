
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WatchLayout } from '../components/WatchLayout';
import { FastingTimer } from '../components/FastingTimer';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Track touch start position
    let startX = 0;
    let startY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = endX - startX;
      const diffY = endY - startY;
      
      // If swipe distance is significant enough (50px)
      if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          // Swipe left - go to weight page
          navigate('/weight');
        } else if (diffX > 0) {
          // Swipe right - go to history page
          navigate('/history');
        }
      } else if (Math.abs(diffY) > 50 && Math.abs(diffY) > Math.abs(diffX)) {
        if (diffY < 0) {
          // Swipe up - go to calories page
          navigate('/calories');
        }
      }
    };
    
    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    
    // Clean up event listeners
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [navigate]);
  
  return (
    <WatchLayout>
      <FastingTimer />
    </WatchLayout>
  );
};

export default Index;
