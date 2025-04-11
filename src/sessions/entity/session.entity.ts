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
  })
  duration: number;

  @Column({
    type: 'int',
  })
  effectiveDuration: number;

  @Column({
    type: 'int',
  })
  timeLeft: number;

  @Column({
    type: 'datetime',
  })
  lastCheckDate: Date;

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
  })
  isFinished: boolean;

  @Column({
    type: 'boolean',
  })
  isPaused: boolean;

  @Column({
    type: 'int',
  })
  xpEarned: number;
}
