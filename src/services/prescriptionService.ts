import { API_BASE } from '@/lib/apiClient';

export type PrescriptionRegistrationPayload = {
  name: string;
  email: string;
  phone: string;
  hospital: string;
  hospitalPhone?: string;
  address: string;
  city: string;
  state: string;
  doctors: number;
  rmo: boolean;
  packageName?: string; // defaults to 'Prescription'
  packageId?: number;   // backend package id
};

export type PrescriptionRegistrationResponse = {
  success: boolean;
  message?: string;
  id?: string; // optional server-side id for the registration
  data?: any; // server may echo back data
};

/**
 * registerPrescription
 * Sends registration payload to the backend /api/auth/register endpoint.
 * Maps PrescriptionRegistrationPayload → backend RegisterRequest field names.
 *
 * - url: optional full endpoint override.
 * - signal: optional AbortSignal for request cancellation
 */
export async function registerPrescription(
  payload: PrescriptionRegistrationPayload,
  options?: { url?: string; signal?: AbortSignal },
): Promise<PrescriptionRegistrationResponse> {
  const endpoint = options?.url ?? `${API_BASE}/auth/register`;

  // Generate a temporary password if not provided
  const tempPassword = `P@ss${Math.random().toString(36).slice(-10)}`;

  // Map to backend RegisterRequest field names
  const body = JSON.stringify({
    fullName: payload.name,
    email: payload.email,
    mobileNumber: payload.phone,          // phone → mobileNumber
    userType: 'CLINIC',                    // default for prescription registrations
    entityName: payload.hospital,          // hospital → entityName
    addressLine1: payload.address,         // address → addressLine1
    city: payload.city,
    state: payload.state,
    packageId: payload.packageId ?? 1,
    allowedDoctors: payload.doctors,       // doctors → allowedDoctors
    password: tempPassword,
    confirmPassword: tempPassword,
  });

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    signal: options?.signal,
  });

  if (!res.ok) {
    let errBody: any = undefined;
    try {
      errBody = await res.json();
    } catch (e) {
      // ignore
    }
    return {
      success: false,
      message: errBody?.message ?? `Request failed with status ${res.status}`,
      data: errBody,
    };
  }

  const data = await res.json().catch(() => null);

  return {
    success: true,
    message: data?.message,
    id: data?.id,
    data,
  };
}

// Convenience wrapper that accepts the frontend RegisterRequest interface
import type { IRegisterRequest } from '../interfaces/IRegisterRequest';

export async function registerWithInterface(
  req: IRegisterRequest,
  options?: { url?: string; signal?: AbortSignal },
): Promise<PrescriptionRegistrationResponse> {
  // Map fields from IRegisterRequest to PrescriptionRegistrationPayload
  const payload: PrescriptionRegistrationPayload = {
    name: req.fullName,
    email: req.email,
    phone: req.mobile,
    hospital: req.clinicName,
    address: req.address ?? '',
    city: req.city ?? '',
    state: req.state ?? '',
    doctors: req.numDoctors,
    rmo: false,
    packageName: undefined,
  };

  return registerPrescription(payload, options);
}

