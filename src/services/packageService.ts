/**
 * Package types matching backend PackageResponse DTO
 * (com.antss_prescription.dto.response.PackageResponse)
 */
import { API_BASE } from '@/lib/apiClient';

export type DurationType = 'MONTHLY' | 'QUARTERLY' | 'SIX_MONTH' | 'ONE_YEAR' | 'TWO_YEAR' | 'YEARLY' | 'LIFETIME';

export type Package = {
  id: number;
  packageName: string;
  durationType: DurationType;
  baseDoctorLimit: number;
  packagePrice: number;
  extraDoctorPrice: number;
  features: string;
  active: boolean;
};

export type PackageApiResponse = {
  success: boolean;
  message?: string;
  data?: Package[];
};

/**
 * fetchPackages
 * Fetches all active subscription packages from GET /api/packages (public endpoint).
 * The /api prefix is proxied to http://localhost:2030 by Vite in development.
 */
export async function fetchPackages(signal?: AbortSignal): Promise<Package[]> {
  const res = await fetch(`${API_BASE}/packages`, { signal });

  if (!res.ok) {
    throw new Error(`Failed to load packages: ${res.status}`);
  }

  const body: PackageApiResponse = await res.json();
  return body.data ?? [];
}
