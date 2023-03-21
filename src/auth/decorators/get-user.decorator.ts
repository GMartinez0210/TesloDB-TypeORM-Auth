import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { GetUser as GetUserTypes } from '../types/get-user.types';

export const GetUser = createParamDecorator(
  (data: GetUserTypes | GetUserTypes[], ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const { user } = req;

    if (!user) {
      throw new InternalServerErrorException('User not found from the request');
    }

    if (Array.isArray(data)) {
      const userData = {};
      data.forEach((field) => (userData[field] = user[field]));
      return userData;
    }

    if (!!data) {
      return user[data];
    }

    return user;
  },
);
