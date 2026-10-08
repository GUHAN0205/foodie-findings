import React, { useState } from 'react';
import { reportApi } from '../services/api';
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react';

const ReportModal = ({ isOpen, onClose, listingId, foodName }) => {
  const [reason, setReason] = useState('FOOD_UNAVAILABLE');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await reportApi.create({
        listingId,
        reason,
        description,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit report. Please log in first.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e2d9cd] relative animate-in fade-in zoom-in-95 duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-[#94a3b8] hover:bg-[#faf7f2] hover:text-[#1e293b]"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#1e293b]">Report Submitted</h3>
            <p className="text-xs text-[#64748b]">
              Thank you for keeping Foodie Findings authentic and safe. Our moderation team will investigate.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#1e293b]">Report Listing</h3>
                <p className="text-xs text-[#64748b] truncate max-w-[260px]">{foodName}</p>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">
                Reason for report
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#faf7f2] border border-[#e2d9cd] rounded-xl focus:outline-none focus:border-[#e23744]"
              >
                <option value="FOOD_UNAVAILABLE">Food already unavailable / taken</option>
                <option value="INCORRECT_LOCATION">Incorrect or misleading pickup location</option>
                <option value="INCORRECT_QUANTITY">Incorrect quantity reported</option>
                <option value="EXPIRED_FOOD">Food spoiled, stale, or past safe consumption</option>
                <option value="SUSPICIOUS_LISTING">Suspicious or commercial solicitation</option>
                <option value="OTHER">Other issue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">
                Details (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe what you observed so our team can verify..."
                className="w-full px-3 py-2 text-xs bg-[#faf7f2] border border-[#e2d9cd] rounded-xl focus:outline-none focus:border-[#e23744]"
              ></textarea>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 text-xs font-bold text-[#475569] hover:bg-[#faf7f2] rounded-xl border border-[#e2d9cd]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default ReportModal;
