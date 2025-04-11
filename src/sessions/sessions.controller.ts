import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
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

  @Post('/:sessionId/stop')
  stopSession(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.sessionsService.stopSession(sessionId, user.sub);
  }

  @Post('/:sessionId/pause')
  pauseSession(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.sessionsService.pauseSession(sessionId, user.sub);
  }

  @Post('/:sessionId/resume')
  resumeSession(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.sessionsService.resumeSession(sessionId, user.sub);
  }

  @Post('/:sessionId/check')
  checkSession(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.sessionsService.checkSession(sessionId, user.sub);
  }
}
