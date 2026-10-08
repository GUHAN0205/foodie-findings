import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { User, ShieldCheck, Mail, Phone, MapPin, Compass } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { coords, locationName, requestLocation } = useLocation();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-[#e2d9cd] shadow-xs space-y-6">
        
        {/* Profile Header */}
        <div className="flex items-center space-x-4 border-b border-[#f1ede6] pb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#e23744]/10 text-[#e23744] flex items-center justify-center font-bold text-2xl">
            {user?.name ? user.name[0] : 'U'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-[#1e293b]">{user?.name}</h1>
              {user?.verified && (
                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-xs text-[#64748b] mt-0.5">Role: <span className="font-bold text-[#e23744] uppercase">{user?.role}</span></p>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-4 text-xs">
          <div className="flex items-center space-x-3 p-3 bg-[#faf7f2] rounded-xl">
            <Mail className="w-4 h-4 text-[#e23744]" />
            <div>
              <p className="text-[10px] text-[#94a3b8] uppercase font-bold">Email</p>
              <p className="font-bold text-[#1e293b]">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-[#faf7f2] rounded-xl">
            <Phone className="w-4 h-4 text-[#f97316]" />
            <div>
              <p className="text-[10px] text-[#94a3b8] uppercase font-bold">Phone</p>
              <p className="font-bold text-[#1e293b]">{user?.phone || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-[#faf7f2] rounded-xl">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <div className="flex-1">
              <p className="text-[10px] text-[#94a3b8] uppercase font-bold">Default Location</p>
              <p className="font-bold text-[#1e293b]">{user?.location || locationName || 'Coordinates set'}</p>
            </div>
            <button
              onClick={requestLocation}
              className="text-[11px] font-bold text-[#e23744] hover:underline"
            >
              Update via GPS
            </button>
          </div>

          {coords && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 space-y-1">
              <div className="flex items-center space-x-1 font-bold">
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                <span>Active Device GPS Coordinates:</span>
              </div>
              <p className="text-[11px] text-blue-700">
                Lat: {coords.latitude.toFixed(6)}, Lon: {coords.longitude.toFixed(6)} (Accuracy: {coords.accuracy ? `${Math.round(coords.accuracy)}m` : 'High'})
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
