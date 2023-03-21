import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';

import { Auth } from '../auth/decorators/auth.decorator';
import { PaginationDto } from '../common/dtos/pagination.dto';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ValidRoles } from 'src/auth/enum/valid-roles.enum';
import {
  IParamsForCreateProduct,
  IParamsForFindOneProduct,
  IParamsForUpdateProduct,
} from './interfaces/params.interface';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  async createOne(
    @GetUser() user: User,
    @Body() createProductDto: CreateProductDto,
  ) {
    const params: IParamsForCreateProduct = {
      user,
      createProductDto,
    };
    return await this.productsService.createOne(params);
  }

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    return await this.productsService.findAll(pagination);
  }

  @Get('search')
  @Auth(ValidRoles.user)
  async findOne(
    @Query('id') id: string,
    @Query('slug') slug: string,
    @Query('title') title: string,
  ) {
    if (id) {
      return await this.productsService.findOneById(id);
    }

    slug ||= '';
    title ||= '';
    const query: IParamsForFindOneProduct = { slug, title };
    return await this.productsService.findOne(query);
  }

  @Get(':id')
  @Auth(ValidRoles.user)
  async findOneById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productsService.findOneById(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  async updateOne(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const params: IParamsForUpdateProduct = {
      id,
      user,
      updateProductDto,
    };
    return await this.productsService.updateOne(params);
  }

  @Delete(':id')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  async removeOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productsService.removeOne(id);
  }
}
