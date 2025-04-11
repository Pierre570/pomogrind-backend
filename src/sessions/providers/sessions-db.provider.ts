import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '../entity/session.entity';
import { In, Repository } from 'typeorm';
import { StartSessionDto } from '../dtos/start-session.dto';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class SessionsDbProvider {
  constructor(
    @InjectRepository(Session) private sessionsRepository: Repository<Session>,
  ) {}

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

  saveSession(session: Session) {
    return this.sessionsRepository.save(session);
  }

  async createSession(startSessionDto: StartSessionDto, user: User) {
    const session = this.sessionsRepository.create({
      user,
      ...startSessionDto,
      timeLeft: startSessionDto.duration,
    });

    return this.sessionsRepository.save(session);
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
