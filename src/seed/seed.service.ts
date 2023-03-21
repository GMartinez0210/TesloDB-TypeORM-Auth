/* eslint-disable prettier/prettier */

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';

import { DataSource, QueryRunner } from 'typeorm';

import { initialData } from './data/seed.data';
import { ISeedRestoreResponse } from './interfaces/response.interface';
import { IParamsForRestoreProducts } from 'src/products/interfaces/params.interface';

@Injectable()
export class SeedService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly productService: ProductsService,
    private readonly userService: UsersService,
  ) {}

  async restore(): Promise<ISeedRestoreResponse> {
    const response: ISeedRestoreResponse = {} as ISeedRestoreResponse;

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const users: User[] = await this.restoreUser()
      const [user] = users

      const products: Product[] = await this.restoreProduct(user);

      response.products = products.length;
      response.users = users.length

      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      console.log('Error | restore | seed service');
      throw new InternalServerErrorException({ error });
    }

    return response;
  }

  private async restoreProduct(user: User): Promise<Product[]> {
    const { products } = initialData;

    const params: IParamsForRestoreProducts = {
      user,
      createProductsDto: products,
    }

    const productsRestored = await this.productService.restore(params);
    return productsRestored;
  }

  private async restoreUser(): Promise<User[]> {
    const { users } = initialData
    const usersRestored = await this.userService.restore(users)
    return usersRestored
  }
}
