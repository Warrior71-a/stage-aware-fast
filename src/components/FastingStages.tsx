
import React from 'react';

interface FastingStagesProps {
  currentStage: number;
}

export const FastingStages: React.FC<FastingStagesProps> = ({ currentStage }) => {
  const stages = [
    {
      title: "Digesting & Storing",
      description: "Your body is processing your last meal, and insulin levels are elevated.",
      hours: "0-4 hours"
    },
    {
      title: "Blood Sugar Falling",
      description: "Insulin levels are declining. Your body will soon tap into glycogen for energy.",
      hours: "4-12 hours"
    },
    {
      title: "Fat Burning Begins",
      description: "Glycogen stores are depleting. Your body is starting to burn fat for fuel.",
      hours: "12-16 hours"
    },
    {
      title: "Ketosis & Cleanup",
      description: "Deeper fat burning is active. Autophagy, the cellular repair process, is beginning.",
      hours: "16-24 hours"
    },
    {
      title: "Deep Ketosis",
      description: "Fat burning is significant. Autophagy is ramping up, clearing out old cells.",
      hours: "24-36 hours"
    },
    {
      title: "Growth Hormone Boost",
      description: "HGH levels rise. Continued autophagy and immune cell regeneration.",
      hours: "36+ hours"
    }
  ];
  
  const currentStageData = stages[currentStage];
  
  return (
    <div className="bg-gray-800/60 rounded-xl p-3 w-full">
      <div className="mb-1 flex justify-between items-center">
        <h3 className="text-sm font-medium text-purple-400">
          {currentStageData.title}
        </h3>
        <span className="text-xs text-gray-400">
          {currentStageData.hours}
        </span>
      </div>
      <p className="text-xs text-gray-300 leading-tight">
        {currentStageData.description}
      </p>
    </div>
  );
};
