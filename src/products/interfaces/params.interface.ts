import { QueryRunner } from 'typeorm';

import { Product } from '../entities';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

import { User } from '../../users/entities/user.entity';

export interface IParamsForFindOneProduct {
  title: string;
  slug: string;
}

export interface IParamsForCreateProduct {
  createProductDto: CreateProductDto;
  user: User;
}

export interface IParamsForRestoreProducts {
  createProductsDto: CreateProductDto[];
  user: User;
}

export interface IParamsForUpdateProduct {
  id: string;
  updateProductDto: UpdateProductDto;
  user: User;
}

export interface IParamsForGetNewProductImages {
  id: string;
  product: Product;
  productImages: string[];
  queryRunner: QueryRunner;
}

export interface IParamsForGetProductImages {
  id: string;
}
