import { Account } from 'src/entities/account/account.entity';
import { Category } from 'src/entities/category/entities/category.entity';
import { Task } from 'src/entities/task/entities/task.entity';
import { Role } from 'src/enums/role.enum';
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  cpf: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ onUpdate: 'CURRENT_TIMESTAMP', nullable: true })
  updatedAt: Date;

  @OneToOne(() => Account, (account) => account.user)
  account: Account;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.User],
  })
  roles: Role[];

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[]
  
  
  public possuiConta(): boolean {
    return !!this.account;
  }
}
