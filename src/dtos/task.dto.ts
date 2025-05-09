import {
  IsString,
  IsDateString,
  IsIn,
  IsBoolean,
  IsOptional,
  Length,
  IsNumber,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'The name of the task',
    minLength: 3,
    maxLength: 100,
    example: 'Task 1',
  })
  @IsString()
  @Length(3, 100, { message: 'Name must be between 3 and 100 characters' })
  name: string;

  @ApiProperty({
    description: 'The due date for the task in ISO string format',
    example: '2025-06-01T00:00:00.000Z',
  })
  @IsDateString({}, { message: 'dueDate must be a valid ISO date string' })
  dueDate: Date;

  @ApiProperty({
    description: 'The current status of the task',
    enum: ['pending', 'in_progress', 'done', 'paused'],
    example: 'pending',
  })
  @IsString()
  @IsIn(['pending', 'in_progress', 'done', 'paused'], {
    message: 'Status must be one of: pending, in_progress, done, paused',
  })
  status: string;

  @ApiProperty({
    description: 'The priority of the task',
    enum: ['normal', 'medium', 'high'],
    example: 'normal',
  })
  @IsString()
  @IsIn(['normal', 'medium', 'high'], {
    message: 'Priority must be one of: normal, medium, high',
  })
  priority: string;

  @ApiProperty({
    description: 'Whether the task is active',
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;
}

export class UpdateTaskDto {
  @ApiProperty({
    description: 'The ID of the task to be updated',
    example: 1,
  })
  @IsNumber()
  taskId: number;

  @ApiProperty({
    description: 'The updated name of the task',
    minLength: 3,
    maxLength: 100,
    example: 'Updated Task Name',
  })
  @IsString()
  @Length(3, 100, { message: 'Name must be between 3 and 100 characters' })
  name: string;

  @ApiProperty({
    description: 'The updated status of the task',
    enum: ['pending', 'in_progress', 'completed'],
    example: 'in_progress',
  })
  @IsString()
  @IsIn(['pending', 'in_progress', 'completed'], {
    message: 'Status must be one of: pending, in_progress, completed',
  })
  status: string;

  @ApiProperty({
    description: 'The updated priority of the task',
    enum: ['low', 'medium', 'high'],
    example: 'medium',
  })
  @IsString()
  @IsIn(['low', 'medium', 'high'], {
    message: 'Priority must be one of: low, medium, high',
  })
  priority: string;
}

export class ListTasksDto {
  @ApiProperty({
    description: 'Search tasks by name',
    required: false,
    example: 'Task 1',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter tasks by status',
    enum: ['pending', 'in_progress', 'done', 'paused'],
    required: false,
    example: 'done',
  })
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'in_progress', 'done', 'paused'], { message: 'Invalid status' })
  status?: string;

  @ApiProperty({
    description: 'Filter tasks by priority',
    enum: ['normal', 'medium', 'high'],
    required: false,
    example: 'high',
  })
  @IsOptional()
  @IsString()
  @IsIn(['normal', 'medium', 'high'], { message: 'Invalid priority' })
  priority?: string;

  @ApiProperty({
    description: 'Filter tasks by whether they are active',
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    description: 'Number of items per page for pagination',
    required: false,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit: number = 10;
}
