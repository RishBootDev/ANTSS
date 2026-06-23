import React, { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { requestDoctorAddon } from '../../services/subscriptionService';
import type { Clinic, Hospital } from '../../services/userService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddonModalProps {
  token: string;
  subscriptionId: string;
  hospitals: Hospital[];
  clinics: Clinic[];
  onClose: () => void;
  onSuccess: () => void;
}

type FacilityOption = {
  value: string;
  type: 'hospital' | 'clinic';
  id: number;
  userId?: string;
  name: string;
  code?: string;
  location?: string;
};

export default function AddonModal({
  token,
  subscriptionId,
  hospitals,
  clinics,
  onClose,
  onSuccess,
}: AddonModalProps) {
  const [additionalDoctors, setAdditionalDoctors] = useState<number>(1);
  const [selectedFacility, setSelectedFacility] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const facilityOptions = useMemo<FacilityOption[]>(() => [
    ...hospitals.map((hospital) => ({
      value: `hospital:${hospital.id}`,
      type: 'hospital' as const,
      id: hospital.id,
      userId: hospital.userId,
      name: hospital.hospitalName,
      code: hospital.hospitalCode,
      location: [hospital.city, hospital.state].filter(Boolean).join(', '),
    })),
    ...clinics.map((clinic) => ({
      value: `clinic:${clinic.id}`,
      type: 'clinic' as const,
      id: clinic.id,
      userId: clinic.userId,
      name: clinic.clinicName,
      code: clinic.clinicCode,
      location: [clinic.city, clinic.state].filter(Boolean).join(', '),
    })),
  ], [clinics, hospitals]);

  useEffect(() => {
    if (!facilityOptions.length) {
      setSelectedFacility('');
      return;
    }

    if (!facilityOptions.some((option) => option.value === selectedFacility)) {
      setSelectedFacility(facilityOptions[0].value);
    }
  }, [facilityOptions, selectedFacility]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (additionalDoctors < 1) {
      setError('Please request at least 1 doctor.');
      return;
    }

    const facility = facilityOptions.find((option) => option.value === selectedFacility);
    if (!facility) {
      setError('Please select a hospital or clinic.');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const res = await requestDoctorAddon(token, {
        userSubscriptionId: subscriptionId,
        additionalDoctors,
        entityId: facility.id,
        entityType: facility.type === 'hospital' ? 'HOSPITAL' : 'CLINIC',
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
      <form onSubmit={handleSubmit} className="relative z-10 bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl max-w-md w-full">
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
          <div className="space-y-2">
            <Label htmlFor="facility" className="text-xs font-semibold text-gray-400 uppercase">
              Hospital / Clinic
            </Label>
            <Select
              value={selectedFacility}
              onValueChange={setSelectedFacility}
              disabled={loading || facilityOptions.length === 0}
            >
              <SelectTrigger
                id="facility"
                className="w-full border-white/10 bg-slate-950 text-white focus:ring-orange-500"
              >
                <SelectValue placeholder="Select hospital or clinic" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-slate-900 text-white">
                {facilityOptions.map((facility) => (
                  <SelectItem
                    key={facility.value}
                    value={facility.value}
                    className="focus:bg-white/10 focus:text-white"
                  >
                    <span className="flex flex-col">
                      <span>{facility.name}</span>
                      <span className="text-xs text-gray-400">
                        {facility.type === 'hospital' ? 'Hospital' : 'Clinic'}
                        {facility.code ? ` - ${facility.code}` : ''}
                        {facility.location ? ` - ${facility.location}` : ''}
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {facilityOptions.length === 0 && (
              <p className="text-xs text-amber-400">
                Add a hospital or clinic before requesting doctor addons.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional-doctors" className="text-xs font-semibold text-gray-400 uppercase">
              Number of Additional Doctors
            </Label>
            <Input
              id="additional-doctors"
              type="number"
              min="1"
              value={additionalDoctors}
              onChange={(e) => setAdditionalDoctors(parseInt(e.target.value) || 1)}
              className="w-full text-white"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 border-t border-white/5 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || facilityOptions.length === 0}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow hover:opacity-95"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Request Addon</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
