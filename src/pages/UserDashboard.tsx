import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getProfile,
  getHospitals,
  addHospital,
  updateHospital,
  getClinics,
  getDoctors,
  type Hospital,
  type Clinic,
  type Doctor
} from '../services/userService';
import {
  Building2,
  Stethoscope,
  Users,
  CreditCard,
  LogOut,
  Plus,
  Edit2,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  User,
  Shield,
  Loader2
} from 'lucide-react';
import ClinicTab from '../components/clinics/ClinicTab';
import SubscriptionTab from '../components/subscriptions/SubscriptionTab';
import DoctorTab from '../components/doctors/DoctorTab';

type Tab = 'overview' | 'hospitals' | 'clinics' | 'doctors' | 'subscription';

export function UserDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [profile, setProfile] = useState<any>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'hospital' | 'clinic'>('hospital');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formState, setFormState] = useState('');
  const [formPincode, setFormPincode] = useState('');
  
  const token = user?.accessToken || '';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profRes, hospRes, clinRes, docRes] = await Promise.all([
        getProfile(token),
        getHospitals(token),
        getClinics(token),
        getDoctors(token)
      ]);

      if (profRes.success) setProfile(profRes.data);
      if (hospRes.success && hospRes.data) setHospitals(hospRes.data);
      if (clinRes.success && clinRes.data) setClinics(clinRes.data);
      if (docRes.success && docRes.data) setDoctors(docRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const openAddModal = (type: 'hospital' | 'clinic') => {
    setModalType(type);
    setEditingItem(null);
    setFormName('');
    setFormPhone('');
    setFormAddress('');
    setFormCity('');
    setFormState('');
    setFormPincode('');
    setShowModal(true);
  };

  const openEditModal = (type: 'hospital' | 'clinic', item: any) => {
    setModalType(type);
    setEditingItem(item);
    setFormName(type === 'hospital' ? item.hospitalName : item.clinicName);
    setFormPhone(item.mobileNumber || '');
    setFormAddress(item.addressLine1 || '');
    setFormCity(item.city || '');
    setFormState(item.state || '');
    setFormPincode(item.pincode || '');
    setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Name is required');
      return;
    }

    setActionLoading(true);
    try {
      if (modalType === 'hospital') {
        const payload = {
          hospitalName: formName,
          mobileNumber: formPhone,
          addressLine1: formAddress,
          city: formCity,
          state: formState,
          pincode: formPincode,
        };

        if (editingItem) {
          const res = await updateHospital(token, editingItem.id, payload);
          if (res.success && res.data) {
            setHospitals(hospitals.map(h => h.id === editingItem.id ? res.data! : h));
          }
        } else {
          const res = await addHospital(token, payload);
          if (res.success && res.data) {
            setHospitals([...hospitals, res.data]);
          }
        }
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
        <p className="text-gray-400">Loading your profile & medical entities...</p>
      </div>
    );
  }

  const userStatus = user?.status || 'APPROVED';

  if (userStatus === 'PENDING') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-4">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl max-w-md text-center shadow-2xl">
          <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold mb-2">Awaiting Approval</h2>
          <p className="text-gray-400 mb-8 text-sm">
            Your registration is currently under manual review by our administration team. 
            Once verified, your access credentials and workspace will be unlocked.
          </p>
          <button 
            onClick={logout} 
            className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-xl transition-all"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  const renderStatusBadge = (status?: string) => {
    if (status === 'APPROVED' || status === 'ACTIVE') {
      return <span className="text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">APPROVED</span>;
    }
    if (status === 'REJECTED') {
      return <span className="text-red-400 font-medium bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">REJECTED</span>;
    }
    return <span className="text-amber-400 font-medium bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase">Pending Approval</span>;
  };

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
              <h1 className="font-semibold text-white tracking-wide">ANTSS Client</h1>
              <p className="text-xs text-gray-500">User Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-sm ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-white font-medium'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('hospitals')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-sm ${
              activeTab === 'hospitals'
                ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-white font-medium'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span>Hospitals</span>
          </button>

          <button
            onClick={() => setActiveTab('clinics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-sm ${
              activeTab === 'clinics'
                ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-white font-medium'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Stethoscope className="w-5 h-5" />
            <span>Clinics</span>
          </button>

          <button
            onClick={() => setActiveTab('doctors')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-sm ${
              activeTab === 'doctors'
                ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-white font-medium'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Doctors</span>
          </button>

          <button
            onClick={() => setActiveTab('subscription')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-sm ${
              activeTab === 'subscription'
                ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-white font-medium'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span>Subscription</span>
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

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8 border-b border-white/5 pb-5">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white capitalize">
              {activeTab} Management
            </h2>
            <p className="text-sm text-gray-400">
              Manage details, view statistics, and adjust parameters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Welcome, {user?.email}</span>
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-semibold border border-white/10">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Dynamic Tab Render */}
        <div className="space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Account Status Card */}
              <div className="md:col-span-2 bg-slate-900/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Account Profile</h3>
                  <div className="space-y-3 mt-4 text-sm">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-400 flex items-center gap-2"><User className="w-4 h-4" /> Full Name:</span>
                      <span className="text-white font-medium">{profile?.fullName || 'Clinic Administrator'}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-400 flex items-center gap-2"><Phone className="w-4 h-4" /> Mobile:</span>
                      <span className="text-white font-medium">{profile?.mobileNumber || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-400 flex items-center gap-2"><Building2 className="w-4 h-4" /> Entity Name:</span>
                      <span className="text-white font-medium">{profile?.entityName || 'Default Clinic'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  {userStatus === 'APPROVED' ? (
                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl text-sm font-medium">
                      <CheckCircle className="w-5 h-5" />
                      <span>Approved Account</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-xl text-sm font-medium">
                      <Clock className="w-5 h-5 animate-pulse" />
                      <span>Pending Approval</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stat Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-gray-400 text-sm uppercase tracking-widest">At A Glance</h3>
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Hospitals Added:</span>
                      <span className="text-2xl font-bold">{hospitals.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Clinics Added:</span>
                      <span className="text-2xl font-bold">{clinics.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Active Doctors:</span>
                      <span className="text-2xl font-bold">{doctors.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOSPITALS */}
          {activeTab === 'hospitals' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Registered Hospitals</h3>
                <button
                  onClick={() => openAddModal('hospital')}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-4 py-2 rounded-lg font-medium text-sm transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Hospital
                </button>
              </div>

              {hospitals.length === 0 ? (
                <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-white/5">
                  <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No hospitals added yet. Create one now!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hospitals.map((hosp) => (
                    <div key={hosp.id} className="bg-slate-900/60 border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:border-orange-500/30 transition-colors">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-lg text-white">{hosp.hospitalName}</h4>
                          <button
                            onClick={() => openEditModal('hospital', hosp)}
                            className="p-1.5 rounded-lg bg-slate-800 text-gray-400 hover:text-white transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="mt-4 space-y-2 text-sm text-gray-400">
                          {hosp.mobileNumber && (
                            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-orange-400" /> {hosp.mobileNumber}</div>
                          )}
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                            <span>{hosp.addressLine1 || 'No address'}, {hosp.city}, {hosp.state} {hosp.pincode}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                        <span className="text-gray-500">Allowed Doctors Limit: {hosp.maxDoctorLimit ?? '-'}</span>
                        {renderStatusBadge(hosp.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CLINICS */}
          {activeTab === 'clinics' && (
            <ClinicTab 
              clinics={clinics} 
              token={token} 
              onClinicsUpdate={setClinics} 
            />
          )}

          {/* TAB 4: DOCTORS */}
          {activeTab === 'doctors' && (
            <DoctorTab
              doctors={doctors}
              token={token}
              onDoctorsUpdate={setDoctors}
            />
          )}

          {/* TAB 5: SUBSCRIPTION */}
          {activeTab === 'subscription' && (
            <SubscriptionTab token={token} />
          )}
        </div>
      </main>

      {/* Modal Form Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <form onSubmit={handleFormSubmit} className="relative z-10 bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl max-w-lg w-full">
            <h3 className="text-xl font-bold mb-1 text-white capitalize">
              {editingItem ? 'Edit' : 'Add'} {modalType}
            </h3>
            <p className="text-xs text-gray-400 mb-5">Provide correct parameters for backend lookup.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  placeholder={modalType === 'hospital' ? 'City General Hospital' : 'LifeCare Clinic'}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Mobile / Telephone</label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  placeholder="+91 9988776655"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Street Address</label>
                <input
                  type="text"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  placeholder="Plot 42, Green Avenue"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">City / Town</label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    placeholder="Mumbai"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formPincode}
                    onChange={(e) => setFormPincode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    placeholder="400001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">State</label>
                <input
                  type="text"
                  value={formState}
                  onChange={(e) => setFormState(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  placeholder="Maharashtra"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t border-white/5 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
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
                <span>{editingItem ? 'Save Changes' : 'Create Entity'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
