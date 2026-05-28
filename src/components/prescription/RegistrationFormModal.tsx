import React, { useState, useRef } from 'react';
import type { Package } from '@/services/packageService';
import type { IRegisterRequest } from '@/interfaces/IRegisterRequest';
import { register } from '@/services/authService';

interface RegistrationFormModalProps {
  selectedPkg: Package;
  onClose: () => void;
  onSuccess: (message: string, total: number, doctorsCount: number, hasRmo: boolean) => void;
}

export function RegistrationFormModal({ selectedPkg, onClose, onSuccess }: RegistrationFormModalProps) {
  const BASE_PRICE = Number(selectedPkg.packagePrice);
  const PER_DOCTOR = Number(selectedPkg.extraDoctorPrice);
  const BASE_LIMIT = Number(selectedPkg.baseDoctorLimit);
  const RMO_PRICE = 5000;
  const PACKAGE_ID = selectedPkg.id;

  const [doctors, setDoctors] = useState<number>(BASE_LIMIT > 0 ? BASE_LIMIT : 1);
  const [rmo, setRmo] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [hospital, setHospital] = useState<string>('');
  const [hospitalPhone, setHospitalPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [stateField, setStateField] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const submitControllerRef = useRef<AbortController | null>(null);

  const total = BASE_PRICE + Math.max(0, doctors - BASE_LIMIT) * PER_DOCTOR + (rmo ? RMO_PRICE : 0);
  const formatted = (n: number) => n.toLocaleString('en-IN');

  const handleDoctorsChange = (value: number) => {
    if (value < 1) value = 1;
    setDoctors(value);
  };

  const handleClose = () => {
    if (submitControllerRef.current) submitControllerRef.current.abort();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !hospital.trim() || !address.trim() || !city.trim() || !stateField.trim()) {
      alert('Please fill name, email, phone, hospital/clinic and complete address (address, city, state)');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    const controller = new AbortController();
    const { signal } = controller;
    submitControllerRef.current = controller;

    const generatedPassword = `P@ss${Math.random().toString(36).slice(-10)}`;

    const payload: IRegisterRequest = {
      fullName: name,
      clinicName: hospital,
      email,
      mobile: phone,
      address: address || '',
      city: city || '',
      state: stateField || '',
      country: '',
      packageId: PACKAGE_ID,
      numDoctors: doctors,
      password: generatedPassword,
      confirmPassword: generatedPassword,
    };

    register(payload, { signal })
      .then((res) => {
        if (!res.success) {
          setSubmitError(res.message ?? 'Registration failed');
          return;
        }
        onSuccess(res.message ?? 'Registered successfully', total, doctors, rmo);
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          setSubmitError('Request cancelled');
          return;
        }
        setSubmitError(err?.message ?? 'Network error');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto pt-20 pb-10">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />
      <form onSubmit={handleSubmit} className="relative z-10 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">Register for {selectedPkg.packageName}</h3>
            <p className="text-sm text-slate-400">Complete your registration to get started.</p>
          </div>
          <button type="button" onClick={handleClose} className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full p-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {submitError && (
          <div className="mb-6 text-sm text-red-200 bg-red-500/20 border border-red-500/30 px-4 py-3 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {submitError}
          </div>
        )}

        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                <input required className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                <input required type="email" className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="doctor@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone Number</label>
                <input required type="tel" className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Hospital / Clinic Name</label>
                <input required className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" value={hospital} onChange={(e) => setHospital(e.target.value)} placeholder="City Care Clinic" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Hospital Phone</label>
                <input className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" value={hospitalPhone} onChange={(e) => setHospitalPhone(e.target.value)} placeholder="Optional" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Street Address</label>
                <input required className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">City</label>
              <input required className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mumbai" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">State</label>
              <input required className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" value={stateField} onChange={(e) => setStateField(e.target.value)} placeholder="Maharashtra" />
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 mt-2">
            <h4 className="text-sm font-semibold text-white mb-4">Package Configuration</h4>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-slate-300">Number of Doctors</label>
                <div className="flex items-center bg-slate-800 border border-slate-600 rounded-lg overflow-hidden">
                  <button type="button" className="px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors" onClick={() => handleDoctorsChange(doctors - 1)}>-</button>
                  <input type="number" min={1} value={doctors} onChange={(e) => handleDoctorsChange(Number(e.target.value))} className="w-12 text-center bg-transparent border-none focus:ring-0 text-white text-sm" />
                  <button type="button" className="px-3 py-2 text-orange-400 hover:bg-slate-700 hover:text-orange-300 transition-colors" onClick={() => handleDoctorsChange(doctors + 1)}>+</button>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input type="checkbox" checked={rmo} onChange={(e) => setRmo(e.target.checked)} className="peer sr-only" />
                  <div className="w-10 h-5 bg-slate-600 rounded-full peer-checked:bg-orange-500 transition-colors"></div>
                  <div className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform peer-checked:translate-x-5"></div>
                </div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                  Add RMO App <span className="text-orange-400">(+₹{formatted(RMO_PRICE)})</span>
                </span>
              </label>
            </div>
            
            {doctors > BASE_LIMIT && (
              <div className="mt-3 text-xs text-orange-400 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                You are adding {doctors - BASE_LIMIT} extra doctor(s) at ₹{formatted(PER_DOCTOR)} each.
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-slate-700/50 mt-6">
            <div>
              <div className="text-sm font-medium text-slate-400 mb-1">Total Payable Amount</div>
              <div className="text-3xl font-bold text-white tracking-tight">₹{formatted(total)}</div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button type="button" onClick={handleClose} className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Confirm & Pay'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
