import { useState } from 'react';
import { Users, Plus, Edit2, Mail, Phone, GraduationCap, Award } from 'lucide-react';
import { type Doctor } from '../../services/userService';
import DoctorModal from './DoctorModal';

interface DoctorTabProps {
  doctors: Doctor[];
  token: string;
  onDoctorsUpdate: (doctors: Doctor[]) => void;
}

const renderStatusBadge = (status?: string) => {
  if (status === 'APPROVED' || status === 'ACTIVE') {
    return <span className="text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">APPROVED</span>;
  }
  if (status === 'REJECTED') {
    return <span className="text-red-400 font-medium bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">REJECTED</span>;
  }
  return <span className="text-amber-400 font-medium bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase">Pending</span>;
};

export default function DoctorTab({ doctors, token, onDoctorsUpdate }: DoctorTabProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const openAddModal = () => {
    setEditingDoctor(null);
    setShowModal(true);
  };

  const openEditModal = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setShowModal(true);
  };

  const handleSaveSuccess = (updatedDoctor: Doctor, isNew: boolean) => {
    if (isNew) {
      onDoctorsUpdate([...doctors, updatedDoctor]);
    } else {
      onDoctorsUpdate(doctors.map((d) => (d.id === updatedDoctor.id ? updatedDoctor : d)));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Associated Doctors</h3>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-4 py-2 rounded-lg font-medium text-sm transition-all text-white"
        >
          <Plus className="w-4 h-4" /> Add Doctor
        </button>
      </div>

      {doctors.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-white/5">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No doctors added yet. Associate one now!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div key={doc.id} className="bg-slate-900/60 border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:border-orange-500/30 transition-colors">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-lg text-white">{doc.doctorName}</h4>
                    <p className="text-xs text-orange-400 mt-1 font-medium">{doc.specialization}</p>
                  </div>
                  <button
                    onClick={() => openEditModal(doc)}
                    className="p-1.5 rounded-lg bg-slate-800 text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-orange-400" /> {doc.qualification}</div>
                  <div className="flex items-center gap-2"><Award className="w-4 h-4 text-orange-400" /> {doc.experienceYears} Years Exp.</div>
                  {doc.email && (
                    <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-orange-400" /> {doc.email}</div>
                  )}
                  {doc.mobileNumber && (
                    <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-orange-400" /> {doc.mobileNumber}</div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-gray-500">Reg No: {doc.registrationNumber}</span>
                {renderStatusBadge(doc.status)}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <DoctorModal
          token={token}
          editingDoctor={editingDoctor}
          onClose={() => setShowModal(false)}
          onSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
}
