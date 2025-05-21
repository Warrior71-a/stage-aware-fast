
import React from 'react';

interface WatchLayoutProps {
  children: React.ReactNode;
}

export const WatchLayout = ({ children }: WatchLayoutProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="relative w-full max-w-[320px] h-[380px] rounded-[40px] bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden shadow-2xl border-4 border-gray-700">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-8 bg-gray-800 z-10 rounded-t-[36px]"></div>
        <div className="absolute top-[20px] w-[60px] h-[10px] left-1/2 -translate-x-1/2 bg-gray-700 z-10 rounded-full"></div>
        <div className="absolute top-0 bottom-0 right-0 w-6 bg-gray-800 z-10 flex flex-col items-center justify-center">
          <div className="w-3 h-16 rounded-full bg-gray-700 my-2"></div>
        </div>
        <div className="absolute inset-[26px] rounded-[30px] bg-black overflow-hidden">
          <div className="w-full h-full p-4 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
