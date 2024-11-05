export interface IProductResponse {
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
  products: IProduct[];
}

export interface IProduct {
  id: number;
  description: string;
  image: string;
  price: number;
  status: string;
  stock: number;
  predefinedProductId: number;
  seller_id: number;
  unitOfMeasureId: number;
  predefinedProduct: PredefinedProduct;
  unitOfMeasure: UnitOfMeasure;
  user_ce: UserCe;
}

export interface PredefinedProduct {
  id: number;
  name: string;
  status: string;
  category_id: number;
  category: UnitOfMeasure;
}

export interface UnitOfMeasure {
  id: number;
  description?: string;
  name: string;
  status: string;
  abreviature?: string;
}

export interface UserCe {
  name: string;
  email: string;
}
