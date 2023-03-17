import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Product } from 'src/products/entities';
import { ProductsService } from 'src/products/products.service';

import { DataSource, QueryRunner } from 'typeorm';

import { initialData } from './data/seed-product.data';
import { ISeedRestoreResponse } from './interfaces/response.interface';

@Injectable()
export class SeedService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly productService: ProductsService,
  ) {}

  async restore(): Promise<ISeedRestoreResponse> {
    const response: ISeedRestoreResponse = {} as ISeedRestoreResponse;

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const productsInsertResult: Product[] = await this.productRestore();

      response.product = productsInsertResult.length;

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

  private async productRestore(): Promise<Product[]> {
    const { products } = initialData;
    const productsRestored = this.productService.restore(products);
    return productsRestored;
  }
}
