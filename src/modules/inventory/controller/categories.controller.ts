import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Patch,
  StreamableFile,
  Res,
} from '@nestjs/common';
import { CategoriesService } from '../service/categories.service';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role, Roles } from 'src/common/decorators/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { Response } from 'express';

const MAX_FILE_SIZE = 1000000; //1MB

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('image'))
  async createCategory(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
          new FileTypeValidator({ fileType: 'image/jpeg|image/png' }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() body: CreateCategoryDto,
  ) {
    return await this.categoriesService.create({
      name: body.name,
      image,
    });
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
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('image'))
  async updateCategory(
    @Param('category_id') category_id: string,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
          new FileTypeValidator({ fileType: 'image/jpeg|image/png' }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() body: UpdateCategoryDto,
  ) {
    return await this.categoriesService.update(category_id, {
      name: body.name,
      image,
    });
  }

  @Roles(Role.ADMIN)
  @HttpCode(204)
  @Patch(':category_id/enable')
  async toggleRemove(
    @Param('category_id') category_id: string,
    @Body() body: { enable: boolean },
  ) {
    await this.categoriesService.toggleEnable(category_id, !!body.enable);
  }

  @Roles(Role.ADMIN)
  @HttpCode(204)
  @Delete(':category_id')
  remove(@Param('category_id') category_id: string) {
    return this.categoriesService.remove(category_id);
  }

  @Public()
  @Get(':category_id/image')
  async getFile(
    @Param('category_id') category_id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const image = await this.categoriesService.getImage(category_id);

    res.set({ 'Content-Type': image.mimetype });
    return new StreamableFile(image.bytes);
  }
}
