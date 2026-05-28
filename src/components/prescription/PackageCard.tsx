import type { Package } from '@/services/packageService';

interface PackageCardProps {
  pkg: Package;
  isPopular: boolean;
  onSelect: (pkg: Package) => void;
}

export function PackageCard({ pkg, isPopular, onSelect }: PackageCardProps) {
  const formatted = (n: number) => n.toLocaleString('en-IN');

  const getDurationLabel = (type: string) => {
    const labels: Record<string, string> = {
      MONTHLY: 'Monthly',
      QUARTERLY: 'Quarterly',
      SIX_MONTH: '6 Months',
      ONE_YEAR: '1 Year',
      TWO_YEAR: '2 Years',
      YEARLY: 'Yearly',
      LIFETIME: 'Lifetime',
    };
    return labels[type] || type;
  };

  return (
    <div
      className={`relative flex flex-col bg-slate-900 rounded-2xl p-8 border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
        isPopular ? 'border-orange-500 shadow-orange-500/20 shadow-xl' : 'border-slate-700 hover:border-slate-500'
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
          Most Popular
        </div>
      )}

      <div className="mb-6 text-center">
        <h3 className="text-2xl font-semibold text-white mb-2">{pkg.packageName}</h3>
        <div className="inline-block bg-slate-800 text-orange-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
          {getDurationLabel(pkg.durationType)}
        </div>
        <div className="flex justify-center items-baseline gap-1">
          <span className="text-4xl font-bold text-white">₹{formatted(Number(pkg.packagePrice))}</span>
        </div>
        <p className="text-slate-400 text-sm mt-2">
          Base up to {pkg.baseDoctorLimit} Doctor{pkg.baseDoctorLimit > 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex-grow">
        <ul className="space-y-4 mb-8">
          {pkg.features.split(',').map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
              <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{feature.trim()}</span>
            </li>
          ))}
          <li className="flex items-start gap-3 text-slate-300 text-sm">
            <svg className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Extra doctors at ₹{formatted(Number(pkg.extraDoctorPrice))}/each</span>
          </li>
        </ul>
      </div>

      <button
        onClick={() => onSelect(pkg)}
        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
          isPopular
            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90 shadow-lg'
            : 'bg-slate-800 text-white hover:bg-slate-700'
        }`}
      >
        Select Plan
      </button>
    </div>
  );
}
