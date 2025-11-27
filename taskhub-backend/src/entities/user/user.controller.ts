import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/security/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/security/guards/roles.guard';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<ApiResponse<UserResponseDto>> {
    const user = await this.userService.create(createUserDto);
    return ApiResponse.success('User created successfully', user);
  }

  @Get()
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const users = await this.userService.findAll();
    return ApiResponse.success('Users retrieved successfully', users);
  }

  @Get(':id')
  @Roles(Role.Admin, Role.User)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    return ApiResponse.success('User retrieved successfully', user);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.User)
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(+id, updateUserDto);
    return ApiResponse.success('User updated successfully', user);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.userService.remove(+id);
    return ApiResponse.success('User deleted successfully', null);
  }
}
