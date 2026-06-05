import type { IRegisterRequest } from '../interfaces/IRegisterRequest';
import { API_BASE } from '@/lib/apiClient';

export type ApiResponse<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
};

/**
 * BackendRegisterPayload
 * Matches com.antss_prescription.dto.request.RegisterRequest on the Spring Boot side.
 */
type BackendRegisterPayload = {
  fullName: string;
  email: string;
  mobileNumber: string;
  userType: 'HOSPITAL' | 'CLINIC' | 'DOCTOR';
  entityName: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  pincode?: string;
  packageId: number;
  password: string;
  confirmPassword: string;
  allowedHospitals?: number;
  allowedClinics?: number;
  allowedDoctors?: number;
};

/**
 * register
 * Maps frontend IRegisterRequest → backend RegisterRequest and POSTs to /api/auth/register.
 * The /api prefix is proxied to http://localhost:2030 by Vite in development.
 */
export async function register(
  payload: IRegisterRequest,
  options?: { url?: string; signal?: AbortSignal },
): Promise<ApiResponse<void>> {
  const endpoint = options?.url ?? `${API_BASE}/auth/register`;

  // Map frontend field names → backend field names
  const backendPayload: BackendRegisterPayload = {
    fullName: payload.fullName,
    email: payload.email,
    mobileNumber: payload.mobile,            // mobile → mobileNumber
    userType: payload.userType ?? 'CLINIC',   // dynamic selection or default
    entityName: payload.clinicName,           // clinicName → entityName
    addressLine1: payload.address ?? '',      // address → addressLine1
    city: payload.city ?? '',
    state: payload.state ?? '',
    packageId: payload.packageId,
    password: payload.password,
    confirmPassword: payload.confirmPassword,
    allowedDoctors: payload.numDoctors,       // numDoctors → allowedDoctors
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(backendPayload),
    signal: options?.signal,
  });

  let body: any = undefined;
  try {
    body = await res.json();
  } catch (e) {
    // ignore json parse errors
  }

  if (!res.ok) {
    return {
      success: false,
      message: body?.message ?? `Request failed with status ${res.status}`,
      data: body?.data,
    };
  }

  return {
    success: true,
    message: body?.message,
    data: body?.data,
  };
}

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    mobileNumber: string;
    userType: string;
    status: string;
    role: 'ROLE_USER' | 'ROLE_ADMIN';
    registrationDate: string;
    createdAt: string;
  };
};

/**
 * loginUser
 * Sends credentials to /api/auth/login and returns response payload.
 */
export async function loginUser(
  email: string,
  password: string,
  options?: { signal?: AbortSignal },
): Promise<ApiResponse<LoginResponse>> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    signal: options?.signal,
  });

  let body: any = undefined;
  try {
    body = await res.json();
  } catch (e) {
    // ignore
  }

  if (!res.ok) {
    return {
      success: false,
      message: body?.message ?? `Login failed with status ${res.status}`,
    };
  }

  return {
    success: true,
    message: body?.message,
    data: body?.data,
  };
}

/**
 * forgotPassword
 * Sends email to request password reset token.
 */
export async function forgotPassword(
  email: string,
  options?: { signal?: AbortSignal },
): Promise<ApiResponse<void>> {
  const res = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
    signal: options?.signal,
  });

  let body: any = undefined;
  try {
    body = await res.json();
  } catch (e) {
    // ignore
  }

  if (!res.ok) {
    return {
      success: false,
      message: body?.message ?? `Request failed with status ${res.status}`,
    };
  }

  return {
    success: true,
    message: body?.message ?? 'Password reset link sent to your email.',
  };
}

/**
 * resetPassword
 * Resets the password using the received token.
 */
export async function resetPassword(
  token: string,
  newPassword: string,
  confirmPassword: string,
  options?: { signal?: AbortSignal },
): Promise<ApiResponse<void>> {
  const res = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword, confirmPassword }),
    signal: options?.signal,
  });

  let body: any = undefined;
  try {
    body = await res.json();
  } catch (e) {
    // ignore
  }

  if (!res.ok) {
    return {
      success: false,
      message: body?.message ?? `Password reset failed with status ${res.status}`,
    };
  }

  return {
    success: true,
    message: body?.message ?? 'Password reset successfully.',
  };
}

