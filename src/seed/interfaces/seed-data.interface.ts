import { SeedProduct } from './seed-product.interface';
import { SeedUser } from './seed-user.interface';

export interface SeedData {
  products: SeedProduct[];
  users: SeedUser[];
}
