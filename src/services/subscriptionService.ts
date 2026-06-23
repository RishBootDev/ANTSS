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
  entityId: number;
  entityType: 'HOSPITAL' | 'CLINIC';
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

  const res = await fetch(`${API_BASE}/subscriptions/addons`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(payload),
  });

  const body = await res.json().catch(() => ({}));

  return {
    success: res.ok,
    message: body.message,
    data: body.data || body,
  };
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

export async function getSubscriptionHistory(token: string, userId: string): Promise<ApiResponse<IUserSubscriptionSummary[]>> {
  const res = await fetch(`${API_BASE}/user/subscriptions/${userId}/history`, {
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return { success: res.ok, message: body.message, data: body.data || (Array.isArray(body) ? body : []) };
}

export async function canAddDoctor(token: string, userId: string): Promise<ApiResponse<boolean>> {
  const res = await fetch(`${API_BASE}/user/subscriptions/${userId}/can-add-doctor`, { headers: getHeaders(token) });
  const body = await res.json().catch(() => ({}));
  return { success: res.ok, message: body.message, data: typeof body.data !== 'undefined' ? body.data : body };
}

export async function canAddHospital(token: string, userId: string): Promise<ApiResponse<boolean>> {
  const res = await fetch(`${API_BASE}/user/subscriptions/${userId}/can-add-hospital`, { headers: getHeaders(token) });
  const body = await res.json().catch(() => ({}));
  return { success: res.ok, message: body.message, data: typeof body.data !== 'undefined' ? body.data : body };
}

export async function canAddClinic(token: string, userId: string): Promise<ApiResponse<boolean>> {
  const res = await fetch(`${API_BASE}/user/subscriptions/${userId}/can-add-clinic`, { headers: getHeaders(token) });
  const body = await res.json().catch(() => ({}));
  return { success: res.ok, message: body.message, data: typeof body.data !== 'undefined' ? body.data : body };
}

export async function canCreatePrescription(token: string, userId: string): Promise<ApiResponse<boolean>> {
  const res = await fetch(`${API_BASE}/user/subscriptions/${userId}/can-create-prescription`, { headers: getHeaders(token) });
  const body = await res.json().catch(() => ({}));
  return { success: res.ok, message: body.message, data: typeof body.data !== 'undefined' ? body.data : body };
}

export async function getEffectiveAllowedDoctors(token: string, userId: string): Promise<ApiResponse<number>> {
  const res = await fetch(`${API_BASE}/user/subscriptions/${userId}/effective-allowed-doctors`, { headers: getHeaders(token) });
  const body = await res.json().catch(() => ({}));
  return { success: res.ok, message: body.message, data: body.data ?? body };
}

export async function renewSubscription(token: string, subscriptionId: string): Promise<ApiResponse<IUserSubscriptionSummary>> {
  const res = await fetch(`${API_BASE}/user/subscriptions/${subscriptionId}/renew`, {
    method: 'POST',
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return { success: res.ok, message: body.message, data: body.data || body };
}

export async function upgradeSubscription(token: string, userId: string, newPackageId: number): Promise<ApiResponse<IUserSubscriptionSummary>> {
  const res = await fetch(`${API_BASE}/user/subscriptions/${userId}/upgrade?newPackageId=${encodeURIComponent(newPackageId)}`, {
    method: 'POST',
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return { success: res.ok, message: body.message, data: body.data || body };
}

export async function cancelSubscription(token: string, userId: string, cancelledBy: string): Promise<ApiResponse<void>> {
  const res = await fetch(`${API_BASE}/user/subscriptions/${userId}/cancel?cancelledBy=${encodeURIComponent(cancelledBy)}`, {
    method: 'POST',
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return { success: res.ok, message: body.message, data: body.data };
}

export async function getSubscriptionAddons(token: string, subscriptionId: string): Promise<ApiResponse<DoctorAddon[]>> {
  const res = await fetch(`${API_BASE}/user/subscriptions/${subscriptionId}/addons`, { headers: getHeaders(token) });
  const body = await res.json().catch(() => ({}));
  return { success: res.ok, message: body.message, data: body.data || (Array.isArray(body) ? body : []) };
}

export async function getActiveSubscriptionAddons(token: string, subscriptionId: string): Promise<ApiResponse<DoctorAddon[]>> {
  const res = await fetch(`${API_BASE}/user/subscriptions/${subscriptionId}/addons/active`, { headers: getHeaders(token) });
  const body = await res.json().catch(() => ({}));
  return { success: res.ok, message: body.message, data: body.data || (Array.isArray(body) ? body : []) };
}

export async function requestSubscriptionDoctorAddon(
  token: string,
  subscriptionId: string,
  additionalDoctors: number,
  entityId: number,
  entityType: 'HOSPITAL' | 'CLINIC',
): Promise<ApiResponse<number>> {
  const params = new URLSearchParams({
    additionalDoctors: String(additionalDoctors),
    facilityId: String(entityId),
    facilityType: entityType,
  });
  const res = await fetch(`${API_BASE}/user/subscriptions/${subscriptionId}/addons/request?${params}`, {
    method: 'POST',
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return { success: res.ok, message: body.message, data: body.data ?? body };
}

export async function allocateDoctor(token: string, subscriptionId: string, doctorId: string, allocationType = 'BASE'): Promise<ApiResponse<void>> {
  const params = new URLSearchParams({ doctorId, allocationType });
  const res = await fetch(`${API_BASE}/user/subscriptions/${subscriptionId}/allocate-doctor?${params}`, {
    method: 'POST',
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return { success: res.ok, message: body.message, data: body.data };
}

export async function deallocateDoctor(token: string, subscriptionId: string, doctorId: string): Promise<ApiResponse<void>> {
  const params = new URLSearchParams({ doctorId });
  const res = await fetch(`${API_BASE}/user/subscriptions/${subscriptionId}/deallocate-doctor?${params}`, {
    method: 'POST',
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return { success: res.ok, message: body.message, data: body.data };
}

export async function getLinkedHospitals(token: string, userId: string): Promise<ApiResponse<any[]>> {
  const res = await fetch(`${API_BASE}/user/subscriptions/${userId}/linked-hospitals`, { headers: getHeaders(token) });
  const body = await res.json().catch(() => ({}));
  return { success: res.ok, message: body.message, data: body.data || (Array.isArray(body) ? body : []) };
}

export async function getLinkedClinics(token: string, userId: string): Promise<ApiResponse<any[]>> {
  const res = await fetch(`${API_BASE}/user/subscriptions/${userId}/linked-clinics`, { headers: getHeaders(token) });
  const body = await res.json().catch(() => ({}));
  return { success: res.ok, message: body.message, data: body.data || (Array.isArray(body) ? body : []) };
}
