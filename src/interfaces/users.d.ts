export interface IUserResponse {
  id: number;
  address: string;
  disabled: boolean;
  email: string;
  lastName: string;
  locked: boolean;
  name: string;
  paypalEmail: null | string;
  phone: string;
  status: string;
  cantonId: number | null;
  paisId: number;
  userId: null;
  user_role: UserRole[];
  canton_ce: CantonCe;
  isOnline: boolean;
}

export interface CantonCe {
  id: number;
  nombre: string;
  status: string;
  provinceId: number;
  province_ce: ProvinceCe;
}

export interface ProvinceCe {
  id_province: number;
  name: string;
  status: string;
}

export interface UserRole {
  roleId: number;
}
