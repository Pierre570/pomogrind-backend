import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { HashingProvider } from './providers/hashing.provider';
import { JwtTokensProvider } from './providers/jwt-tokens.provider';

@Module({
  controllers: [AuthController],
  providers: [AuthService, HashingProvider, JwtTokensProvider],
  imports: [UsersModule],
})
export class AuthModule {}
