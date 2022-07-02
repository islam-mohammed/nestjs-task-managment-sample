import { Exclude } from 'class-transformer';
import { userInfo } from 'os';
import User from 'src/auth/user.entity';
import { TaskStatus } from 'src/models/task';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne(() => User, (user) => user.tasks, { eager: true })
  user: User;
}
