import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation as useGeoLocation } from '../context/LocationContext';
import { 
  UtensilsCrossed, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';

const Register = () => {
  const routerLocation = useLocation();
  const urlRole = new URLSearchParams(routerLocation.search).get('role');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(urlRole || 'DONOR');
  const [locationStr, setLocationStr] = useState('');
  const [latitude, setLatitude] = useState(12.9716);
  const [longitude, setLongitude] = useState(77.5946);

  // NGO Specific fields
  const [organizationName, setOrganizationName] = useState('');
  const [organizationType, setOrganizationType] = useState('NGO / Shelter');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [capacity, setCapacity] = useState(100);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register } = useAuth();
  const { coords, locationName, requestLocation } = useGeoLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (coords && coords.latitude) {
      setLatitude(coords.latitude);
      setLongitude(coords.longitude);
      if (locationName && !locationStr) {
        setLocationStr(locationName);
      }
    }
  }, [coords, locationName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        name,
        email,
        phone,
        password,
        role,
        location: locationStr || 'Bangalore, India',
        latitude: Number(latitude),
        longitude: Number(longitude),
        organizationName: role === 'NGO' ? (organizationName || name) : undefined,
        organizationType: role === 'NGO' ? organizationType : undefined,
        registrationNumber: role === 'NGO' ? registrationNumber : undefined,
        capacity: role === 'NGO' ? Number(capacity) : undefined,
      };

      await register(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please check your information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#e23744] to-[#f97316] text-white flex items-center justify-center mx-auto shadow-md">
          <UtensilsCrossed className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1e293b] font-serif">
          Join Foodie Findings
        </h1>
        <p className="text-xs text-[#64748b]">
          Connect surplus edible food with real people in need.
        </p>
      </div>

      {/* Register Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2d9cd] shadow-xs space-y-5">
        
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Role Selector (Admin is NEVER publicly selectable as specified in Section 16) */}
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-2">
              Select Your Role in the Community *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('DONOR')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  role === 'DONOR'
                    ? 'border-[#e23744] bg-red-50/60 text-[#e23744] font-bold shadow-xs'
                    : 'border-[#e2d9cd] bg-[#faf7f2] text-[#475569] hover:border-[#e23744]'
                }`}
              >
                <span className="text-xl block mb-1">🍱</span>
                <span className="text-xs">Food Donor</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('VOLUNTEER')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  role === 'VOLUNTEER'
                    ? 'border-[#f97316] bg-amber-50/60 text-[#f97316] font-bold shadow-xs'
                    : 'border-[#e2d9cd] bg-[#faf7f2] text-[#475569] hover:border-[#f97316]'
                }`}
              >
                <span className="text-xl block mb-1">🤝</span>
                <span className="text-xs">Volunteer</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('NGO')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  role === 'NGO'
                    ? 'border-[#16a34a] bg-emerald-50/60 text-[#16a34a] font-bold shadow-xs'
                    : 'border-[#e2d9cd] bg-[#faf7f2] text-[#475569] hover:border-[#16a34a]'
                }`}
              >
                <span className="text-xl block mb-1">🏢</span>
                <span className="text-xs">NGO / Shelter</span>
              </button>
            </div>
            <p className="text-[11px] text-[#94a3b8] mt-1.5 text-center">
              {role === 'DONOR' && "For marriage halls, hostels, caterers, hotels, and event organizers."}
              {role === 'VOLUNTEER' && "For individuals ready to transport surplus meals to local recipients."}
              {role === 'NGO' && "For registered shelters, charity kitchens, and community distribution organizations."}
            </p>
          </div>

          {/* Standard Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#475569] mb-1">
                {role === 'DONOR' ? 'Organization / Donor Name *' : 'Full Name *'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'DONOR' ? "e.g. Royal Palace Banquet Hall" : "e.g. Priya Sharma"}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#faf7f2] border border-[#e2d9cd] rounded-xl text-sm focus:outline-none focus:border-[#e23744]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#faf7f2] border border-[#e2d9cd] rounded-xl text-sm focus:outline-none focus:border-[#e23744]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Phone Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#faf7f2] border border-[#e2d9cd] rounded-xl text-sm focus:outline-none focus:border-[#e23744]"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#475569] mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#faf7f2] border border-[#e2d9cd] rounded-xl text-sm focus:outline-none focus:border-[#e23744]"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#475569]">Physical Location / City *</label>
                <button
                  type="button"
                  onClick={requestLocation}
                  className="text-[11px] font-bold text-[#e23744] hover:underline flex items-center"
                >
                  <MapPin className="w-3 h-3 mr-0.5" />
                  Auto-detect GPS
                </button>
              </div>
              <input
                type="text"
                required
                value={locationStr}
                onChange={(e) => setLocationStr(e.target.value)}
                placeholder="e.g. Indiranagar, Bangalore"
                className="w-full px-4 py-2.5 bg-[#faf7f2] border border-[#e2d9cd] rounded-xl text-sm focus:outline-none focus:border-[#e23744]"
              />
            </div>
          </div>

          {/* NGO Organization Specific Section */}
          {role === 'NGO' && (
            <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e2d9cd] space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Organization & Verification Details</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-[#475569] mb-1">
                    Organization Registered Legal Name
                  </label>
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="e.g. Hope Foundation Community Kitchen"
                    className="w-full px-3 py-2 bg-white border border-[#e2d9cd] rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#475569] mb-1">
                    Registration / Trust Number
                  </label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="e.g. KA-BLR-2022-NGO-109"
                    className="w-full px-3 py-2 bg-white border border-[#e2d9cd] rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#475569] mb-1">
                    Meal Capacity (servings/batch)
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#e2d9cd] rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#e23744] to-[#f97316] text-white font-bold text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center space-x-1 disabled:opacity-50"
          >
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>

      </div>

      {/* Footer link */}
      <p className="text-center text-xs text-[#64748b]">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-[#e23744] hover:underline">
          Sign in here
        </Link>
      </p>

    </div>
  );
};

export default Register;
