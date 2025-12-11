import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CategoryResponseDto } from './dto/category-response.dto';
import { UserService } from '../user/user.service';
import { CreateTaskDto } from '../task/dto/create-task.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly userService: UserService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const userExists = await this.userService.userExists(
      createCategoryDto.user.id,
    );
    if (!userExists) {
      throw new NotFoundException(
        `User with ID ${createCategoryDto.user.id} not found`,
      );
    }

    const existsCategoryNameInUser = await this.categoryRepository.existsBy({
      name: createCategoryDto.name,
      user: { id: createCategoryDto.user.id },
    });

    if (existsCategoryNameInUser) {
      throw new NotFoundException(
        `Category with name ${createCategoryDto.name} already exists for this user`,
      );
    }

    const category = this.categoryRepository.create(createCategoryDto);
    await this.categoryRepository.save(category);

    return plainToInstance(CategoryResponseDto, category);
  }

  async findAll() {
    const categories = await this.categoryRepository.find({
      relations: ['user'],
    });
    return plainToInstance(CategoryResponseDto, categories);
  }

  async findAllByUser(userId: number) {
    const userExists = await this.userService.userExists(userId);
    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const categories = await this.categoryRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    return plainToInstance(CategoryResponseDto, categories);
  }

  async findOne(id: number) {
    const existsCategory = await this.categoryExists(id);
    if (!existsCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    return plainToInstance(CategoryResponseDto, category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const existsCategory = await this.categoryExists(id);
    if (!existsCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const categoryBelongsToUser = await this.categoryRepository.existsBy({
      id,
      user: { id: updateCategoryDto.user.id },
    });
    if (!categoryBelongsToUser) {
      throw new NotFoundException(
        `Category with ID ${id} does not belong to User with ID ${updateCategoryDto.user.id}`,
      );
    }

    await this.categoryRepository.update(id, updateCategoryDto);
    const updatedCategory = await this.categoryRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    return plainToInstance(CategoryResponseDto, updatedCategory);
  }

  async remove(id: number) {
    const existsCategory = await this.categoryExists(id);
    if (!existsCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    await this.categoryRepository.delete(id);
    return { deleted: true, id };
  }

  async categoryExists(id: number): Promise<boolean> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    return !!category;
  }

  async existsCategoryInUser(dto: CreateTaskDto) {
    return await this.categoryRepository.existsBy({
      user: { id: dto.user.id },
      id: dto.category.id,
    });
  }

  async countCategoriesByUser(userId: number): Promise<number> {
    const count = await this.categoryRepository.count({
      where: { user: { id: userId } },
    });
    return count;
  }
}
