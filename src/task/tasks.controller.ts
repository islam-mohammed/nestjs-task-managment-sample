import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import User from 'src/auth/user.entity';
import TaskDto from './dto/task.dto';
import TaskQueryDto from './dto/task-query.dto';
import { TaskService } from './task.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TaskService) {}

  @Get('/:id')
  async getTaskById(@GetUser() user: User, @Param('id') taskId: string) {
    return await this.taskService.getTaskById(user, taskId);
  }

  @Post()
  async createNewTask(@GetUser() user: User, @Body() TaskDto: TaskDto) {
    const task = await this.taskService.createNewTask(TaskDto, user);
    return task;
  }

  @Delete('/:id')
  async deleteTask(@GetUser() user: User, @Param('id') taskId: string) {
    return await this.taskService.deleteTask(taskId, user);
  }

  @Get()
  async getAllTasks(
    @GetUser() user: User,
    @Query() taskQueryDto: TaskQueryDto,
  ) {
    return await this.taskService.getAllTasks(user, taskQueryDto);
  }

  @Patch('/:id')
  async updateTask(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() taskDto: TaskDto,
  ) {
    return await this.taskService.updateTask(user, id, taskDto);
  }
}
