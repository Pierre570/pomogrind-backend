import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(createUserDto: CreateUserDto) {
    const isUserExist = await this.usersService.findOneByEmail(
      createUserDto.email,
    );

    if (isUserExist) throw new BadRequestException('User already exists');
    const user = await this.usersService.createUser(createUserDto);

    return user;
  }
}
