export interface IRegisterRequest {
  fullName: string;
  clinicName: string;
  email: string;
  mobile: string;

  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;

  packageId: number;
  numDoctors: number;

  userType?: 'CLINIC' | 'HOSPITAL';

  password?: string;
  confirmPassword?: string;
}
