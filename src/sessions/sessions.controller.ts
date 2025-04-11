import { Body, Controller, Post } from '@nestjs/common';
import { StartSessionDto } from './dtos/start-session.dto';
import { SessionsService } from './sessions.service';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserData } from 'src/interfaces/payload-jwt.interface';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}
  @Post('/start')
  startSession(
    @Body() startSessionDto: StartSessionDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.sessionsService.startSession(startSessionDto, user.sub);
  }
}
