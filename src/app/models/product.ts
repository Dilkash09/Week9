export interface Product {
  _id?: string;
  id: number;
  name: string;
  description: string;
  price: number;
  units: number;
  createdAt?: Date;
  updatedAt?: Date;
}