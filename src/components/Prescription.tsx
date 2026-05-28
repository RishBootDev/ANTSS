import { useState, useEffect } from 'react';
import { fetchPackages, type Package } from '@/services/packageService';
import { PackageCard } from './prescription/PackageCard';
import { RegistrationFormModal } from './prescription/RegistrationFormModal';
import { RegistrationSuccess } from './prescription/RegistrationSuccess';

export function Prescription() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [pkgLoading, setPkgLoading] = useState(true);
  const [pkgError, setPkgError] = useState('');

  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [successData, setSuccessData] = useState({
    total: 0,
    doctors: 1,
    rmo: false,
    message: ''
  });

  useEffect(() => {
    const controller = new AbortController();
    setPkgLoading(true);
    fetchPackages(controller.signal)
      .then((data) => {
        setPackages(data.filter((p) => p.active));
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setPkgError('Could not load packages. Please try again later.');
        }
      })
      .finally(() => setPkgLoading(false));

    return () => controller.abort();
  }, []);

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPkg(pkg);
    setShowForm(true);
  };

  const handleRegistrationSuccess = (message: string, total: number, doctors: number, rmo: boolean) => {
    setSuccessData({ total, doctors, rmo, message });
    setConfirmed(true);
    setShowForm(false);
    setTimeout(() => {
      window.scrollTo({ top: document.getElementById('prescription')?.offsetTop || 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <section id="prescription" className="py-20 bg-slate-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-white">Choose Your Prescription Package</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Select the perfect plan for your hospital or clinic. Our packages are designed to scale with your needs.
          </p>
        </div>

        {pkgError && (
          <div className="mb-8 max-w-2xl mx-auto text-center text-sm text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-lg px-4 py-3">
            ⚠ {pkgError}
          </div>
        )}

        {pkgLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-900 rounded-2xl h-[450px] animate-pulse border border-slate-700"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {packages.map((pkg, index) => (
              <PackageCard 
                key={pkg.id} 
                pkg={pkg} 
                isPopular={index === 1} 
                onSelect={handleSelectPackage} 
              />
            ))}
          </div>
        )}

        {showForm && selectedPkg && (
          <RegistrationFormModal 
            selectedPkg={selectedPkg} 
            onClose={() => setShowForm(false)} 
            onSuccess={handleRegistrationSuccess} 
          />
        )}

        {confirmed && selectedPkg && (
          <RegistrationSuccess 
            packageName={selectedPkg.packageName}
            doctors={successData.doctors}
            rmo={successData.rmo}
            total={successData.total}
            serverMessage={successData.message}
          />
        )}
      </div>
    </section>
  );
}
