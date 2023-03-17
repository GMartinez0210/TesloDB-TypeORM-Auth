import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, ...speadCreateUserDto } = createUserDto;

      const passwordHashed = bcrypt.hashSync(password, 10);

      const userInstance: DeepPartial<User> = {
        ...speadCreateUserDto,
        password: passwordHashed,
      };

      const user: User = await this.userRepository.create(userInstance);
      await this.userRepository.save(user);

      return user;
    } catch (error) {
      console.log('Error | register | auth service');
      throw new InternalServerErrorException({ error });
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<User> {
    try {
      const { password, email } = loginUserDto;

      const userFound = await this.userRepository.findOne({
        where: { email },
      });

      if (!userFound) {
        throw new UnauthorizedException(
          `No user with the email given: ${email}`,
        );
      }

      const isCorrectPassword = bcrypt.compareSync(
        password,
        userFound.password,
      );

      if (!isCorrectPassword) {
        throw new UnauthorizedException('The password given is not correct');
      }

      return userFound;
    } catch (error) {
      console.log('Error | login | auth service');
      throw new InternalServerErrorException({ error });
    }
  }
}
