import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CategoryResponseDto } from './dto/category-response.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async create(createCategoryDto: CreateCategoryDto) {
    const userExists = await this.userExists(createCategoryDto.user.id);
    if (!userExists) {
      throw new NotFoundException(`User with ID ${createCategoryDto.user.id} not found`);
    }

    const category = this.categoryRepository.create(createCategoryDto);
    await this.categoryRepository.save(category);

    return plainToInstance(CategoryResponseDto, category);
  }

  async findAll() {
    const categories = this.categoryRepository.find({ relations: ['user'] });
    return plainToInstance(CategoryResponseDto, categories);
  }

  async findAllByUser(userId: number) {
    const userExists = await this.userExists(userId);
    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const categories = this.categoryRepository.find({ 
      where: { user: { id: userId } },
      relations: ['user']
    });

    return plainToInstance(CategoryResponseDto, categories);
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return plainToInstance(CategoryResponseDto, category);
  }

  //TODO tudo pra baixo daqui
  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    await this.categoryRepository.update(id, updateCategoryDto);
    const updatedCategory = await this.categoryRepository.findOne({ where: { id }, relations: ['user'] });

    return plainToInstance(CategoryResponseDto, updatedCategory);
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }

  private async userExists(userId: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return !!user;
  }
}
