import { Injectable } from '@nestjs/common';
import { StartSessionDto } from './dtos/start-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entity/session.entity';
import { In, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session) private sessionsRepository: Repository<Session>,
    private readonly usersService: UsersService,
  ) {}

  isSessionOver(session: Session): boolean {
    const { startDate, duration, isFinished } = session;

    if (isFinished) return true;

    const start = new Date(startDate).getTime();
    const now = Date.now();
    const durationMs = duration * 1000;

    return now >= start + durationMs;
  }

  async startSession(startSessionDto: StartSessionDto, userId: number) {
    const user = await this.usersService.findOneById(userId);
    if (!user) throw new Error('User not found');

    const activeSession = await this.findActiveSession(userId);
    if (activeSession) {
      if (
        activeSession.status === 'active' &&
        this.isSessionOver(activeSession) === false
      ) {
        return activeSession;
      } else {
        activeSession.status = 'abandoned';
        activeSession.finishDate = new Date();
        activeSession.isFinished = true;
        await this.sessionsRepository.save(activeSession);

        return await this.createSession(startSessionDto, user);
      }
    } else {
      return await this.createSession(startSessionDto, user);
    }
  }

  async createSession(startSessionDto: StartSessionDto, user: User) {
    const session = this.sessionsRepository.create({
      user,
      ...startSessionDto,
    });

    return this.sessionsRepository.save(session);
  }

  async findActiveSession(userId: number) {
    return this.sessionsRepository.findOne({
      where: {
        user: { id: userId },
        status: In(['active', 'paused']),
      },
      order: {
        startDate: 'DESC',
      },
    });
  }

  async stopSession(sessionId: number, userId: number) {
    const user = await this.usersService.findOneById(userId);
    if (!user) throw new Error('User not found');

    const session = await this.findOneById(sessionId);

    if (!session) throw new Error('Session not found');
    if (session.user.id !== userId) throw new Error('Unauthorized');
    if (session.status === 'finished')
      throw new Error('Session already finished');

    const start = new Date(session.startDate).getTime();
    const now = Date.now();
    const durationMs = session.duration * 1000;

    if (now >= start + durationMs) {
      session.status = 'finished';
      session.finishDate = new Date();
      session.isFinished = true;
      return await this.sessionsRepository.save(session);
    } else throw new Error('Session is still active');
  }

  async findOneById(id: number) {
    return await this.sessionsRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
  }
}
