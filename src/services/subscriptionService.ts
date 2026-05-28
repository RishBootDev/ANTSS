import type { ApiResponse } from './authService';

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
}

function getHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

export async function getActiveSubscriptions(token: string): Promise<ApiResponse<Subscription[]>> {
  const res = await fetch('/api/subscriptions/active', {
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
  const res = await fetch('/api/subscriptions/addons', {
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || (Array.isArray(body) ? body : []),
  };
}

export async function requestDoctorAddon(token: string, payload: AddDoctorAddonRequest): Promise<ApiResponse<DoctorAddon>> {
  const res = await fetch('/api/subscriptions/addons', {
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
