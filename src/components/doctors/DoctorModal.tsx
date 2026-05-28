import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { type Doctor, addDoctor, updateDoctor } from '../../services/userService';

interface DoctorModalProps {
  token: string;
  editingDoctor: Doctor | null;
  onClose: () => void;
  onSuccess: (doctor: Doctor, isNew: boolean) => void;
}

export default function DoctorModal({ token, editingDoctor, onClose, onSuccess }: DoctorModalProps) {
  const [formName, setFormName] = useState('');
  const [formSpecialization, setFormSpecialization] = useState('');
  const [formQualification, setFormQualification] = useState('');
  const [formExperience, setFormExperience] = useState<number | ''>('');
  const [formEmail, setFormEmail] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formRegNo, setFormRegNo] = useState('');
  const [formStatus, setFormStatus] = useState('ACTIVE');
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingDoctor) {
      setFormName(editingDoctor.doctorName || '');
      setFormSpecialization(editingDoctor.specialization || '');
      setFormQualification(editingDoctor.qualification || '');
      setFormExperience(editingDoctor.experienceYears ?? '');
      setFormEmail(editingDoctor.email || '');
      setFormMobile(editingDoctor.mobileNumber || '');
      setFormRegNo(editingDoctor.registrationNumber || '');
      setFormStatus(editingDoctor.status || 'ACTIVE');
    }
  }, [editingDoctor]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSpecialization.trim() || !formQualification.trim() || formExperience === '' || !formRegNo.trim()) {
      setError('Name, Specialization, Qualification, Experience, and Registration No are required.');
      return;
    }
    setError('');
    setActionLoading(true);

    const payload: Partial<Doctor> = {
      doctorName: formName,
      specialization: formSpecialization,
      qualification: formQualification,
      experienceYears: Number(formExperience),
      email: formEmail || undefined,
      mobileNumber: formMobile || undefined,
      registrationNumber: formRegNo,
      ...(editingDoctor ? { status: formStatus } : {})
    };

    try {
      if (editingDoctor) {
        const res = await updateDoctor(token, editingDoctor.id, payload);
        if (res.success && res.data) {
          onSuccess(res.data, false);
          onClose();
        } else {
          setError(res.message || 'Failed to update doctor');
        }
      } else {
        const res = await addDoctor(token, payload);
        if (res.success && res.data) {
          onSuccess(res.data, true);
          onClose();
        } else {
          setError(res.message || 'Failed to add doctor');
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
      <form onSubmit={handleFormSubmit} className="relative z-10 bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-1 text-white capitalize">
          {editingDoctor ? 'Edit' : 'Add'} Doctor
        </h3>
        <p className="text-xs text-gray-400 mb-5">Provide correct parameters for the doctor.</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Doctor Name *</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              placeholder="Dr. John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Specialization *</label>
            <input
              type="text"
              value={formSpecialization}
              onChange={(e) => setFormSpecialization(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              placeholder="Cardiologist"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Qualification *</label>
            <input
              type="text"
              value={formQualification}
              onChange={(e) => setFormQualification(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              placeholder="MBBS, MD"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Experience (Years) *</label>
            <input
              type="number"
              min="0"
              value={formExperience}
              onChange={(e) => setFormExperience(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              placeholder="5"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Email</label>
            <input
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              placeholder="doctor@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Mobile Number</label>
            <input
              type="text"
              value={formMobile}
              onChange={(e) => setFormMobile(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              placeholder="+91 9876543210"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Registration No *</label>
            <input
              type="text"
              value={formRegNo}
              onChange={(e) => setFormRegNo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              placeholder="MCI-12345"
              required
            />
          </div>

          {editingDoctor && (
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Status *</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                required
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          )}
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
            <span>{editingDoctor ? 'Save Changes' : 'Add Doctor'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
