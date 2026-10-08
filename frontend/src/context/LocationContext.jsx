import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [coords, setCoords] = useState(() => {
    const saved = localStorage.getItem('foodie_coords');
    return saved ? JSON.parse(saved) : null;
  });
  const [locationName, setLocationName] = useState(() => {
    return localStorage.getItem('foodie_location_name') || '';
  });
  const [status, setStatus] = useState('prompt'); // 'prompt', 'locating', 'granted', 'denied', 'unavailable'
  const [errorMsg, setErrorMsg] = useState(null);

  // Reverse geocode real coordinates using OpenStreetMap Nominatim
  const reverseGeocode = async (lat, lon) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
        headers: { 'Accept-Language': 'en' }
      });
      if (res.ok) {
        const data = await res.json();
        const city = data.address?.city || data.address?.town || data.address?.suburb || data.address?.county || 'Current Location';
        const state = data.address?.state || '';
        const name = state ? `${city}, ${state}` : city;
        setLocationName(name);
        localStorage.setItem('foodie_location_name', name);
      }
    } catch (err) {
      console.warn("Reverse geocode failed:", err);
    }
  };

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('unavailable');
      setErrorMsg("Geolocation is not supported by your browser");
      return;
    }

    setStatus('locating');
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        setCoords(newCoords);
        setStatus('granted');
        localStorage.setItem('foodie_coords', JSON.stringify(newCoords));
        reverseGeocode(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setStatus('denied');
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMsg("📍 Location access was denied. Please allow location access or choose a location manually.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setErrorMsg("📍 Location information is unavailable right now. Please choose a location manually.");
        } else {
          setErrorMsg("📍 Location request timed out. Please try again or choose manually.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  const setManualLocation = (lat, lon, label) => {
    const manualCoords = {
      latitude: lat,
      longitude: lon,
      accuracy: 100,
      timestamp: Date.now(),
      isManual: true,
    };
    setCoords(manualCoords);
    setLocationName(label);
    setStatus('granted');
    localStorage.setItem('foodie_coords', JSON.stringify(manualCoords));
    localStorage.setItem('foodie_location_name', label);
  };

  // Try auto-request if already granted or has saved coords
  useEffect(() => {
    if (coords && coords.latitude && coords.longitude) {
      setStatus('granted');
      if (!locationName) {
        reverseGeocode(coords.latitude, coords.longitude);
      }
    } else {
      // Check permissions API if available
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          if (result.state === 'granted') {
            requestLocation();
          }
        }).catch(() => {});
      }
    }
  }, [requestLocation]);

  return (
    <LocationContext.Provider value={{
      coords,
      locationName,
      status,
      errorMsg,
      requestLocation,
      setManualLocation,
      hasLocation: !!coords && !!coords.latitude && !!coords.longitude,
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
