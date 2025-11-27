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
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { AuthGuard } from 'src/security/guards/auth.guard';
import { RolesGuard } from 'src/security/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('category')
@UseGuards(AuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(Role.User)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryService.create(createCategoryDto);
    return ApiResponse.success('Category created successfully', category);
  }

  @Get()
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const categories = await this.categoryService.findAll();
    return ApiResponse.success('Categories retrieved successfully', categories);
  }

  @Get('user/:id')
  @Roles(Role.User)
  @HttpCode(HttpStatus.OK)
  async findAllByUser(@Param('id') id: string) {
    const categories = await this.categoryService.findAllByUser(+id);
    return ApiResponse.success('Category retrieved successfully', categories);
  }

  @Get(':id')
  @Roles(Role.User)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const category = await this.categoryService.findOne(+id);
    return ApiResponse.success('Category retrieved successfully', category);
  }

  @Patch(':id')
  @Roles(Role.User)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoryService.update(+id, updateCategoryDto);
    return ApiResponse.success('Category updated successfully', category);
  }

  @Delete(':id')
  @Roles(Role.User)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.categoryService.remove(+id);
  }
}
