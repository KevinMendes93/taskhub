import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskResponseDto } from './dto/task-response.dto';
import { plainToInstance } from 'class-transformer';
import { UserService } from '../user/user.service';
import { CategoryService } from '../category/category.service';
import { Status } from 'src/enums/status.enum';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
    const userExists = await this.userService.userExists(createTaskDto.user.id);
    if (!userExists) {
      throw new NotFoundException(
        `User with ID ${createTaskDto.user.id} not found`,
      );
    }

    if (await this.existsTaskNameInUser(createTaskDto)) {
      throw new NotFoundException(
        `Task with name ${createTaskDto.title} already exists for this user`,
      );
    }

    if (await !this.existsCategoryInUser(createTaskDto)) {
      throw new NotFoundException(
        `This category do not exists in user's categories`,
      );
    }

    const task = this.taskRepository.create(createTaskDto);
    await this.taskRepository.save(task);

    return plainToInstance(TaskResponseDto, task);
  }

  async findAll(): Promise<TaskResponseDto[]> {
    const tasks = await this.taskRepository.find({
      relations: ['user', 'category'],
    });
    return plainToInstance(TaskResponseDto, tasks);
  }

  async findAllByUser(userId: number) {
    const userExists = await this.userService.userExists(userId);
    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const tasks = await this.taskRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'category'],
    });

    return plainToInstance(TaskResponseDto, tasks);
  }

  async findOne(id: number): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['user', 'category'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return plainToInstance(TaskResponseDto, task);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    if (!(await this.taskExists(id))) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    await this.taskRepository.update(id, updateTaskDto);

    const updatedTask = await this.taskRepository.findOne({
      where: { id },
      relations: ['user', 'category'],
    });
    return plainToInstance(TaskResponseDto, updatedTask);
  }

  async remove(id: number) {
    if (!(await this.taskExists(id))) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    await this.taskRepository.delete(id);
  }

  async countTasksByStatus(userId: number) {
    const userExists = await this.userService.userExists(userId);
    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const pendingCount = await this.taskRepository.count({
      where: { user: { id: userId }, status: Status.PENDING },
    });
    const completedCount = await this.taskRepository.count({
      where: { user: { id: userId }, status: Status.COMPLETED },
    });

    return { pending: pendingCount, completed: completedCount };
  }

  private async taskExists(id: number): Promise<boolean> {
    const task = await this.taskRepository.findOne({ where: { id } });
    return !!task;
  }

  private async existsTaskNameInUser(dto: CreateTaskDto): Promise<boolean> {
    return await this.taskRepository.existsBy({
      title: dto.title,
      user: { id: dto.user.id },
    });
  }

  private async existsCategoryInUser(dto: CreateTaskDto): Promise<boolean> {
    return (
      (await this.categoryService.categoryExists(dto.category.id)) &&
      (await this.categoryService.existsCategoryInUser(dto))
    );
  }
}
