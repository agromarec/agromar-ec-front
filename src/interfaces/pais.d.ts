export interface ICountryResponse {
  id_pais: number;
  name: string;
  status: string;
}

export interface ICantonResponse {
  id: number;
  nombre: string;
  status: Status;
  provinceId: number;
}

export enum Status {
  Activo = "Activo",
}

export interface IProvinceResponse {
  id_province: number;
  name: string;
  status: Status;
}

export enum Status {
  Activo = "Activo",
}
