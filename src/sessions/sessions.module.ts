import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entity/session.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [SessionsController],
  providers: [SessionsService],
  imports: [TypeOrmModule.forFeature([Session]), UsersModule],
})
export class SessionsModule {}
