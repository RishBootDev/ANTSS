import { Link } from 'react-router-dom';

interface RegistrationSuccessProps {
  packageName: string;
  doctors: number;
  rmo: boolean;
  total: number;
  serverMessage: string;
}

export function RegistrationSuccess({ packageName, doctors, rmo, total, serverMessage }: RegistrationSuccessProps) {
  const formatted = (n: number) => n.toLocaleString('en-IN');

  return (
    <div className="mt-12 p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 backdrop-blur-md shadow-2xl max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-emerald-400">
            <div className="bg-emerald-500/20 p-2 rounded-full">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold">Registration Successful!</h3>
          </div>
          <p className="text-emerald-100/80 text-lg">
            You successfully registered for the <span className="font-semibold text-white">{packageName}</span> with <span className="font-semibold text-white">{doctors}</span> doctor(s){rmo ? ' and the RMO App' : ''}.
          </p>
          <div className="bg-slate-900/50 rounded-xl p-4 border border-emerald-500/10 flex items-center justify-between">
            <div className="text-sm text-emerald-200/60">Total Amount</div>
            <div className="text-xl font-bold text-white">₹{formatted(total)}</div>
          </div>
          {serverMessage && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-900/40 border border-emerald-500/20 text-sm text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {serverMessage}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 min-w-[200px]">
          <div className="bg-slate-900/60 rounded-xl p-4 border border-emerald-500/20 text-center">
            <p className="text-sm text-emerald-300/80 mb-3">Your account is ready.</p>
            <Link
              to="/login"
              className="block w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-emerald-500/20 transition-all text-center"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
