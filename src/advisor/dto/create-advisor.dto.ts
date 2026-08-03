import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateAdvisorDto {
  @IsString({
    message: 'Akademik unvan metin olmalıdır.',
  })
  @Length(2, 50, {
    message: 'Akademik unvan 2 ile 50 karakter arasında olmalıdır.',
  })
  academicTitle!: string;

  @IsOptional()
  @IsString({
    message: 'Telefon metin olmalıdır.',
  })
  @Length(10, 20, {
    message: 'Telefon numarası 10 ile 20 karakter arasında olmalıdır.',
  })
  phone?: string;

  @IsOptional()
  @IsString({
    message: 'Ofis bilgisi metin olmalıdır.',
  })
  @Length(1, 100, {
    message: 'Ofis bilgisi en fazla 100 karakter olabilir.',
  })
  office?: string;

  @IsInt({
    message: 'Maksimum öğrenci sayısı sayı olmalıdır.',
  })
  @Min(1, {
    message: 'En az 1 öğrenci olmalıdır.',
  })
  @Max(100, {
    message: 'En fazla 100 öğrenci olabilir.',
  })
  maxStudentCount!: number;

  @IsOptional()
  @IsBoolean({
    message: 'Aktiflik bilgisi true veya false olmalıdır.',
  })
  isActive?: boolean;

  @IsInt({
    message: 'User ID sayı olmalıdır.',
  })
  userId!: number;

  @IsInt({
    message: 'Department ID sayı olmalıdır.',
  })
  departmentId!: number;
}