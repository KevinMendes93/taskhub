import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskResponseDto } from './dto/task-response.dto';
import { plainToInstance } from 'class-transformer';
import { UserService } from '../user/user.service';

//TODO terminar o service das Tasks para os usuarios adicionarem com as categorias e eles tudo vinculado, e fazer todas as validações necessárias
@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService
  ){}

  async create(createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {    
    const userExists = await this.userService.userExists(createTaskDto.user.id);
    if(!userExists) {
      throw new NotFoundException(`User with ID ${createTaskDto.user.id} not found`);
    };

    const existsTaskNameInUser = await this.taskRepository.existsBy({ 
      title: createTaskDto.title,
      user: { id: createTaskDto.user.id }
    });

    if (existsTaskNameInUser) {
      throw new NotFoundException(`Task with name ${createTaskDto.title} already exists for this user`);
    }

    const task = this.taskRepository.create(createTaskDto);
    await this.taskRepository.save(task);

    return plainToInstance(TaskResponseDto, task);
  }

  async findAll(): Promise<TaskResponseDto[]> {
    const tasks = await this.taskRepository.find({ relations: ['user', 'category'] });
    return plainToInstance(TaskResponseDto, tasks);
  }

  async findAllByUser(userId: number) {
    const userExists = await this.userService.userExists(userId);
    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const tasks = await this.taskRepository.find({ 
      where: { user: { id: userId } },
      relations: ['user']
    });

    return plainToInstance(TaskResponseDto, tasks);
  }

  async findOne(id: number): Promise<TaskResponseDto> {
    const existsTask = await this.taskExists(id);
    if (!existsTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['user', 'category']
    });

    return plainToInstance(TaskResponseDto, task);
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }

  private async taskExists(id: number): Promise<Boolean> {
    const task = await this.taskRepository.findOne({ where: { id } });
    return !!task;
  }
}
