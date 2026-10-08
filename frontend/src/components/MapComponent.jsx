import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Custom SVG Icons for Leaflet markers
const createCustomIcon = (bgColor, iconChar) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${bgColor};
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      ">
        <span style="
          transform: rotate(45deg);
          font-size: 16px;
          line-height: 1;
        ">${iconChar}</span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

const userIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="
      background-color: #3b82f6;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 15px rgba(59, 130, 246, 0.8);
      position: relative;
    ">
      <div style="
        position: absolute;
        top: -6px;
        left: -6px;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background-color: rgba(59, 130, 246, 0.3);
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Auto-adjust bounds when listings or user position change
const MapUpdater = ({ center, listings, userCoords }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (listings && listings.length > 0) {
      const bounds = L.latLngBounds(listings.map(l => [l.latitude, l.longitude]));
      if (userCoords && userCoords.latitude) {
        bounds.extend([userCoords.latitude, userCoords.longitude]);
      }
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } else if (center) {
      map.setView(center, 13);
    }
  }, [center, listings, userCoords, map]);

  return null;
};

const MapComponent = ({ listings = [], userCoords = null, height = '450px' }) => {
  // Default center if no coordinates (e.g. Bangalore center, or fallback)
  const defaultCenter = [12.9716, 77.5946];
  const center = userCoords && userCoords.latitude && userCoords.longitude
    ? [userCoords.latitude, userCoords.longitude]
    : (listings.length > 0 ? [listings[0].latitude, listings[0].longitude] : defaultCenter);

  return (
    <div style={{ height, width: '100%' }} className="relative rounded-3xl overflow-hidden shadow-lg border border-[#e2d9cd]">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater center={center} listings={listings} userCoords={userCoords} />

        {/* User Current Location Marker */}
        {userCoords && userCoords.latitude && (
          <>
            <Marker position={[userCoords.latitude, userCoords.longitude]} icon={userIcon}>
              <Popup>
                <div className="p-1 text-xs">
                  <p className="font-bold text-[#1e293b]">📍 You Are Here</p>
                  <p className="text-[#64748b]">Real device GPS location</p>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={[userCoords.latitude, userCoords.longitude]}
              radius={userCoords.accuracy || 150}
              pathOptions={{ fillColor: '#3b82f6', fillOpacity: 0.1, color: '#3b82f6', weight: 1 }}
            />
          </>
        )}

        {/* Real Food Surplus Markers */}
        {listings.map((item) => {
          if (!item.latitude || !item.longitude) return null;

          const isExpiring = item.isExpiringSoon || (item.minutesRemaining && item.minutesRemaining <= 60);
          const pinColor = isExpiring ? '#f59e0b' : '#16a34a';
          const iconEmoji = item.category === 'Bakery & Breads' ? '🍞' : (item.foodType === 'VEGAN' ? '🥗' : '🍱');
          const markerIcon = createCustomIcon(pinColor, iconEmoji);

          return (
            <Marker
              key={item.id}
              position={[item.latitude, item.longitude]}
              icon={markerIcon}
            >
              <Popup>
                <div className="p-2 min-w-[200px] max-w-[240px]">
                  <div className="h-24 w-full rounded-xl overflow-hidden bg-gray-100 mb-2">
                    <img
                      src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80"}
                      alt={item.foodName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-sm text-[#1e293b] leading-tight mb-1">
                    {item.foodName}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-[#64748b] mb-1.5">
                    <span>👥 {item.servings} Servings</span>
                    {item.formattedDistance && (
                      <span className="font-bold text-[#e23744]">{item.formattedDistance}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#64748b] line-clamp-1 mb-2">
                    📍 {item.approximateArea}
                  </p>
                  <Link
                    to={`/food/${item.id}`}
                    className="block w-full py-1.5 text-center text-xs font-bold text-white bg-[#e23744] hover:bg-[#cb202d] rounded-lg transition-colors"
                  >
                    View Food Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
