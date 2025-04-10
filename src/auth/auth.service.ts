import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { HashingProvider } from './providers/hashing.provider';
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtTokensProvider } from './providers/jwt-tokens.provider';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashingProvider: HashingProvider,
    private readonly jwtTokensProvider: JwtTokensProvider,
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

    return this.jwtTokensProvider.generateTokens(user);
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findOneByEmail(loginUserDto.email);

    if (!user)
      throw new UnauthorizedException('Email or password is incorrect');

    const isPasswordValid = await this.hashingProvider.comparePassword(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('Email or password is incorrect');

    return this.jwtTokensProvider.generateTokens(user);
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    return this.jwtTokensProvider.refreshToken(refreshTokenDto);
  }

  async getUserData(userId: number) {
    const user = await this.usersService.findOneById(userId);

    if (!user) throw new BadRequestException('User not found');

    return {
      ...user,
      password: undefined,
    };
  }
}
