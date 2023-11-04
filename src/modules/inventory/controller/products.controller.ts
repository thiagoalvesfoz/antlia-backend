import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { ProductsService } from '../service/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role, Roles } from 'src/common/decorators/role.decorator';
import { Public } from 'src/common/decorators/public.decorator';


@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() params: any) {
    return params.category_id
      ? this.productsService.findAllProductsByCategory(params.category_id)
      : this.productsService.findAll();
  }

  @Get(':product_id')
  findOne(@Param('product_id') product_id: string) {
    return this.productsService.findOne(product_id);
  }

  @Put(':product_id')
  @Roles(Role.ADMIN)
  update(
    @Param('product_id') product_id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(product_id, updateProductDto);
  }

  @Roles(Role.ADMIN)
  @HttpCode(204)
  @Delete(':product_id')
  remove(@Param('product_id') product_id: string) {
    return this.productsService.remove(product_id);
  }

  @Roles(Role.ADMIN)
  @Post(':product_id/upload-image')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('product_id') product_id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: 'image/jpeg|image/png' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    await this.productsService.uploadImage(product_id, file);
  }

  @Public()
  @Get(':product_id/image')
  async getFile(
    @Param('product_id') product_id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const image = await this.productsService.getImage(product_id);

    res.set({ 'Content-Type': image.mimetype });
    return new StreamableFile(image.bytes);
  }
}
