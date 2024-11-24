export interface ICommentResponse {
  id_comment: number;
  comentario: string;
  creation_date: Date;
  rating: number;
  status: string;
  product_id: number;
  user_id: number;
  user_ce: UserCe;
}

export interface UserCe {
  name: string;
  lastName: string;
}
