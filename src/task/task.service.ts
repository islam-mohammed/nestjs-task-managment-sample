import { TaskStatus } from 'src/models/task';
import { Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import TaskDto from './dto/task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import TaskQueryDto from './dto/task-query.dto';
import User from 'src/auth/user.entity';
import Task from './task.entity';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name, {
    timestamp: true,
  });
  constructor(
    @InjectRepository(Task) private tasksRepository: Repository<Task>,
  ) {}

  async getTaskById(user: User, id: string) {
    this.logger.verbose(`User "${user.name}" retriving task by id`);
    return this.getTaskByIdAndUser(id, user);
  }

  async createNewTask(TaskDto: TaskDto, user: User) {
    const { title, description } = TaskDto;

    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    return await this.tasksRepository.save(task);
  }

  async deleteTask(id: string, user: User) {
    const deletedResult = await this.tasksRepository.delete({
      id,
      user: {
        id: user.id,
      },
    });
    if (deletedResult.affected === 0)
      throw new UnauthorizedException(
        'You are not authorized to delete this task',
      );
    return;
  }

  async getAllTasks(user: User, queryDto: TaskQueryDto) {
    this.logger.verbose(
      `User "${
        user.name
      }" retriving all tasks, the user used filter ${JSON.stringify(queryDto)}`,
    );
    const qBuiler = this.tasksRepository.createQueryBuilder('task');
    qBuiler.where('task.userId = :id', { id: user.id });
    if (queryDto.status) {
      qBuiler.andWhere('task.status = :status', { status: queryDto.status });
    }
    if (queryDto.term) {
      qBuiler.andWhere('task.title LIKE :term OR task.description LIKE :term', {
        term: `%${queryDto.term}%`,
      });
    }
    return await qBuiler.getMany();
  }

  async updateTask(user: User, id: string, taskDto: TaskDto) {
    const task = await this.getTaskByIdAndUser(id, user);
    const updatedTask: Task = {
      ...task,
      ...taskDto,
    };
    try {
      this.tasksRepository.save(updatedTask);
    } catch (error) {
      this.logger.error(
        `Failed to update the task for user ${user.name}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  private async getTaskByIdAndUser(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: {
        id,
        user: {
          id: user.id,
        },
      },
    });
    if (!task) {
      const error = new NotFoundException('This task dose not exist');
      this.logger.error(error.name, ':', error.message);
      throw error;
    }
    return task;
  }
}
