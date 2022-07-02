import { Exclude } from 'class-transformer';
import Task from 'src/task/task.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  @Index({ unique: true })
  email: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  isActive: boolean;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: false })
  password: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Promise<Task[]>;
}
