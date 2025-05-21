
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WatchLayout } from '../components/WatchLayout';
import { FastingTimer } from '../components/FastingTimer';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Track touch start position
    let startX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const diffX = endX - startX;
      
      // If swipe distance is significant enough (50px)
      if (Math.abs(diffX) > 50) {
        if (diffX < 0) {
          // Swipe left - go to weight page
          navigate('/weight');
        } else if (diffX > 0) {
          // Swipe right - go to history page
          navigate('/history');
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
