
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WatchLayout } from '../components/WatchLayout';
import { ArrowLeft } from 'lucide-react';
import { formatTime } from '../utils/timeUtils';

interface FastingSession {
  startTime: number;
  endTime?: number;
  duration?: number;
  date: string;
}

const History = () => {
  const [history, setHistory] = useState<FastingSession[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const historyString = localStorage.getItem('fastingHistory');
    if (historyString) {
      const parsedHistory = JSON.parse(historyString);
      // Sort by start time, most recent first
      parsedHistory.sort((a: FastingSession, b: FastingSession) => b.startTime - a.startTime);
      setHistory(parsedHistory);
    }
  }, []);
  
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
          // Swipe right - go to main page
          navigate('/');
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
  
  const goBack = () => {
    navigate('/');
  };
  
  return (
    <WatchLayout>
      <div className="text-white">
        <div className="flex items-center mb-4">
          <button 
            onClick={goBack}
            className="p-2 mr-2 rounded-full bg-gray-800 hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-lg font-semibold">Fasting History</h2>
        </div>
        
        <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
          {history.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-4">
              No fasting sessions recorded yet
            </div>
          ) : (
            history.map((session, index) => (
              <div key={index} className="bg-gray-800/60 rounded-lg p-3">
                <div className="text-xs text-gray-400">{session.date}</div>
                <div className="font-medium text-sm">
                  {session.duration 
                    ? formatTime(session.duration)
                    : "In Progress"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </WatchLayout>
  );
};

export default History;
