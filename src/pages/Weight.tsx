
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WatchLayout } from '../components/WatchLayout';
import { ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Line } from 'recharts';

// Define the type for a weight record
interface WeightRecord {
  date: string;
  weight: number;
  change: number; // Positive for gain, negative for loss
}

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const Weight = () => {
  const navigate = useNavigate();
  const [weightData, setWeightData] = useState<WeightRecord[]>([]);
  
  // Fetch or initialize weight data
  useEffect(() => {
    const storedData = localStorage.getItem('weightHistory');
    if (storedData) {
      setWeightData(JSON.parse(storedData));
    } else {
      // Sample data if no history exists
      const sampleData: WeightRecord[] = [
        { date: '05/16', weight: 165, change: 0 },
        { date: '05/17', weight: 164.5, change: -0.5 },
        { date: '05/18', weight: 165.2, change: 0.7 },
        { date: '05/19', weight: 164.8, change: -0.4 },
        { date: '05/20', weight: 164.2, change: -0.6 },
        { date: '05/21', weight: 164.0, change: -0.2 },
      ];
      setWeightData(sampleData);
      localStorage.setItem('weightHistory', JSON.stringify(sampleData));
    }
  }, []);

  const goBack = () => {
    navigate('/');
  };
  
  // Calculate the total weight change
  const totalChange = weightData.length > 1 
    ? weightData[weightData.length - 1].weight - weightData[0].weight 
    : 0;
  
  // Format the weight with one decimal place
  const formatWeight = (weight: number) => {
    return weight.toFixed(1);
  };
  
  const chartConfig = {
    gain: { color: "#ea384c" },
    loss: { color: "#4ADE80" },
    neutral: { color: "#94A3B8" }
  };

  return (
    <WatchLayout>
      <div className="text-white">
        <div className="flex items-center mb-3">
          <button 
            onClick={goBack}
            className="p-1.5 mr-2 rounded-full bg-gray-800 hover:bg-gray-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <h2 className="text-lg font-semibold">Weight Tracker</h2>
        </div>
        
        {/* Current weight and change indicator */}
        {weightData.length > 0 && (
          <div className="mb-3 flex items-end justify-between">
            <div>
              <div className="text-xs text-gray-400">Current</div>
              <div className="text-2xl font-bold">{formatWeight(weightData[weightData.length - 1].weight)}</div>
            </div>
            <div className="flex items-center">
              {totalChange < 0 ? (
                <>
                  <ArrowDown className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium ml-1">{Math.abs(totalChange).toFixed(1)}</span>
                </>
              ) : totalChange > 0 ? (
                <>
                  <ArrowUp className="w-4 h-4 text-red-500" />
                  <span className="text-red-500 font-medium ml-1">{totalChange.toFixed(1)}</span>
                </>
              ) : (
                <span className="text-gray-400 text-sm">No change</span>
              )}
            </div>
          </div>
        )}
        
        {/* Weight chart */}
        <div className="bg-gray-800/60 rounded-lg p-2 h-[160px] mb-2">
          {weightData.length > 0 && (
            <ChartContainer 
              className="h-full w-full"
              config={chartConfig}
            >
              <Line
                data={weightData}
                dataKey="weight"
                xAxisDataKey="date"
                stroke="#94A3B8"
                strokeWidth={2}
                dot={{
                  r: 4,
                  strokeWidth: 2,
                  fill: "#1E293B",
                  stroke: "#94A3B8"
                }}
                activeDot={{
                  r: 6,
                  fill: "#94A3B8",
                }}
              >
                <ChartTooltip />
              </Line>
            </ChartContainer>
          )}
        </div>
        
        {/* Recent entries */}
        <div className="space-y-2 max-h-[80px] overflow-y-auto pr-1">
          {weightData.slice(-3).reverse().map((record, index) => (
            <div key={index} className="bg-gray-800/60 rounded-lg p-2 flex justify-between items-center">
              <div>
                <div className="text-xs text-gray-400">{record.date}</div>
                <div className="font-medium">{formatWeight(record.weight)}</div>
              </div>
              {record.change !== 0 && (
                <div className="flex items-center">
                  {record.change < 0 ? (
                    <>
                      <ArrowDown className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400 text-sm ml-0.5">{Math.abs(record.change).toFixed(1)}</span>
                    </>
                  ) : (
                    <>
                      <ArrowUp className="w-3.5 h-3.5 text-red-500" />
                      <span className="text-red-500 text-sm ml-0.5">{record.change.toFixed(1)}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </WatchLayout>
  );
};

export default Weight;
