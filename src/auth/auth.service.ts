import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { DeepPartial, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { RegisterUserDto } from './dto/register-user.dto';
import { User } from '../users/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    try {
      const user: User = await this.userService.createOne(registerUserDto);
      const jwtPayload: JwtPayload = { id: user.id };
      const token = this.getJwtToken(jwtPayload);

      return {
        ...user,
        token,
      };
    } catch (error) {
      console.log('Error | register | auth service');
      throw new InternalServerErrorException({ error });
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { password, email } = loginUserDto;

      const user = await this.userService.findOne({
        email,
      });

      this.comparePasswords(password, user.password);

      delete user.password;

      const jwtPayload: JwtPayload = { id: user.id };

      const token = this.getJwtToken(jwtPayload);

      return {
        ...user,
        token,
      };
    } catch (error) {
      console.log('Error | login | auth service');
      throw new InternalServerErrorException({ error });
    }
  }

  check(user: User) {
    delete user.password;

    const jwtPayload: JwtPayload = { id: user.id };

    const token = this.getJwtToken(jwtPayload);
    return {
      ...user,
      token,
    };
  }

  private comparePasswords(passwordLogin, passwordUser) {
    const isCorrectPassword = bcrypt.compareSync(passwordLogin, passwordUser);

    if (!isCorrectPassword) {
      throw new UnauthorizedException('The password given is not correct');
    }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
