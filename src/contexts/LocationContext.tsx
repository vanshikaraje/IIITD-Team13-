import { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';

interface Coordinates {
  lat: number;
  lon: number;
}

interface LocationContextType {
  city: string | null;
  coordinates: Coordinates | null;
  isLoading: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [city, setCity] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start in a loading state

  // FIX: The entire location detection logic is now inside a single useEffect hook
  // with an empty dependency array [].
  // This GUARANTEES the code runs exactly once when the component first loads,
  // which permanently fixes the infinite loop and browser crash.
  useEffect(() => {
    if (!navigator.geolocation) {
      setIsLoading(false);
      setCity("Geolocation not supported");
      return; // Exit early if the browser doesn't support geolocation
    }

    // Ask for the user's position once.
    navigator.geolocation.getCurrentPosition(
      // Success callback: This runs when the user approves the location request.
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lon: longitude });

        try {
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          if (!response.ok) throw new Error('API request failed');
          const data = await response.json();
          setCity(data.city || data.principalSubdivision || 'Unknown Area');
        } catch (error) {
          console.error("Error fetching city name:", error);
          setCity('Location N/A');
        } finally {
          setIsLoading(false); // Stop loading, whether successful or not
        }
      },
      // Error callback: This runs if the user denies permission or an error occurs.
      (err) => {
        console.error("Geolocation error:", err.message);
        setCity("Location denied");
        setIsLoading(false);
      },
      { enableHighAccuracy: true }
    );
  }, []); // The empty array `[]` is the critical part that fixes the bug.

  // The value provided to the context only contains state.
  // There are no functions that other components can call to accidentally re-trigger detection.
  return (
    <LocationContext.Provider value={{ city, coordinates, isLoading }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
