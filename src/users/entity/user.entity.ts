import { Session } from 'src/sessions/entity/session.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  name: string;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
}
