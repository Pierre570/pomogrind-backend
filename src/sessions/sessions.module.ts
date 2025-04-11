import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entity/session.entity';
import { UsersModule } from 'src/users/users.module';
import { SessionsDbProvider } from './providers/sessions-db.provider';

@Module({
  controllers: [SessionsController],
  providers: [SessionsService, SessionsDbProvider],
  imports: [TypeOrmModule.forFeature([Session]), UsersModule],
})
export class SessionsModule {}
