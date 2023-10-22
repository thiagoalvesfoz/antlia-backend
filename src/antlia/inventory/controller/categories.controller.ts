import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
} from '@nestjs/common';

import { CategoriesService } from '../service/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/account-manager/entity/role.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':category_id')
  findOne(@Param('category_id') category_id: string) {
    return this.categoriesService.findOne(category_id);
  }

  @Roles(Role.ADMIN)
  @Put(':category_id')
  update(
    @Param('category_id') category_id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(category_id, updateCategoryDto);
  }

  @Roles(Role.ADMIN)
  @HttpCode(204)
  @Delete(':category_id')
  remove(@Param('category_id') category_id: string) {
    return this.categoriesService.remove(category_id);
  }
}
