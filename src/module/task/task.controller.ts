import { Body, Controller, Delete, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CreateTaskDto, ListTasksDto, UpdateTaskDto } from 'src/dtos/task.dto';
import { TaskService } from './task.service';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Tasks') // This will categorize all the endpoints under the "User" tag in Swagger UI
@Controller('task')
export class TaskController {
  constructor(private readonly taskservice: TaskService) {}

  @Post('create-task')
  @ApiBody({ type: CreateTaskDto }) // Add Swagger body documentation for request
  @ApiResponse({ status: 201, description: 'Task successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createTask(@Body() body: CreateTaskDto) {
    return this.taskservice.createTask(body);
  }

  @Patch('update-task')
  @ApiBody({ type: UpdateTaskDto }) // Add Swagger body documentation for request
  @ApiResponse({ status: 200, description: 'Task successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async updateTask(@Body() updateTaskDto: UpdateTaskDto) {
    return this.taskservice.updateTask(updateTaskDto);
  }

  @Delete('delete-task')
  @ApiBody({ type: Object, description: 'Request body should include taskId' })
  @ApiResponse({ status: 200, description: 'Task successfully deleted' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async deleteTask(@Body() dto: { taskId: number }) {
    return this.taskservice.deleteTask(dto);
  }

  @Post('list-task')
  @ApiBody({ type: ListTasksDto }) // Add Swagger body documentation for request
  @ApiResponse({ status: 200, description: 'List of tasks', type: [Object] })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async listTasks(@Body() listTasksDto: ListTasksDto) {
    return this.taskservice.listTasks(listTasksDto);
  }

  @Post('fetch-task')
  @ApiBody({ type: Object, description: 'Request body should include taskId' })
  @ApiResponse({ status: 200, description: 'Fetched task details', type: Object })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async fetchTask(@Body() body: { id: number }) {
    return this.taskservice.fetchTask(body.id);
  }
}
