
// Fitbit API integration 
const FITBIT_CLIENT_ID = "YOUR_FITBIT_CLIENT_ID"; // This should be obtained from Fitbit developer portal
const REDIRECT_URI = window.location.origin + "/fitbit-callback";
const FITBIT_AUTH_URL = "https://www.fitbit.com/oauth2/authorize";
const FITBIT_TOKEN_URL = "https://api.fitbit.com/oauth2/token";
const FITBIT_SCOPE = "weight"; // We only need weight data access

// Initialize Fitbit OAuth flow
export const initiateFitbitAuth = () => {
  const authUrl = `${FITBIT_AUTH_URL}?response_type=code&client_id=${FITBIT_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${FITBIT_SCOPE}`;
  
  // Open the Fitbit authorization page
  window.location.href = authUrl;
};

// Exchange authorization code for access token
export const getAccessToken = async (code: string): Promise<string | null> => {
  try {
    // In a real implementation, this should be done server-side to protect your client secret
    // For demonstration purposes, we're showing the flow client-side
    const response = await fetch(FITBIT_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${FITBIT_CLIENT_ID}:YOUR_CLIENT_SECRET`) // In production, this should be done server-side
      },
      body: new URLSearchParams({
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
      })
    });
    
    const data = await response.json();
    localStorage.setItem('fitbitToken', data.access_token);
    localStorage.setItem('fitbitRefreshToken', data.refresh_token);
    localStorage.setItem('fitbitTokenExpires', (Date.now() + (data.expires_in * 1000)).toString());
    
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

// Fetch weight data from Fitbit
export const fetchWeightData = async (token: string, period: string = '30d'): Promise<any[]> => {
  try {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    const response = await fetch(`https://api.fitbit.com/1/user/-/body/weight/date/${formattedDate}/${period}.json`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data && data.weight) {
      // Transform the data to match our app's format
      return data.weight.map((entry: any) => ({
        date: entry.dateTime.substring(5), // Format MM/DD from YYYY-MM-DD
        weight: entry.weight,
        change: 0 // We'll calculate this after
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching weight data:', error);
    return [];
  }
};

// Calculate changes between consecutive weight entries
export const calculateWeightChanges = (weightEntries: any[]): any[] => {
  if (weightEntries.length <= 1) return weightEntries;
  
  const results = [...weightEntries];
  
  for (let i = 1; i < results.length; i++) {
    results[i].change = results[i].weight - results[i-1].weight;
  }
  
  return results;
};

// Check if we have a valid token
export const hasValidToken = (): boolean => {
  const tokenExpires = localStorage.getItem('fitbitTokenExpires');
  return tokenExpires !== null && parseInt(tokenExpires) > Date.now();
};

// Get the stored token if valid
export const getStoredToken = (): string | null => {
  if (hasValidToken()) {
    return localStorage.getItem('fitbitToken');
  }
  return null;
};
