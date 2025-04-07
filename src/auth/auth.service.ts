import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { HashingProvider } from './providers/hashing.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashingProvider: HashingProvider,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const isUserExist = await this.usersService.findOneByEmail(
      createUserDto.email,
    );

    if (isUserExist) throw new BadRequestException('User already exists');
    createUserDto.password = await this.hashingProvider.hashPassword(
      createUserDto.password,
    );
    const user = await this.usersService.createUser(createUserDto);

    if (!user) throw new BadRequestException('User not created');

    return user;
  }
}
