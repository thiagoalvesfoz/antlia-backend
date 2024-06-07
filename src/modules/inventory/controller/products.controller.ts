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
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ProductsService } from '../service/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role, Roles } from 'src/common/decorators/role.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { UpdateProductStatusDto } from '@inventory/dto/update-product-status.dto';
import { ProductsQueryParam } from '@inventory/dto/products-pagination.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: 'image/jpeg|image/png' }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    const product = CreateProductDto.transform(createProductDto);
    return this.productsService.create({ ...product, image });
  }

  @Get()
  findAll(@Query() params: ProductsQueryParam) {
    return Boolean(params.resume === 'true')
      ? this.productsService.resume()
      : this.productsService.findAll(params);
  }

  @Get(':product_id')
  findOne(@Param('product_id') product_id: string) {
    return this.productsService.findOne(product_id);
  }

  @Put(':product_id')
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  update(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: 'image/jpeg|image/png' }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() updateProductDto: UpdateProductDto,
    @Param('product_id') product_id: string,
  ) {
    const product = UpdateProductDto.transform(updateProductDto);
    return this.productsService.update(product_id, { ...product, image });
  }

  @Roles(Role.ADMIN)
  @HttpCode(204)
  @Delete(':product_id')
  remove(@Param('product_id') product_id: string) {
    return this.productsService.remove(product_id);
  }

  @Roles(Role.ADMIN)
  @HttpCode(204)
  @Patch(':product_id/status')
  updateStatus(
    @Param('product_id') product_id: string,
    @Body() updateProductStatus: UpdateProductStatusDto,
  ) {
    return this.productsService.updateStatus(product_id, updateProductStatus);
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
