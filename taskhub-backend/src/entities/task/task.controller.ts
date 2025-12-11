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
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { CountTaskDto } from './dto/count-task.dto';

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

  @Get('user/:id')
  @Roles(Role.User)
  @HttpCode(HttpStatus.OK)
  async findAllByUser(@Param('id') id: string) {
    const tasks = await this.taskService.findAllByUser(+id);
    return ApiResponse.success('Category retrieved successfully', tasks);
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

  @Get('user/:id/count-by-status')
  @HttpCode(HttpStatus.OK)
  async countTasksByStatus(
    @Param('id') id: string,
  ): Promise<ApiResponse<CountTaskDto>> {
    const count = await this.taskService.countTasksByStatus(+id);
    return ApiResponse.success(
      'Task count by status retrieved successfully',
      count,
    );
  }
}
