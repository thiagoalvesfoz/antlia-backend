import { IsNotEmpty, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @Length(3, 20)
  name: string;
  enable: boolean;
  show_menu: boolean;
}
