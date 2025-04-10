import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from 'src/config/jwt.config';
import { ActiveUserData } from 'src/interfaces/payload-jwt.interface';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractRequestFromHeader(request);

    if (!token) throw new UnauthorizedException('Token not found');

    try {
      const payload = await this.jwtService.verifyAsync<ActiveUserData>(
        token,
        this.jwtConfiguration,
      );
      request['user'] = payload;
    } catch (error) {
      console.error('Error verifying token', error);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractRequestFromHeader(request: Request): string | undefined {
    const [, token] = request.headers.authorization?.split(' ') ?? [];

    return token;
  }
}
