
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WatchLayout } from '../components/WatchLayout';
import { getAccessToken } from '../utils/fitbitAPI';
import { toast } from "@/hooks/use-toast";

const FitbitCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const processCallback = async () => {
      // Get the code from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      
      if (error) {
        setStatus('Authorization failed');
        toast({
          title: "Authorization Failed",
          description: "Could not connect to Fitbit.",
          variant: "destructive",
        });
        setTimeout(() => navigate('/weight'), 3000);
        return;
      }
      
      if (code) {
        // Exchange the code for an access token
        const token = await getAccessToken(code);
        
        if (token) {
          setStatus('Connected successfully!');
          toast({
            title: "Fitbit Connected",
            description: "Your Aria 2 scale is now linked.",
          });
          setTimeout(() => navigate('/weight'), 1500);
        } else {
          setStatus('Connection failed');
          toast({
            title: "Connection Failed",
            description: "Could not connect to your Fitbit account.",
            variant: "destructive",
          });
          setTimeout(() => navigate('/weight'), 3000);
        }
      } else {
        setStatus('Invalid callback');
        setTimeout(() => navigate('/weight'), 3000);
      }
    };
    
    processCallback();
  }, [navigate]);

  return (
    <WatchLayout>
      <div className="text-white h-full flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Fitbit Connection</h2>
          <p>{status}</p>
        </div>
      </div>
    </WatchLayout>
  );
};

export default FitbitCallback;
