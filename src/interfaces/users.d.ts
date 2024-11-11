export interface IUserResponse {
  id: number;
  address: string;
  disabled: boolean;
  email: string;
  lastName: string;
  locked: boolean;
  name: string;
  password: string;
  paypalEmail: null | string;
  phone: string;
  status: string;
  cantonId: number | null;
  paisId: number;
  userId: null;
  user_role: UserRole[];
}

export interface UserRole {
  roleId: number;
}
