import { IsStrongPassword } from 'class-validator';
import { User } from 'src/entities/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @IsStrongPassword()
  @Column()
  password: string;

  @Column({ nullable: true })
  refreshTokenHash: string;

  @OneToOne(() => User, (user) => user.account, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
