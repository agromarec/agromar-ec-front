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
  pais_ce: any;
  allowPaypalPayments: boolean;
  allowBankTransfers: boolean;
  bankTransfersInfo: string | null;
  businessDescription: string | null;
  userType: 'CLIENTE' | 'EMPRESA' | 'GOBIERNO';
  profilePicture: string | null;
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



export interface IUserSearch {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  pais_ce: PaisCe;
  businessDescription: string;
}

export interface PaisCe {
  id_pais: number;
  creation_date: Date;
  name: string;
  status: string;
}

