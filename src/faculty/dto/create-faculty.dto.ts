import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateFacultyDto {
  @IsString({
    message: 'Fakülte adı metin olmalıdır.',
  })
  @Length(3, 100, {
    message: 'Fakülte adı 3 ile 100 karakter arasında olmalıdır.',
  })
  name!: string;

  @IsOptional()
  @IsString({
    message: 'Fakülte kodu metin olmalıdır.',
  })
  @Length(2, 20, {
    message: 'Fakülte kodu 2 ile 20 karakter arasında olmalıdır.',
  })
  code?: string;

  @IsOptional()
  @IsBoolean({
    message: 'isActive true veya false olmalıdır.',
  })
  isActive?: boolean;
}