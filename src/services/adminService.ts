import type { ApiResponse } from './authService';
import type { Hospital, Clinic } from './userService';
import type { Package } from './packageService';
import { API_BASE } from '@/lib/apiClient';

export interface AdminUserResponse {
  id: string; // backend uses UUID
  fullName: string;
  email: string;
  mobileNumber: string;
  userType: 'HOSPITAL' | 'CLINIC' | 'DOCTOR';
  entityName?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  pincode?: string;
  allowedDoctors?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'INACTIVE' | 'EXPIRED';
  active: boolean;
}

export interface DoctorAddonResponse {
  id: number;
  userSubscriptionId: string;
  additionalDoctors: number;
  addonPrice: number;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  approvedByUserId?: string;
  approvedAt?: string;
  // Let's add extra display helpers
  entityName?: string;
  userEmail?: string;
  yearlyPricePerDoctor?: number;
  remainingMonths?: number;
  prorataAmount?: number;
  // Additional fields returned by backend for pending addon requests
  username?: string;
  entityType?: string;
  state?: string;
  city?: string;
  address?: string;
}

export interface AdminStats {
  totalUsers: number;
  pendingApprovals: number;
  totalHospitals: number;
  totalClinics: number;
  activePackages: number;
}

function getHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}



/**
 * getAllUsers
 * GET /api/user/subscriptions/get-all-users
 * Returns a list of all users (admin-only endpoint)
 */
export async function getAllUsers(token: string): Promise<ApiResponse<AdminUserResponse[]>> {
  const res = await fetch(`${API_BASE}/user/subscriptions/get-all-users`, {
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  const raw = body.data || (Array.isArray(body) ? body : []);
  // backend returns user objects with `userId` and subscription-related fields —
  // map them to AdminUserResponse expected by the UI
  const mapped: AdminUserResponse[] = (Array.isArray(raw) ? raw : []).map((it: any) => ({
    id: it.userId || it.id,
    fullName: it.fullName || it.name || '',
    email: it.email || '',
    mobileNumber: it.mobileNumber || it.mobile || '',
    // best-effort mapping for userType/entity fields
    userType: (it.userType as any) || 'DOCTOR',
    entityName: it.entityName || it.packageName || undefined,
    addressLine1: it.addressLine1,
    city: it.city,
    state: it.state,
    pincode: it.pincode,
    allowedDoctors: typeof it.allowedDoctors === 'number' ? it.allowedDoctors : (it.allowedDoctorLimit ?? 0),
    // derive status from subscriptionStatus where possible
    status: it.subscriptionStatus === 'ACTIVE' ? 'APPROVED' : (it.subscriptionStatus === 'EXPIRED' ? 'EXPIRED' : (it.subscriptionStatus ? 'INACTIVE' : 'INACTIVE')),
    active: !!(it.subscriptionStatus === 'ACTIVE')
  }));

  return {
    success: res.ok,
    message: body.message,
    data: mapped,
  };
}

export async function getUsers(token: string): Promise<ApiResponse<AdminUserResponse[]>> {
  const res = await fetch(`${API_BASE}/admin/registrations/pending`, {
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || (Array.isArray(body) ? body : []),
  };
}

export async function approveUser(token: string, userId: string): Promise<ApiResponse<AdminUserResponse>> {
  const res = await fetch(`${API_BASE}/admin/users/${userId}/approve`, {
    method: 'POST',
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data,
  };
}

export async function rejectUser(token: string, userId: string): Promise<ApiResponse<AdminUserResponse>> {
  const res = await fetch(`${API_BASE}/admin/users/${userId}/reject`, {
    method: 'POST',
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data,
  };
}

export async function modifyUserPackage(token: string, userId: string, packageId: number): Promise<ApiResponse<AdminUserResponse>> {
  const res = await fetch(`${API_BASE}/admin/users/${userId}/package`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify({ packageId }),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data,
  };
}

export async function extendUserValidity(token: string, userId: string, days: number): Promise<ApiResponse<AdminUserResponse>> {
  const res = await fetch(`${API_BASE}/admin/users/${userId}/extend`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify({ days }),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data,
  };
}

export async function blockUser(token: string, userId: string): Promise<ApiResponse<AdminUserResponse>> {
  const res = await fetch(`${API_BASE}/admin/users/${userId}/block`, {
    method: 'PUT',
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data,
  };
}

export async function unblockUser(token: string, userId: string): Promise<ApiResponse<AdminUserResponse>> {
  const res = await fetch(`${API_BASE}/admin/users/${userId}/unblock`, {
    method: 'PUT',
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data,
  };
}

export async function getAdminHospitals(_token: string): Promise<ApiResponse<Hospital[]>> {
  // Gracefully fallback to empty array since the backend lacks a list-all-hospitals admin endpoint
  return {
    success: true,
    data: [],
  };
}

export async function getAdminClinics(_token: string): Promise<ApiResponse<Clinic[]>> {
  // Gracefully fallback to empty array since the backend lacks a list-all-clinics admin endpoint
  return {
    success: true,
    data: [],
  };
}

export async function createAdminPackage(token: string, pkg: Omit<Package, 'id'>): Promise<ApiResponse<Package>> {
  const res = await fetch(`${API_BASE}/packages`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(pkg),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || body,
  };
}

export async function updateAdminPackage(token: string, id: number, pkg: Partial<Package>): Promise<ApiResponse<Package>> {
  const res = await fetch(`${API_BASE}/packages/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(pkg),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || body,
  };
}

export async function getAdminStats(_token: string): Promise<ApiResponse<AdminStats>> {
  // Gracefully fallback to mock stats since the backend lacks a system stats admin endpoint
  return {
    success: true,
    data: {
      totalUsers: 0,
      pendingApprovals: 0,
      totalHospitals: 0,
      totalClinics: 0,
      activePackages: 3,
    },
  };
}

export async function getPendingAddons(token: string): Promise<ApiResponse<DoctorAddonResponse[]>> {
  const res = await fetch(`${API_BASE}/admin/addons/pending`, {
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || (Array.isArray(body) ? body : []),
  };
}

export async function approveAddon(token: string, addonId: number): Promise<ApiResponse<DoctorAddonResponse>> {
  const res = await fetch(`${API_BASE}/admin/addons/${addonId}/approve`, {
    method: 'POST',
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data,
  };
}

export async function rejectAddon(token: string, addonId: number): Promise<ApiResponse<DoctorAddonResponse>> {
  const res = await fetch(`${API_BASE}/admin/addons/${addonId}/reject`, {
    method: 'POST',
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data,
  };
}
