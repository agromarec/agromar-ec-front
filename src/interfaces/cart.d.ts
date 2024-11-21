export interface ICartResponse {
  id_shopping_cart: number;
  status: string;
  total: number;
  user_id: number;
  cart_item: CartItem[];
}

export interface CartItem {
  id_cart_item: number;
  price: number;
  quantity: number;
  product_id: number;
  shopping_cart_id: number;
  status: string;
  product: Product;
}

export interface Product {
  id: number;
  description: string;
  image: string;
  price: number;
  status: string;
  stock: number;
  predefinedProductId: number;
  seller_id: number;
  unitOfMeasureId: number;
}
