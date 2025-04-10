import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { ActiveUserData } from 'src/interfaces/payload-jwt.interface';
import { User } from 'src/users/entity/user.entity';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtTokensProvider {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly usersService: UsersService,
  ) {}

  public async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.jwtConfiguration.secret,
        expiresIn: expiresIn,
      },
    );
  }

  public async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { sub } = await this.jwtService.verifyAsync<
      Pick<ActiveUserData, 'sub'>
    >(refreshTokenDto.refreshToken, {
      secret: this.jwtConfiguration.secret,
    });

    const user = await this.usersService.findOneById(sub);

    if (!user) throw new BadRequestException('User not found');

    return await this.generateTokens(user);
  }
}
