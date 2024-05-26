import { IsNotEmpty, Length } from 'class-validator';
export class CreateCategoryDto {
  @IsNotEmpty()
  @Length(3, 20)
  name: string;
  enable?: boolean;
  image?: Express.Multer.File;
}
