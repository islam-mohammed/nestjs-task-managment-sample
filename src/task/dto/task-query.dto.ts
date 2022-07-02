import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from 'src/models/task';

export default class TaskQueryDto {
  @IsOptional()
  @IsString()
  term?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
