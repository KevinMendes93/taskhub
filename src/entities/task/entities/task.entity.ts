import { Category } from 'src/entities/category/entities/category.entity';
import { User } from 'src/entities/user/entities/user.entity';
import { Status } from 'src/enums/status.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn()
  @Column({ name: 'id' })
  id: number;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'description' })
  description: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @Column({ name: 'due_date', type: 'timestamp', nullable: true })
  dueDate: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ onUpdate: 'CURRENT_TIMESTAMP', nullable: true })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id, { cascade: true })
  user: User;

  @ManyToOne(() => Category, (category) => category.id, { cascade: true })
  category: Category;
}
