import React, { useState, useEffect } from 'react';
import { adminApi, reportApi, foodApi } from '../../services/api';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Trash2,
  RefreshCw,
  Search,
  Scale
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'orgs', 'reports', 'users', 'listings'
  const [overview, setOverview] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [overRes, orgsRes, repRes, usersRes, listRes] = await Promise.all([
        adminApi.getOverview(),
        adminApi.getOrganizations(),
        reportApi.getAll(),
        adminApi.getUsers(),
        adminApi.getListings(),
      ]);
      setOverview(overRes.data);
      setOrganizations(orgsRes.data || []);
      setReports(repRes.data || []);
      setUsers(usersRes.data || []);
      setListings(listRes.data || []);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyOrg = async (orgId, status) => {
    try {
      await adminApi.getOrganizations(); // verify endpoint
      // call api: PUT /api/admin/organizations/{id}/verify?status=...
      await fetch(`/api/admin/organizations/${orgId}/verify?status=${status}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('foodie_token')}`
        }
      });
      fetchAdminData();
    } catch (err) {
      alert("Failed to update organization status");
    }
  };

  const handleResolveReport = async (reportId, status) => {
    try {
      await reportApi.resolve(reportId, {
        status,
        notes: `Investigation concluded by administrator: ${status}`
      });
      fetchAdminData();
    } catch (err) {
      alert("Failed to resolve report");
    }
  };

  const handleToggleUserVerify = async (userId) => {
    try {
      await adminApi.toggleUserVerify(userId);
      fetchAdminData();
    } catch (err) {
      alert("Failed to toggle verification");
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="bg-[#1e293b] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#f97316] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif">
            Platform Moderation & Trust Engine
          </h1>
          <p className="text-xs text-[#94a3b8] mt-1">
            Manage NGO verification badges, community safety reports, and platform authenticity.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="flex items-center space-x-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all shrink-0 self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Live State</span>
        </button>
      </div>

      {/* Overview Cards (Section 29) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e2d9cd] shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-[#94a3b8]">Total Users</p>
          <p className="text-2xl font-black text-[#1e293b] mt-1">{overview?.totalUsers || 0}</p>
          <p className="text-[10px] text-[#64748b]">
            {overview?.donors || 0} donors • {overview?.volunteers || 0} volunteers • {overview?.ngos || 0} NGOs
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e2d9cd] shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-[#94a3b8]">Active Surplus Listings</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{overview?.activeListings || 0}</p>
          <p className="text-[10px] text-[#64748b]">Live & discoverable</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e2d9cd] shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-[#94a3b8]">Completed Donations</p>
          <p className="text-2xl font-black text-[#e23744] mt-1">{overview?.completedDonations || 0}</p>
          <p className="text-[10px] text-[#64748b]">Successfully rescued</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e2d9cd] shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-[#94a3b8]">Moderation Reports</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{overview?.pendingReports || 0}</p>
          <p className="text-[10px] text-[#64748b]">Pending investigation</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e2d9cd] space-x-4">
        {[
          { id: 'orgs', label: `NGO Verifications (${organizations.filter(o => o.verificationStatus === 'PENDING').length})` },
          { id: 'reports', label: `Safety Reports (${reports.filter(r => r.status === 'PENDING').length})` },
          { id: 'users', label: `Users (${users.length})` },
          { id: 'listings', label: `Listings (${listings.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-[#e23744] text-[#e23744]'
                : 'border-transparent text-[#64748b] hover:text-[#1e293b]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: NGO Verifications */}
      {activeTab === 'orgs' && (
        <div className="bg-white p-6 rounded-3xl border border-[#e2d9cd] shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#1e293b]">
            Organization Verification Queue
          </h2>
          <div className="space-y-3">
            {organizations.map((org) => (
              <div
                key={org.id}
                className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e2d9cd] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-[#1e293b]">{org.organizationName}</span>
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      org.verificationStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                      org.verificationStatus === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {org.verificationStatus}
                    </span>
                  </div>
                  <p className="text-[#64748b]">
                    Reg No: {org.registrationNumber || 'None provided'} • Capacity: {org.capacity} meals/day
                  </p>
                  <p className="text-[#475569]">Address: {org.address} • Contact: {org.contactPerson} ({org.contactPhone})</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {org.verificationStatus !== 'VERIFIED' && (
                    <button
                      onClick={() => handleVerifyOrg(org.id, 'VERIFIED')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                    >
                      Approve & Grant Badge 🟢
                    </button>
                  )}
                  {org.verificationStatus !== 'REJECTED' && (
                    <button
                      onClick={() => handleVerifyOrg(org.id, 'REJECTED')}
                      className="px-3.5 py-1.5 bg-white border border-[#e2d9cd] text-red-600 font-bold rounded-xl hover:bg-red-50"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Reports */}
      {activeTab === 'reports' && (
        <div className="bg-white p-6 rounded-3xl border border-[#e2d9cd] shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#1e293b]">
            Community Moderation Reports
          </h2>
          {reports.length === 0 ? (
            <p className="text-xs text-[#94a3b8] py-8 text-center">No reports filed yet. The community is healthy.</p>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e2d9cd] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-red-600">{rep.reason}</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        rep.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rep.status}
                      </span>
                    </div>
                    <p className="text-[#1e293b]">Listing: <strong>{rep.foodName || `#${rep.listingId}`}</strong></p>
                    <p className="text-[#64748b]">Reported by: {rep.reporterName} • Details: “{rep.description || 'No notes'}”</p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {rep.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleResolveReport(rep.id, 'RESOLVED')}
                          className="px-3.5 py-1.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700"
                        >
                          Resolve & Cancel Listing
                        </button>
                        <button
                          onClick={() => handleResolveReport(rep.id, 'DISMISSED')}
                          className="px-3.5 py-1.5 bg-white border border-[#e2d9cd] text-[#64748b] font-bold rounded-xl"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Users */}
      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-3xl border border-[#e2d9cd] shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#1e293b]">User Directory</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e2d9cd] text-[#94a3b8] uppercase">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1ede6]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#faf7f2]">
                    <td className="py-3 font-bold text-[#1e293b]">{u.name}</td>
                    <td className="py-3 text-[#64748b]">{u.email}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded font-bold bg-[#faf7f2] border border-[#e2d9cd]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3">
                      {u.verified ? (
                        <span className="text-emerald-600 font-bold">Verified 🟢</span>
                      ) : (
                        <span className="text-amber-600 font-bold">Unverified 🟡</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleToggleUserVerify(u.id)}
                        className="px-2.5 py-1 bg-white border border-[#e2d9cd] hover:border-[#e23744] text-[#1e293b] rounded-lg font-bold"
                      >
                        Toggle Verify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Listings */}
      {activeTab === 'listings' && (
        <div className="bg-white p-6 rounded-3xl border border-[#e2d9cd] shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#1e293b]">All Food Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {listings.map((l) => (
              <div key={l.id} className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e2d9cd] text-xs space-y-2">
                <span className="font-bold px-2 py-0.5 rounded bg-white border border-[#e2d9cd]">
                  {l.status}
                </span>
                <h4 className="font-bold text-sm text-[#1e293b]">{l.foodName}</h4>
                <p className="text-[#64748b]">{l.servings} Servings • {l.quantity}</p>
                <p className="text-[#64748b]">Donor: {l.donor?.name}</p>
                <p className="text-[11px] text-[#94a3b8]">Address: {l.pickupLocation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
