import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchPackages, type Package, type DurationType } from '../services/packageService';
import {
  getUsers,
  approveUser,
  rejectUser,
  getAdminHospitals,
  getAdminClinics,
  createAdminPackage,
  updateAdminPackage,
  getAdminStats,
  type AdminUserResponse,
  type AdminStats
} from '../services/adminService';
import type { Hospital, Clinic } from '../services/userService';
import {
  Users,
  Check,
  X,
  Plus,
  Package as PackageIcon,
  Building2,
  Stethoscope,
  BarChart3,
  LogOut,
  Edit2,
  Loader2,
  Search,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

type AdminTab = 'users' | 'packages' | 'entities' | 'analytics';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [usersList, setUsersList] = useState<AdminUserResponse[]>([]);
  const [packagesList, setPackagesList] = useState<Package[]>([]);
  const [hospitalsList, setHospitalsList] = useState<Hospital[]>([]);
  const [clinicsList, setClinicsList] = useState<Clinic[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Package Form Modal
  const [showPkgModal, setShowPkgModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState<Package | null>(null);
  const [pkgName, setPkgName] = useState('');
  const [pkgDuration, setPkgDuration] = useState<DurationType>('YEARLY');
  const [pkgLimit, setPkgLimit] = useState(1);
  const [pkgPrice, setPkgPrice] = useState(15000);
  const [pkgExtraPrice, setPkgExtraPrice] = useState(5000);
  const [pkgFeatures, setPkgFeatures] = useState('');
  const [pkgActive, setPkgActive] = useState(true);

  const token = user?.accessToken || '';

  const loadData = async () => {
    setLoading(true);
    try {
      const [uRes, pList, hRes, cRes, sRes] = await Promise.all([
        getUsers(token),
        fetchPackages(),
        getAdminHospitals(token),
        getAdminClinics(token),
        getAdminStats(token)
      ]);

      if (uRes.success && uRes.data) setUsersList(uRes.data);
      setPackagesList(pList || []);
      if (hRes.success && hRes.data) setHospitalsList(hRes.data);
      if (cRes.success && cRes.data) setClinicsList(cRes.data);
      if (sRes.success && sRes.data) setStats(sRes.data);
    } catch (err) {
      console.error('Error loading admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const handleApprove = async (userId: number) => {
    setActionLoading(true);
    try {
      const res = await approveUser(token, userId);
      if (res.success) {
        setUsersList(usersList.map(u => u.id === userId ? { ...u, status: 'APPROVED' } : u));
        // Refresh statistics
        const sRes = await getAdminStats(token);
        if (sRes.success && sRes.data) setStats(sRes.data);
      } else {
        alert(res.message || 'Approval failed');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (userId: number) => {
    setActionLoading(true);
    try {
      const res = await rejectUser(token, userId);
      if (res.success) {
        setUsersList(usersList.map(u => u.id === userId ? { ...u, status: 'REJECTED' } : u));
        // Refresh statistics
        const sRes = await getAdminStats(token);
        if (sRes.success && sRes.data) setStats(sRes.data);
      } else {
        alert(res.message || 'Rejection failed');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const openAddPkgModal = () => {
    setEditingPkg(null);
    setPkgName('');
    setPkgDuration('YEARLY');
    setPkgLimit(1);
    setPkgPrice(15000);
    setPkgExtraPrice(5000);
    setPkgFeatures('');
    setPkgActive(true);
    setShowPkgModal(true);
  };

  const openEditPkgModal = (pkg: Package) => {
    setEditingPkg(pkg);
    setPkgName(pkg.packageName);
    setPkgDuration(pkg.durationType);
    setPkgLimit(pkg.baseDoctorLimit);
    setPkgPrice(Number(pkg.packagePrice));
    setPkgExtraPrice(Number(pkg.extraDoctorPrice));
    setPkgFeatures(pkg.features || '');
    setPkgActive(pkg.active);
    setShowPkgModal(true);
  };

  const handlePkgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgName.trim()) {
      alert('Package name is required');
      return;
    }

    setActionLoading(true);
    try {
      const payload = {
        packageName: pkgName,
        durationType: pkgDuration,
        baseDoctorLimit: pkgLimit,
        packagePrice: pkgPrice,
        extraDoctorPrice: pkgExtraPrice,
        features: pkgFeatures,
        active: pkgActive
      };

      if (editingPkg) {
        const res = await updateAdminPackage(token, editingPkg.id, payload);
        if (res.success && res.data) {
          setPackagesList(packagesList.map(p => p.id === editingPkg.id ? res.data! : p));
        }
      } else {
        const res = await createAdminPackage(token, payload);
        if (res.success && res.data) {
          setPackagesList([...packagesList, res.data]);
        }
      }
      setShowPkgModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = usersList.filter(user =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.entityName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
        <p className="text-gray-400">Loading Admin Dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-white/5 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center font-bold text-white shadow-lg">
              A
            </div>
            <div>
              <h1 className="font-semibold text-white tracking-wide">ANTSS Admin</h1>
              <p className="text-xs text-gray-500">Root Management</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-sm ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-white font-medium'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>User Requests</span>
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-sm ${
              activeTab === 'packages'
                ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-white font-medium'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <PackageIcon className="w-5 h-5" />
            <span>Packages (CRUD)</span>
          </button>

          <button
            onClick={() => setActiveTab('entities')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-sm ${
              activeTab === 'entities'
                ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-white font-medium'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span>Hospitals & Clinics</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-sm ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-white font-medium'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>System Stats</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left text-sm"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 border-b border-white/5 pb-5">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white capitalize">
              Admin: {activeTab}
            </h2>
            <p className="text-sm text-gray-400">
              System dashboard representing data from backend controllers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Root Admin</span>
            <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-sm font-semibold border border-white/10 text-white shadow">
              👑
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="space-y-6">
          {/* TAB 1: USERS */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Search + Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative max-w-md w-full">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, or clinic name..."
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>
                <div className="text-xs text-gray-400">
                  Showing {filteredUsers.length} of {usersList.length} users
                </div>
              </div>

              {/* Table */}
              <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-slate-900 text-xs font-semibold uppercase text-gray-400">
                      <th className="p-4">Name / Contact</th>
                      <th className="p-4">Entity & Type</th>
                      <th className="p-4">Address</th>
                      <th className="p-4">Request Status</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500">
                          No registration requests match search.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-white/[0.01]">
                          <td className="p-4">
                            <div className="font-semibold text-white">{u.fullName}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{u.email} • {u.mobileNumber}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-white font-medium">{u.entityName}</div>
                            <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
                              {u.userType}
                            </span>
                          </td>
                          <td className="p-4 text-gray-400 text-xs max-w-xs truncate">
                            {u.addressLine1 ? `${u.addressLine1}, ` : ''}{u.city}, {u.state} {u.pincode}
                          </td>
                          <td className="p-4">
                            {u.status === 'APPROVED' && (
                              <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full text-xs font-medium w-fit">
                                <ShieldCheck className="w-4 h-4" /> Approved
                              </span>
                            )}
                            {u.status === 'PENDING' && (
                              <span className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full text-xs font-medium w-fit">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Pending Approval
                              </span>
                            )}
                            {u.status === 'REJECTED' && (
                              <span className="flex items-center gap-1.5 text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full text-xs font-medium w-fit">
                                <ShieldAlert className="w-4 h-4" /> Rejected
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {u.status === 'PENDING' && (
                              <div className="flex justify-center items-center gap-2">
                                <button
                                  onClick={() => handleApprove(u.id)}
                                  disabled={actionLoading}
                                  className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                  title="Approve User"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleReject(u.id)}
                                  disabled={actionLoading}
                                  className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                  title="Reject Request"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                            {u.status !== 'PENDING' && (
                              <span className="text-xs text-gray-500">—</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: PACKAGES */}
          {activeTab === 'packages' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Subscription Packages</h3>
                <button
                  onClick={openAddPkgModal}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-4 py-2 rounded-lg font-medium text-sm transition-all"
                >
                  <Plus className="w-4 h-4" /> Create Package
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {packagesList.map((pkg) => (
                  <div key={pkg.id} className="bg-slate-900/60 border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:border-orange-500/30 transition-colors">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-lg text-white">{pkg.packageName}</h4>
                        <button
                          onClick={() => openEditPkgModal(pkg)}
                          className="p-1.5 rounded-lg bg-slate-800 text-gray-400 hover:text-white transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Billing Duration:</span>
                          <span className="text-orange-400 font-bold uppercase">{pkg.durationType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Price:</span>
                          <span className="text-white font-semibold">₹ {Number(pkg.packagePrice).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Extra Doctor Cost:</span>
                          <span className="text-white">₹ {Number(pkg.extraDoctorPrice).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Base Doctor Limit:</span>
                          <span className="text-white">{pkg.baseDoctorLimit}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-gray-500">ID: #{pkg.id}</span>
                      {pkg.active ? (
                        <span className="text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
                      ) : (
                        <span className="text-red-400 font-medium bg-red-500/10 px-2 py-0.5 rounded">Inactive</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: HOSPITALS & CLINICS */}
          {activeTab === 'entities' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Hospitals list */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-orange-400" />
                    <span>Global Hospitals ({hospitalsList.length})</span>
                  </h3>
                </div>
                <div className="space-y-3">
                  {hospitalsList.length === 0 ? (
                    <div className="text-center py-6 text-xs text-gray-500 bg-slate-900/40 rounded-xl">No hospitals registered yet.</div>
                  ) : (
                    hospitalsList.map(hosp => (
                      <div key={hosp.id} className="p-4 rounded-xl bg-slate-900/60 border border-white/5 text-xs space-y-1">
                        <div className="font-semibold text-white text-sm">{hosp.hospitalName}</div>
                        <div className="text-gray-400">{hosp.mobileNumber || 'No phone'}</div>
                        <div className="text-gray-500">{hosp.city}, {hosp.state}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Clinics list */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-red-400" />
                    <span>Global Clinics ({clinicsList.length})</span>
                  </h3>
                </div>
                <div className="space-y-3">
                  {clinicsList.length === 0 ? (
                    <div className="text-center py-6 text-xs text-gray-500 bg-slate-900/40 rounded-xl">No clinics registered yet.</div>
                  ) : (
                    clinicsList.map(clinic => (
                      <div key={clinic.id} className="p-4 rounded-xl bg-slate-900/60 border border-white/5 text-xs space-y-1">
                        <div className="font-semibold text-white text-sm">{clinic.clinicName}</div>
                        <div className="text-gray-400">{clinic.mobileNumber || 'No phone'}</div>
                        <div className="text-gray-500">{clinic.city}, {clinic.state}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Analytics blocks */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-slate-900/60 border border-white/10 p-5 rounded-2xl">
                  <div className="text-gray-400 text-xs font-medium uppercase tracking-wider">Total Registrations</div>
                  <div className="text-3xl font-extrabold mt-2 text-white">{stats?.totalUsers ?? usersList.length}</div>
                </div>

                <div className="bg-slate-900/60 border border-white/10 p-5 rounded-2xl">
                  <div className="text-gray-400 text-xs font-medium uppercase tracking-wider">Pending Approval</div>
                  <div className="text-3xl font-extrabold mt-2 text-amber-400">{stats?.pendingApprovals ?? usersList.filter(u => u.status === 'PENDING').length}</div>
                </div>

                <div className="bg-slate-900/60 border border-white/10 p-5 rounded-2xl">
                  <div className="text-gray-400 text-xs font-medium uppercase tracking-wider">Total Hospitals</div>
                  <div className="text-3xl font-extrabold mt-2 text-orange-400">{stats?.totalHospitals ?? hospitalsList.length}</div>
                </div>

                <div className="bg-slate-900/60 border border-white/10 p-5 rounded-2xl">
                  <div className="text-gray-400 text-xs font-medium uppercase tracking-wider">Total Clinics</div>
                  <div className="text-3xl font-extrabold mt-2 text-red-400">{stats?.totalClinics ?? clinicsList.length}</div>
                </div>
              </div>

              {/* Status breakdown description card */}
              <div className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl text-sm max-w-2xl">
                <h4 className="font-semibold text-white mb-2">Backend Services Status</h4>
                <p className="text-gray-400">
                  All administrative endpoints (create package, edit package, query clinics, check hospital count) are fully configured and wired directly to the Spring Boot administrative module.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Package Creator Modal */}
      {showPkgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPkgModal(false)} />
          <form onSubmit={handlePkgSubmit} className="relative z-10 bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl max-w-lg w-full">
            <h3 className="text-xl font-bold mb-1 text-white">
              {editingPkg ? 'Edit Package' : 'Create Package'}
            </h3>
            <p className="text-xs text-gray-400 mb-5">Create or adjust standard pricing packages.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Package Name</label>
                <input
                  type="text"
                  value={pkgName}
                  onChange={(e) => setPkgName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  placeholder="Standard Prescription Plan"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Billing Duration</label>
                  <select
                    value={pkgDuration}
                    onChange={(e) => setPkgDuration(e.target.value as DurationType)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  >
                    <option value="MONTHLY">MONTHLY</option>
                    <option value="QUARTERLY">QUARTERLY</option>
                    <option value="YEARLY">YEARLY</option>
                    <option value="LIFETIME">LIFETIME</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Base Doctor Limit</label>
                  <input
                    type="number"
                    value={pkgLimit}
                    onChange={(e) => setPkgLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    min={1}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Package Price (₹)</label>
                  <input
                    type="number"
                    value={pkgPrice}
                    onChange={(e) => setPkgPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Extra Doctor Cost (₹)</label>
                  <input
                    type="number"
                    value={pkgExtraPrice}
                    onChange={(e) => setPkgExtraPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    min={0}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Features Description</label>
                <textarea
                  value={pkgFeatures}
                  onChange={(e) => setPkgFeatures(e.target.value)}
                  className="w-full h-20 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  placeholder="Includes Prescription creator, RMO management, etc."
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="pkg-active"
                  type="checkbox"
                  checked={pkgActive}
                  onChange={(e) => setPkgActive(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="pkg-active" className="text-xs font-semibold text-gray-400 uppercase cursor-pointer select-none">Active / Available for signup</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t border-white/5 pt-4">
              <button
                type="button"
                onClick={() => setShowPkgModal(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow hover:opacity-95"
              >
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{editingPkg ? 'Save Changes' : 'Create Package'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
