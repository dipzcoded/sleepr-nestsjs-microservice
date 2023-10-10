import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserInterface } from '../interfaces';
import { UserRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from '../dtos';
@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(body: CreateUserInterface) {
    await this.validateCreateUser(body);
    return this.userRepository.create({
      ...body,
      password: await bcrypt.hash(body.password, 10),
    });
  }

  async validateCreateUser(body: CreateUserInterface) {
    try {
      await this.userRepository.findOne({
        email: body.email,
      });
    } catch (error) {
      return;
    }
    throw new UnprocessableEntityException('Email already exists.');
  }

  async getUser(getUserDto: GetUserDto) {
    return this.userRepository.findOne(getUserDto);
  }

  async verifyUser(email: string, password: string) {
    const user = await this.userRepository.findOne({
      email,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    return user;
  }
}
