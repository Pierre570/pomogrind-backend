import { User } from 'src/users/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  user: User;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  startDate: Date;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  finishDate: Date;

  @Column({
    type: 'int',
    nullable: true,
  })
  duration: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  effectiveDuration: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  timeLeft: number;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  lastCheckDate: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastPauseDate: Date;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  status: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  type: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isFinished: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  isPaused: boolean;

  @Column({
    type: 'int',
    default: 0,
  })
  xpEarned: number;
}
