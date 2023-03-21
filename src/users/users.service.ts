import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { IParamsForFindOneUser } from './interfaces/params.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createOne(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, ...spreadCreateUserDto } = createUserDto;

      const passwordHashed = bcrypt.hashSync(password, 10);

      const userInstance: DeepPartial<User> = {
        ...spreadCreateUserDto,
        password: passwordHashed,
      };

      const user: User = await this.userRepository.create(userInstance);
      await this.userRepository.save(user);

      return user;
    } catch (error) {
      console.log('Error | createOne | user service');
      throw new InternalServerErrorException({ error });
    }
  }

  async findAll() {
    return `This action returns all users`;
  }

  async findOne(params: IParamsForFindOneUser) {
    try {
      const { email } = params;

      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException(`No user with the email given: ${email}`);
      }

      return user;
    } catch (error) {
      console.log('Error | findOne | user service');
      throw new InternalServerErrorException({ error });
    }
  }

  async findOneById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    return user;
  }

  async updateOne(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async removeOne(id: string) {
    return `This action removes a #${id} user`;
  }

  async restore(createUsersDto: CreateUserDto[]): Promise<User[]> {
    await this.userRepository.delete({});

    const users: User[] = [];

    for (const createUserDto of createUsersDto) {
      const user = await this.createOne(createUserDto);
      users.push(user);
    }

    return users;
  }
}
