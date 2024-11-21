export interface IPredifinedProductResponse {
  id: number;
  name: string;
  status: string;
  category_id: number;
  category?: IProductCategory;
}


export interface IProductCategory {
  id: number;
  description: string;
  name: string;
  status: string;
}


export interface IUnitOfMeasure {
  id: number;
  abreviature: string;
  name: string;
  status: string;
}
