import { useState, useEffect } from 'react';
import { CreditCard, Loader2, Plus, Clock, CheckCircle } from 'lucide-react';
import { 
  getActiveSubscriptions, 
  getAddonRequests, 
  type Subscription, 
  type DoctorAddon 
} from '../../services/subscriptionService';
import AddonModal from './AddonModal';

interface SubscriptionTabProps {
  token: string;
}

const getPaymentStatusBadge = (status: string) => {
  if (status === 'PAID') return <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-xs font-medium">PAID</span>;
  if (status === 'FAILED') return <span className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded text-xs font-medium">FAILED</span>;
  return <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded text-xs font-medium uppercase">{status}</span>;
};

const getApprovalStatusBadge = (status: string) => {
  if (status === 'APPROVED') return <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-xs font-medium">APPROVED</span>;
  if (status === 'REJECTED') return <span className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded text-xs font-medium">REJECTED</span>;
  return <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded text-xs font-medium uppercase">{status}</span>;
};

export default function SubscriptionTab({ token }: SubscriptionTabProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [addons, setAddons] = useState<DoctorAddon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subsRes, addonsRes] = await Promise.all([
        getActiveSubscriptions(token),
        getAddonRequests(token)
      ]);
      if (subsRes.success && subsRes.data) {
        setSubscriptions(subsRes.data);
      }
      if (addonsRes.success && addonsRes.data) {
        setAddons(addonsRes.data);
      }
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-4" />
        <p className="text-gray-400 text-sm">Loading subscription details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Active Subscriptions Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Active Subscriptions</h3>
        </div>

        {subscriptions.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-white/5">
            <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No active subscriptions found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="bg-slate-900/60 border border-white/10 p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  {sub.subscriptionStatus === 'ACTIVE' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-500" />
                  )}
                </div>
                
                <div>
                  <h4 className="font-bold text-xl text-white mb-4">{sub.packageName}</h4>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-400">Validity:</span>
                      <span className="text-white font-medium">{sub.startDate} to {sub.endDate}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-400">Doctor Limit:</span>
                      <span className="text-white font-medium">{sub.usedDoctors} / {sub.allowedDoctors} used</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-400">Payment Status:</span>
                      {getPaymentStatusBadge(sub.paymentStatus)}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5">
                  <button
                    onClick={() => setSelectedSubId(sub.id)}
                    className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm transition-all border border-white/10"
                  >
                    <Plus className="w-4 h-4" /> Request Doctor Addon
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Addon Requests Section */}
      {addons.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Addon Requests History</h3>
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-slate-900 text-xs font-semibold uppercase text-gray-400">
                  <th className="p-4">Requested Docs</th>
                  <th className="p-4">Prorated Amt</th>
                  <th className="p-4">Validity</th>
                  <th className="p-4 text-center">Payment</th>
                  <th className="p-4 text-right">Approval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {addons.map((addon) => (
                  <tr key={addon.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-medium text-white">+{addon.additionalDoctors} Doctors</td>
                    <td className="p-4 text-gray-400 font-mono">₹{addon.prorataAmount?.toFixed(2) || '0.00'}</td>
                    <td className="p-4 text-gray-400">{addon.startDate} to {addon.endDate}</td>
                    <td className="p-4 text-center">
                      {getPaymentStatusBadge(addon.paymentStatus)}
                    </td>
                    <td className="p-4 text-right">
                      {getApprovalStatusBadge(addon.approvalStatus)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedSubId && (
        <AddonModal
          token={token}
          subscriptionId={selectedSubId}
          onClose={() => setSelectedSubId(null)}
          onSuccess={() => {
            fetchData();
          }}
        />
      )}
    </div>
  );
}
