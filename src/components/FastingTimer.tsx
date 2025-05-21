
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { FastingStages } from './FastingStages';
import { formatTime } from '../utils/timeUtils';
import { toast } from 'sonner';

export const FastingTimer = () => {
  const [isFasting, setIsFasting] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const navigate = useNavigate();
  
  // Check if a fast was in progress
  useEffect(() => {
    const storedStartTime = localStorage.getItem('fastingStartTime');
    const storedFasting = localStorage.getItem('isFasting');
    
    if (storedStartTime && storedFasting === 'true') {
      const startTimeNum = parseInt(storedStartTime, 10);
      setStartTime(startTimeNum);
      setIsFasting(true);
    }
  }, []);
  
  // Update timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isFasting && startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        setElapsedTime(elapsed);
        
        // Update stage based on elapsed time
        if (elapsed < 4 * 3600) { // 0-4 hours
          setCurrentStage(0);
        } else if (elapsed < 12 * 3600) { // 4-12 hours
          setCurrentStage(1);
        } else if (elapsed < 16 * 3600) { // 12-16 hours
          setCurrentStage(2);
        } else if (elapsed < 24 * 3600) { // 16-24 hours
          setCurrentStage(3);
        } else if (elapsed < 36 * 3600) { // 24-36 hours
          setCurrentStage(4);
        } else { // 36+ hours
          setCurrentStage(5);
        }
        
        // Notify on stage change
        if (elapsed === 4 * 3600 || elapsed === 12 * 3600 || 
            elapsed === 16 * 3600 || elapsed === 24 * 3600 || 
            elapsed === 36 * 3600) {
          toast("Fasting milestone reached!", {
            description: `You've entered a new fasting stage!`
          });
        }
        
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFasting, startTime]);
  
  // Save state to localStorage when changed
  useEffect(() => {
    if (isFasting && startTime) {
      localStorage.setItem('fastingStartTime', startTime.toString());
      localStorage.setItem('isFasting', 'true');
    } else {
      localStorage.removeItem('fastingStartTime');
      localStorage.setItem('isFasting', 'false');
    }
  }, [isFasting, startTime]);
  
  const toggleFasting = () => {
    if (!isFasting) {
      // Start fasting
      const now = Date.now();
      setStartTime(now);
      setIsFasting(true);
      toast("Fasting started");
      
      // Save to history when starting
      const newFast = {
        startTime: now,
        date: new Date().toLocaleDateString()
      };
      
      const historyString = localStorage.getItem('fastingHistory');
      const history = historyString ? JSON.parse(historyString) : [];
      localStorage.setItem('fastingHistory', JSON.stringify([...history, newFast]));
    } else {
      // End fasting
      if (startTime) {
        const duration = Math.floor((Date.now() - startTime) / 1000);
        
        // Update last fast with end time and duration
        const historyString = localStorage.getItem('fastingHistory');
        if (historyString) {
          const history = JSON.parse(historyString);
          if (history.length > 0) {
            const lastFast = history[history.length - 1];
            lastFast.endTime = Date.now();
            lastFast.duration = duration;
            history[history.length - 1] = lastFast;
            localStorage.setItem('fastingHistory', JSON.stringify(history));
          }
        }
        
        toast("Fasting completed!", {
          description: `You fasted for ${formatTime(duration)}`
        });
      }
      
      setIsFasting(false);
      setStartTime(null);
      setElapsedTime(0);
      setCurrentStage(0);
    }
  };
  
  const viewHistory = () => {
    navigate('/history');
  };
  
  // Calculate progress for 16-hour goal (common IF goal)
  const targetHours = 16;
  const targetSeconds = targetHours * 3600;
  const progressPercentage = Math.min(100, (elapsedTime / targetSeconds) * 100);
  
  return (
    <div className="flex flex-col items-center text-white">
      <h1 className="text-xl font-bold text-center mb-2">FastTrack</h1>
      
      {/* Timer Display */}
      <div className="relative w-40 h-40 mb-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle 
              cx="80" 
              cy="80" 
              r="70" 
              fill="transparent" 
              stroke="#333" 
              strokeWidth="8"
            />
            <circle 
              cx="80" 
              cy="80" 
              r="70" 
              fill="transparent" 
              stroke="#9b87f5" 
              strokeWidth="8"
              strokeDasharray="439.6"
              strokeDashoffset={439.6 - (439.6 * progressPercentage / 100)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <div className="text-2xl font-bold">{formatTime(elapsedTime)}</div>
            {isFasting && (
              <div className="text-xs text-gray-300">
                {Math.floor(progressPercentage)}% of {targetHours}h
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Current Stage */}
      <FastingStages currentStage={currentStage} />
      
      {/* Controls */}
      <div className="mt-4 flex gap-2 w-full">
        <button
          className={`flex-1 py-3 px-4 rounded-full font-medium text-sm flex items-center justify-center gap-2 ${
            isFasting 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-purple-600 hover:bg-purple-700"
          }`}
          onClick={toggleFasting}
        >
          <Clock className="w-4 h-4" />
          {isFasting ? "End Fast" : "Start Fast"}
        </button>
        
        <button
          className="py-3 px-4 rounded-full font-medium text-sm bg-gray-800 hover:bg-gray-700"
          onClick={viewHistory}
        >
          History
        </button>
      </div>
    </div>
  );
};
