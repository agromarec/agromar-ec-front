export interface IOrderResponse {
  id_order: number;
  creation_date: Date;
  order_date: Date;
  payment_method: null;
  paypal_payment_id: string;
  status: string;
  total: number;
  buyer_id: number;
  user_ce: UserCe;
}

export interface UserCe {
  name: string;
  lastName: string;
}


export interface IOrderDetailsResponse {
  id_order_detail: number;
  creation_date: Date;
  guia: null;
  quantity: number;
  subtotal: number;
  unit_price: number;
  order_id: number;
  product_id: number;
  seller_id: number;
  status: string;
  product: Product;
}

export interface Product {
  id: number;
  creation_date: Date;
  description: string;
  image: string;
  price: number;
  status: string;
  stock: number;
  predefinedProductId: number;
  seller_id: number;
  unitOfMeasureId: number;
  predefinedProduct: PredefinedProduct;
  user_ce: UserCe;
}

export interface PredefinedProduct {
  id: number;
  creation_date: Date;
  name: string;
  status: string;
  category_id: number;
  category: Category;
}

export interface Category {
  id: number;
  creation_date: Date;
  description: string;
  name: string;
  status: string;
}

export interface ISalesResponse {
  id_order: number;
  creation_date: Date;
  order_date: Date;
  payment_method: null;
  paypal_payment_id: string;
  status: string;
  total: number;
  buyer_id: number;
  user_ce: UserCe;
  order_detail: IOrderDetailsResponse[];
}
