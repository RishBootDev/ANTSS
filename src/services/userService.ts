import type { ApiResponse } from './authService';
import { API_BASE } from '@/lib/apiClient';

export interface Hospital {
  id: number;
  userId?: string;
  hospitalName: string;
  hospitalCode?: string;
  email?: string;
  mobileNumber?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  pincode?: string;
  maxDoctorLimit?: number;
  activeDoctorCount?: number;
  status?: string;
}

export interface Clinic {
  id: number;
  userId?: string;
  clinicName: string;
  clinicCode?: string;
  email: string;
  mobileNumber?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  pincode?: string;
  maxDoctorLimit?: number;
  activeDoctorCount?: number;
  status?: string;
}

export interface Doctor {
  id: string;
  doctorName: string;
  doctorCode?: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  email?: string;
  mobileNumber?: string;
  registrationNumber: string;
  signatureUrl?: string;
  hospitalId?: number;
  clinicId?: number;
  status?: string;
}

export interface Rmo {
  id: string;
  userId?: string;
  rmoName: string;
  email: string;
  mobileNumber?: string;
  employeeCode: string;
  hospitalId?: number;
  clinicId?: number;
  role: 'RMO' | 'NURSE' | 'RECEPTIONIST' | 'STAFF' | string;
  status?: string;
}

function getHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

export async function getProfile(token: string): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE}/user/profile`, {
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || body,
  };
}

export async function getHospitals(token: string): Promise<ApiResponse<Hospital[]>> {
  const res = await fetch(`${API_BASE}/hospitals`, {
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || (Array.isArray(body) ? body : []),
  };
}

export async function getHospitalById(token: string, id: number): Promise<ApiResponse<Hospital>> {
  const res = await fetch(`${API_BASE}/hospitals/${id}`, {
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || body,
  };
}

export async function addHospital(token: string, hospital: Omit<Hospital, 'id'>): Promise<ApiResponse<Hospital>> {
  const res = await fetch(`${API_BASE}/hospitals`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(hospital),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || body,
  };
}

export async function updateHospital(token: string, id: number, hospital: Partial<Hospital>): Promise<ApiResponse<Hospital>> {
  const res = await fetch(`${API_BASE}/hospitals/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(hospital),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || body,
  };
}

export async function getClinics(token: string): Promise<ApiResponse<Clinic[]>> {
  const res = await fetch(`${API_BASE}/clinics`, {
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || (Array.isArray(body) ? body : []),
  };
}

export async function getClinicById(token: string, id: number): Promise<ApiResponse<Clinic>> {
  const res = await fetch(`${API_BASE}/clinics/${id}`, {
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || body,
  };
}

export async function addClinic(token: string, clinic: Omit<Clinic, 'id'>): Promise<ApiResponse<Clinic>> {
  const res = await fetch(`${API_BASE}/clinics`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(clinic),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || body,
  };
}

export async function updateClinic(token: string, id: number, clinic: Partial<Clinic>): Promise<ApiResponse<Clinic>> {
  const res = await fetch(`${API_BASE}/clinics/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(clinic),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || body,
  };
}

export async function getDoctors(token: string): Promise<ApiResponse<Doctor[]>> {
  const res = await fetch(`${API_BASE}/doctors`, {
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || (Array.isArray(body) ? body : []),
  };
}

export async function getDoctorById(token: string, id: string): Promise<ApiResponse<Doctor>> {
  const res = await fetch(`${API_BASE}/doctors/${id}`, {
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || body,
  };
}

export async function addDoctor(token: string, doctor: Partial<Doctor>): Promise<ApiResponse<Doctor>> {
  const res = await fetch(`${API_BASE}/doctors`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(doctor),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || body,
  };
}

export async function updateDoctor(token: string, id: string, doctor: Partial<Doctor>): Promise<ApiResponse<Doctor>> {
  const res = await fetch(`${API_BASE}/doctors/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(doctor),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || body,
  };
}

export async function deleteDoctor(token: string, id: string): Promise<ApiResponse<void>> {
  const res = await fetch(`${API_BASE}/doctors/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data,
  };
}

export async function getRmos(token: string): Promise<ApiResponse<Rmo[]>> {
  const res = await fetch(`${API_BASE}/rmos`, {
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || (Array.isArray(body) ? body : []),
  };
}

export async function getRmoById(token: string, id: string): Promise<ApiResponse<Rmo>> {
  const res = await fetch(`${API_BASE}/rmos/${id}`, {
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || body,
  };
}

export async function addRmo(token: string, rmo: Omit<Rmo, 'id' | 'userId' | 'status'>): Promise<ApiResponse<Rmo>> {
  const res = await fetch(`${API_BASE}/rmos`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(rmo),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || body,
  };
}

export async function updateRmo(token: string, id: string, rmo: Omit<Rmo, 'id' | 'userId' | 'status'>): Promise<ApiResponse<Rmo>> {
  const res = await fetch(`${API_BASE}/rmos/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(rmo),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || body,
  };
}

export async function deleteRmo(token: string, id: string): Promise<ApiResponse<void>> {
  const res = await fetch(`${API_BASE}/rmos/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data,
  };
}
