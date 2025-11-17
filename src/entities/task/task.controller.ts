import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiResponse } from 'src/common/dto/api-response.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTaskDto: CreateTaskDto) {
    const task = await this.taskService.create(createTaskDto);
    return ApiResponse.success('Task created successfully', task);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const tasks = await this.taskService.findAll();
    return ApiResponse.success('Tasks retrieved successfully', tasks);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const task = await this.taskService.findOne(+id);
    return ApiResponse.success('Task retrieved successfully', task);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const task = await this.taskService.update(+id, updateTaskDto);
    return ApiResponse.success('Task updated successfully', task);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.taskService.remove(+id);
    return ApiResponse.success('Task deleted successfully', null);
  }
}
