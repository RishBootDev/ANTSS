import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { type Clinic, addClinic, updateClinic } from '../../services/userService';

interface ClinicModalProps {
  token: string;
  editingClinic: Clinic | null;
  onClose: () => void;
  onSuccess: (clinic: Clinic, isNew: boolean) => void;
}

export default function ClinicModal({ token, editingClinic, onClose, onSuccess }: ClinicModalProps) {
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formState, setFormState] = useState('');
  const [formPincode, setFormPincode] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingClinic) {
      setFormName(editingClinic.clinicName);
      setFormEmail(editingClinic.email || '');
      setFormPhone(editingClinic.mobileNumber || '');
      setFormAddress(editingClinic.addressLine1 || '');
      setFormCity(editingClinic.city || '');
      setFormState(editingClinic.state || '');
      setFormPincode(editingClinic.pincode || '');
    }
  }, [editingClinic]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formPhone.trim()) {
      setError('Name, Email, and Mobile Number are required.');
      return;
    }
    setError('');
    setActionLoading(true);

    const payload = {
      clinicName: formName,
      email: formEmail,
      mobileNumber: formPhone,
      addressLine1: formAddress,
      city: formCity,
      state: formState,
      pincode: formPincode,
    };

    try {
      if (editingClinic) {
        const res = await updateClinic(token, editingClinic.id, payload);
        if (res.success && res.data) {
          onSuccess(res.data, false);
          onClose();
        } else {
          setError(res.message || 'Failed to update clinic');
        }
      } else {
        const res = await addClinic(token, payload);
        if (res.success && res.data) {
          onSuccess(res.data, true);
          onClose();
        } else {
          setError(res.message || 'Failed to add clinic');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={handleFormSubmit} className="relative z-10 bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-1 text-white capitalize">
          {editingClinic ? 'Edit' : 'Add'} Clinic
        </h3>
        <p className="text-xs text-gray-400 mb-5">Provide correct parameters for the clinic.</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Clinic Name *</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              placeholder="LifeCare Clinic"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Email *</label>
            <input
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              placeholder="contact@lifecare.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Mobile Number *</label>
            <input
              type="text"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              placeholder="+91 9988776655"
              required
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
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            disabled={actionLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={actionLoading}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow hover:opacity-95 disabled:opacity-50"
          >
            {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{editingClinic ? 'Save Changes' : 'Create Clinic'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
