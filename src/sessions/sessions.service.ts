import { BadRequestException, Injectable } from '@nestjs/common';
import { StartSessionDto } from './dtos/start-session.dto';
import { Session } from './entity/session.entity';
import { UsersService } from 'src/users/users.service';
import { SessionsDbProvider } from './providers/sessions-db.provider';

@Injectable()
export class SessionsService {
  constructor(
    private readonly sessionsDbProvider: SessionsDbProvider,
    private readonly usersService: UsersService,
  ) {}

  isSessionOver(session: Session): boolean {
    const { startDate, duration, isFinished } = session;

    if (isFinished) return true;
    if (session.status === 'paused') return false;

    const start = new Date(startDate).getTime();
    const now = Date.now();
    const durationMs = duration * 1000;

    return now >= start + durationMs;
  }

  async startSession(startSessionDto: StartSessionDto, userId: number) {
    const user = await this.usersService.findOneById(userId);
    if (!user) throw new BadRequestException('User not found');

    const activeSession =
      await this.sessionsDbProvider.findActiveSession(userId);
    if (activeSession) {
      if (
        (activeSession.status === 'active' ||
          activeSession.status === 'paused') &&
        this.isSessionOver(activeSession) === false
      ) {
        if (activeSession.status === 'active') {
          const now = Date.now();
          const lastPause = new Date(activeSession.lastPauseDate).getTime();
          const elapsedSeconds = Math.floor((now - lastPause) / 1000);

          const updatedTimeLeft = Math.max(
            activeSession.timeLeft - elapsedSeconds,
            0,
          );

          activeSession.timeLeft = updatedTimeLeft;

          return { ...activeSession, user: undefined };
        } else {
          return { ...activeSession, user: undefined };
        }
      } else {
        activeSession.status = 'abandoned';
        activeSession.finishDate = new Date();
        activeSession.isFinished = true;
        await this.sessionsDbProvider.saveSession(activeSession);

        return await this.sessionsDbProvider.createSession(
          startSessionDto,
          user,
        );
      }
    } else {
      return await this.sessionsDbProvider.createSession(startSessionDto, user);
    }
  }

  async stopSession(sessionId: number, userId: number) {
    const user = await this.usersService.findOneById(userId);
    if (!user) throw new BadRequestException('User not found');

    const session = await this.sessionsDbProvider.findOneById(sessionId);

    if (!session) throw new BadRequestException('Session not found');
    if (session.user.id !== userId)
      throw new BadRequestException('Unauthorized');
    if (session.status === 'finished')
      throw new BadRequestException('Session already finished');

    const start = new Date(session.startDate).getTime();
    const now = Date.now();
    const durationMs = session.duration * 1000;

    if (now >= start + durationMs) {
      session.status = 'finished';
      session.finishDate = new Date();
      session.isFinished = true;
      return await this.sessionsDbProvider.saveSession(session);
    } else throw new BadRequestException('Session is still active');
  }

  async pauseSession(sessionId: number, userId: number) {
    const user = await this.usersService.findOneById(userId);
    if (!user) throw new BadRequestException('User not found');

    const session = await this.sessionsDbProvider.findOneById(sessionId);
    if (!session) throw new BadRequestException('Session not found');
    if (session.user.id !== userId)
      throw new BadRequestException('Unauthorized');
    if (session.status === 'active') {
      session.status = 'paused';
      const now = new Date();
      const lastPause = new Date(session.lastPauseDate);
      const elapsedSeconds = Math.floor(
        (now.getTime() - lastPause.getTime()) / 1000,
      );
      session.timeLeft = Math.max(session.timeLeft - elapsedSeconds, 0);
      session.lastPauseDate = new Date();
      return await this.sessionsDbProvider.saveSession(session);
    } else throw new BadRequestException('Session is not active');
  }

  async resumeSession(sessionId: number, userId: number) {
    const user = await this.usersService.findOneById(userId);
    if (!user) throw new BadRequestException('User not found');
    const session = await this.sessionsDbProvider.findOneById(sessionId);
    if (!session) throw new BadRequestException('Session not found');
    if (session.user.id !== userId)
      throw new BadRequestException('Unauthorized');
    if (session.status === 'paused') {
      session.status = 'active';
      session.lastPauseDate = new Date();
      return await this.sessionsDbProvider.saveSession(session);
    } else throw new BadRequestException('Session is not paused');
  }

  async checkSession(sessionId: number, userId: number) {
    const user = await this.usersService.findOneById(userId);
    if (!user) throw new BadRequestException('User not found');

    const session = await this.sessionsDbProvider.findOneById(sessionId);
    if (!session) throw new BadRequestException('Session not found');

    if (session.user.id !== userId) {
      throw new BadRequestException('Unauthorized');
    }

    if (session.status !== 'active' || session.isFinished) {
      throw new BadRequestException('Session is not active');
    }

    const now = new Date();
    const lastCheck = new Date(session.lastCheckDate);
    const secondsSinceLastCheck = Math.floor(
      (now.getTime() - lastCheck.getTime()) / 1000,
    );

    if (secondsSinceLastCheck < 300) {
      throw new BadRequestException('Check too frequent. Must wait 5 minutes.');
    }

    const startDate = new Date(session.startDate);
    const elapsedSinceStart = Math.floor(
      (now.getTime() - startDate.getTime()) / 1000,
    );
    const slotCount = Math.floor(elapsedSinceStart / 300);
    const adjustedCheckDate = new Date(
      startDate.getTime() + slotCount * 5 * 60 * 1000,
    );

    const lastPause = new Date(session.lastPauseDate);
    const elapsedSeconds = Math.floor(
      (now.getTime() - lastPause.getTime()) / 1000,
    );
    const updatedTimeLeft = Math.max(session.timeLeft - elapsedSeconds, 0);

    session.lastCheckDate = adjustedCheckDate;
    session.xpEarned += 1;

    await this.sessionsDbProvider.saveSession(session);

    return {
      timeLeft: updatedTimeLeft,
      status: session.status,
      isPaused: session.isPaused,
      isFinished: session.isFinished,
      xpEarned: session.xpEarned,
      lastCheckDate: adjustedCheckDate,
    };
  }
}
