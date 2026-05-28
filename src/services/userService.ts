import type { ApiResponse } from './authService';

export interface Hospital {
  id: number;
  hospitalName: string;
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
  clinicName: string;
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

function getHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

export async function getProfile(token: string): Promise<ApiResponse> {
  const res = await fetch('/api/user/profile', {
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
  const res = await fetch('/api/hospitals', {
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || (Array.isArray(body) ? body : []),
  };
}

export async function addHospital(token: string, hospital: Omit<Hospital, 'id'>): Promise<ApiResponse<Hospital>> {
  const res = await fetch('/api/hospitals', {
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
  const res = await fetch(`/api/hospitals/${id}`, {
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
  const res = await fetch('/api/clinics', {
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || (Array.isArray(body) ? body : []),
  };
}

export async function addClinic(token: string, clinic: Omit<Clinic, 'id'>): Promise<ApiResponse<Clinic>> {
  const res = await fetch('/api/clinics', {
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
  const res = await fetch(`/api/clinics/${id}`, {
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
  const res = await fetch('/api/doctors', {
    headers: getHeaders(token),
  });
  const body = await res.json().catch(() => ({}));
  return {
    success: res.ok,
    message: body.message,
    data: body.data || (Array.isArray(body) ? body : []),
  };
}

export async function addDoctor(token: string, doctor: Partial<Doctor>): Promise<ApiResponse<Doctor>> {
  const res = await fetch('/api/doctors', {
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
  const res = await fetch(`/api/doctors/${id}`, {
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
