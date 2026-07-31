import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateDepartmentDto {
  @IsString({
    message: 'Bölüm adı metin olmalıdır.',
  })
  @Length(3, 100, {
    message: 'Bölüm adı 3 ile 100 karakter arasında olmalıdır.',
  })
  name!: string;

  @IsOptional()
  @IsString({
    message: 'Bölüm kodu metin olmalıdır.',
  })
  @Length(2, 20, {
    message: 'Bölüm kodu 2 ile 20 karakter arasında olmalıdır.',
  })
  code?: string;

  @IsInt({
    message: 'Faculty ID sayı olmalıdır.',
  })
  facultyId!: number;

  @IsOptional()
  @IsBoolean({
    message: 'isActive true veya false olmalıdır.',
  })
  isActive?: boolean;
}