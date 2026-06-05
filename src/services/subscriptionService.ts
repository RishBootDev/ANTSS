import type { ApiResponse } from './authService';
import { API_BASE } from '@/lib/apiClient';

export interface Subscription {
  id: string;
  userId: string;
  packageId: number;
  packageName: string;
  startDate: string;
  endDate: string;
  allowedDoctors: number;
  usedDoctors: number;
  paymentStatus: string;
  subscriptionStatus: string;
}

export interface DoctorAddon {
  id: number;
  userSubscriptionId: string;
  additionalDoctors: number;
  yearlyPricePerDoctor: number;
  remainingMonths: number;
  prorataAmount: number;
  startDate: string;
  endDate: string;
  paymentStatus: string;
  approvalStatus: string;
  approvedByUserId?: string;
  approvedAt?: string;
}

export interface AddDoctorAddonRequest {
  userSubscriptionId: string;
  additionalDoctors: number;
  facilityType?: 'HOSPITAL' | 'CLINIC';
  facilityId?: number;
  entityId?: number;
  hospitalId?: number;
  clinicId?: number;
}

function getHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}



export async function getActiveSubscriptions(token: string): Promise<ApiResponse<Subscription[]>> {
  const res = await fetch(`${API_BASE}/subscriptions/active`, {
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || (Array.isArray(body) ? body : []),
  };
}

export async function getAddonRequests(token: string): Promise<ApiResponse<DoctorAddon[]>> {
  const res = await fetch(`${API_BASE}/subscriptions/addons`, {
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || (Array.isArray(body) ? body : []),
  };
}

export async function requestDoctorAddon(
  token: string,
  payload: AddDoctorAddonRequest
): Promise<ApiResponse<DoctorAddon>> {

  const url = `${API_BASE}/subscriptions/addons`;

  console.log("=== REQUEST ===");
  console.log("URL:", url);
  console.log("Method:", "POST");
  console.log("Headers:", getHeaders(token));
  console.log("Payload:", payload);
  console.log("Payload JSON:", JSON.stringify(payload));

  const res = await fetch(url, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(payload),
  });

  console.log("=== RESPONSE ===");
  console.log("Status:", res.status);
  console.log("Status Text:", res.statusText);
  console.log("OK:", res.ok);

  const body = await res.json().catch(() => ({}));

  console.log("Response Body:", body);

  const response = {
    success: res.ok,
    message: body.message,
    data: body.data || body,
  };

  console.log("Parsed Response:", response);

  return response;
}

// --- New: user subscription summary endpoints ---
import type { IUserSubscriptionSummary } from '../interfaces/IUserSubscriptionSummary';

/**
 * getSubscriptionSummary
 * GET /api/user/subscriptions/{userId}/summary
 */
export async function getSubscriptionSummary(
  token: string,
  userId: string,
): Promise<ApiResponse<IUserSubscriptionSummary>> {
  const res = await fetch(`${API_BASE}/user/subscriptions/${userId}/summary`, {
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || body,
  };
}

/**
 * isSubscriptionValid
 * GET /api/user/subscriptions/{userId}/valid
 */
export async function isSubscriptionValid(token: string, userId: string): Promise<ApiResponse<boolean>> {
  const res = await fetch(`${API_BASE}/user/subscriptions/${userId}/valid`, {
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: typeof body.data !== 'undefined' ? body.data : (body || false),
  };
}

/**
 * getRemainingDoctorSlots
 * GET /api/user/subscriptions/{userId}/doctor-slots
 */
export async function getRemainingDoctorSlots(token: string, userId: string): Promise<ApiResponse<number>> {
  const res = await fetch(`${API_BASE}/user/subscriptions/${userId}/doctor-slots`, {
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: typeof body.data !== 'undefined' ? body.data : (typeof body === 'number' ? body : undefined),
  };
}
