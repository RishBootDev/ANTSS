import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { requestDoctorAddon } from '../../services/subscriptionService';

interface AddonModalProps {
  token: string;
  subscriptionId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddonModal({ token, subscriptionId, onClose, onSuccess }: AddonModalProps) {
  const [additionalDoctors, setAdditionalDoctors] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (additionalDoctors < 1) {
      setError('Please request at least 1 doctor.');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const res = await requestDoctorAddon(token, {
        userSubscriptionId: subscriptionId,
        additionalDoctors,
      });

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.message || 'Failed to request addon.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative z-10 bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl max-w-sm w-full">
        <h3 className="text-xl font-bold mb-1 text-white">
          Request Doctor Addon
        </h3>
        <p className="text-xs text-gray-400 mb-5">Increase your subscription's doctor limit.</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Number of Additional Doctors</label>
            <input
              type="number"
              min="1"
              value={additionalDoctors}
              onChange={(e) => setAdditionalDoctors(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 border-t border-white/5 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow hover:opacity-95 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Request Addon</span>
          </button>
        </div>
      </form>
    </div>
  );
}
