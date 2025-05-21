
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WatchLayout } from '../components/WatchLayout';
import { ArrowLeft, ArrowUp, ArrowDown, Plus, Pizza } from 'lucide-react';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Line } from 'recharts';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

// Define the type for a calorie record
interface CalorieRecord {
  date: string;
  calories: number;
  target: number;
  change: number; // Positive when over target, negative when under target
}

const Calories = () => {
  const navigate = useNavigate();
  const [calorieData, setCalorieData] = useState<CalorieRecord[]>([]);
  const [newCalories, setNewCalories] = useState('');
  const [calorieTarget, setCalorieTarget] = useState<number>(2000);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Fetch or initialize calorie data
  useEffect(() => {
    const storedData = localStorage.getItem('calorieHistory');
    const storedTarget = localStorage.getItem('calorieTarget');
    
    if (storedTarget) {
      setCalorieTarget(parseInt(storedTarget));
    }
    
    if (storedData) {
      setCalorieData(JSON.parse(storedData));
    } else {
      // Sample data if no history exists
      const today = new Date();
      const sampleData: CalorieRecord[] = [
        { date: formatDate(new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)), calories: 2100, target: 2000, change: 100 },
        { date: formatDate(new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000)), calories: 1950, target: 2000, change: -50 },
        { date: formatDate(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)), calories: 2200, target: 2000, change: 200 },
        { date: formatDate(new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)), calories: 1800, target: 2000, change: -200 },
        { date: formatDate(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)), calories: 1900, target: 2000, change: -100 },
      ];
      setCalorieData(sampleData);
      localStorage.setItem('calorieHistory', JSON.stringify(sampleData));
    }
  }, []);
  
  const formatDate = (date: Date): string => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}/${day}`;
  };
  
  const goBack = () => {
    navigate('/');
  };
  
  const updateTarget = () => {
    const newTarget = parseInt(prompt("Enter your daily calorie target:", calorieTarget.toString()) || calorieTarget.toString());
    if (newTarget > 0 && newTarget <= 10000) {
      setCalorieTarget(newTarget);
      localStorage.setItem('calorieTarget', newTarget.toString());
      toast({
        title: "Calorie Target Updated",
        description: `Your daily target is now ${newTarget} calories.`,
      });
    }
  };
  
  const addCalorieEntry = () => {
    const calories = parseInt(newCalories);
    
    if (isNaN(calories) || calories <= 0) {
      toast({
        title: "Invalid Entry",
        description: "Please enter a valid calorie amount.",
        variant: "destructive",
      });
      return;
    }
    
    const today = formatDate(new Date());
    const change = calories - calorieTarget;
    
    // Check if we already have an entry for today
    const existingEntryIndex = calorieData.findIndex(record => record.date === today);
    
    let newData: CalorieRecord[];
    if (existingEntryIndex >= 0) {
      // Update existing entry
      newData = [...calorieData];
      newData[existingEntryIndex] = {
        ...newData[existingEntryIndex],
        calories: calories,
        target: calorieTarget,
        change: change
      };
    } else {
      // Create new entry
      const newEntry: CalorieRecord = {
        date: today,
        calories: calories,
        target: calorieTarget,
        change: change
      };
      newData = [...calorieData, newEntry];
    }
    
    setCalorieData(newData);
    localStorage.setItem('calorieHistory', JSON.stringify(newData));
    setNewCalories('');
    setShowAddForm(false);
    
    toast({
      title: "Calories Added",
      description: `${calories} calories recorded for today.`,
    });
  };
  
  // Calculate daily average
  const averageCalories = calorieData.length > 0 
    ? Math.round(calorieData.reduce((sum, record) => sum + record.calories, 0) / calorieData.length) 
    : 0;
  
  // Get the latest entry
  const latestEntry = calorieData.length > 0 ? calorieData[calorieData.length - 1] : null;
  
  const chartConfig = {
    gain: { color: "#ea384c" },
    loss: { color: "#4ADE80" },
    neutral: { color: "#94A3B8" }
  };

  return (
    <WatchLayout>
      <div className="text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <button 
              onClick={goBack}
              className="p-1.5 mr-2 rounded-full bg-gray-800 hover:bg-gray-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <h2 className="text-lg font-semibold">Calorie Tracker</h2>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-1.5 rounded-full bg-blue-700 hover:bg-blue-600"
            title="Add calories"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        
        {showAddForm ? (
          <div className="mb-3 bg-gray-800/60 rounded-lg p-2">
            <div className="flex gap-2 mb-2">
              <Input
                type="number"
                placeholder="Enter calories"
                className="h-8 bg-gray-900 text-white border-gray-700"
                value={newCalories}
                onChange={(e) => setNewCalories(e.target.value)}
              />
              <Button 
                className="h-8 px-2 py-0 bg-green-600 hover:bg-green-700"
                onClick={addCalorieEntry}
              >
                Add
              </Button>
            </div>
          </div>
        ) : null}
        
        {/* Daily target and average */}
        <div className="mb-3 flex items-end justify-between">
          <div>
            <div className="text-xs text-gray-400">Daily target</div>
            <div 
              className="text-2xl font-bold cursor-pointer hover:text-blue-300"
              onClick={updateTarget}
              title="Click to change target"
            >
              {calorieTarget}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Avg intake</div>
            <div className="text-lg font-medium">
              {averageCalories}
              <span className="text-xs ml-1 text-gray-400">cal</span>
            </div>
          </div>
        </div>
        
        {/* Latest entry */}
        {latestEntry && (
          <div className="mb-3 bg-gray-800/60 rounded-lg p-2 flex justify-between items-center">
            <div className="flex items-center">
              <Pizza className="w-4 h-4 mr-1.5 text-orange-400" />
              <div>
                <div className="text-xs text-gray-400">Latest ({latestEntry.date})</div>
                <div className="font-medium">{latestEntry.calories} calories</div>
              </div>
            </div>
            {latestEntry.change !== 0 && (
              <div className="flex items-center">
                {latestEntry.change < 0 ? (
                  <>
                    <ArrowDown className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400 text-sm ml-0.5">
                      {Math.abs(latestEntry.change)}
                    </span>
                  </>
                ) : (
                  <>
                    <ArrowUp className="w-3.5 h-3.5 text-red-500" />
                    <span className="text-red-500 text-sm ml-0.5">
                      {latestEntry.change}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Calorie chart */}
        <div className="bg-gray-800/60 rounded-lg p-2 h-[150px] mb-2">
          {calorieData.length > 0 && (
            <ChartContainer 
              className="h-full w-full"
              config={chartConfig}
            >
              <Line
                data={calorieData}
                dataKey="calories"
                type="monotone"
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
          {calorieData.slice(-3).reverse().map((record, index) => (
            <div key={index} className="bg-gray-800/60 rounded-lg p-2 flex justify-between items-center">
              <div>
                <div className="text-xs text-gray-400">{record.date}</div>
                <div className="font-medium">{record.calories} calories</div>
              </div>
              <div className="flex items-center">
                {record.change < 0 ? (
                  <>
                    <ArrowDown className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400 text-sm ml-0.5">{Math.abs(record.change)}</span>
                  </>
                ) : (
                  <>
                    <ArrowUp className="w-3.5 h-3.5 text-red-500" />
                    <span className="text-red-500 text-sm ml-0.5">{record.change}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </WatchLayout>
  );
};

export default Calories;
