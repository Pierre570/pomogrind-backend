import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create({
      ...createUserDto,
    });

    return this.usersRepository.save(user);
  }
}
