import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    
    const user: User = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);

    return plainToInstance(UserResponseDto, user);
  }

  async findAll() {
    const users = await this.userRepository.find();

    return plainToInstance(UserResponseDto, users);
  }

  async findOne(id: number) {
    const user: User | null = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return plainToInstance(UserResponseDto, user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    await this.userRepository.update(id, updateUserDto);
    const updatedUser = await this.userRepository.findOneBy({ id });

    return plainToInstance(UserResponseDto, updatedUser);
  }

  async remove(id: number) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return this.userRepository.delete(id);
  }

  public async userExists(userId: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return !!user;
  }

  private async findUserById(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

}
