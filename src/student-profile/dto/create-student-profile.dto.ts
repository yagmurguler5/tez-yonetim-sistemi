import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

import { ProgramType } from '../enums/program-type.enum';
import { StudentStatus } from '../enums/student-status.enum';

export class CreateStudentProfileDto {
  @IsString({
    message: 'Öğrenci numarası metin olmalıdır.',
  })
  @Length(3, 20, {
    message: 'Öğrenci numarası 3 ile 20 karakter arasında olmalıdır.',
  })
  studentNumber!: string;

  @IsOptional()
  @IsString({
    message: 'Telefon metin olmalıdır.',
  })
  @Length(10, 20, {
    message: 'Telefon numarası 10 ile 20 karakter arasında olmalıdır.',
  })
  phone?: string;

  @IsEnum(ProgramType, {
    message: 'Geçerli bir program türü seçiniz.',
  })
  programType!: ProgramType;

  @IsInt({
    message: 'Dönem sayı olmalıdır.',
  })
  @Min(1, {
    message: 'Dönem en az 1 olmalıdır.',
  })
  @Max(14, {
    message: 'Dönem en fazla 14 olabilir.',
  })
  currentSemester!: number;

  @IsOptional()
  @IsEnum(StudentStatus, {
    message: 'Geçerli bir öğrenci durumu seçiniz.',
  })
  status?: StudentStatus;

  @IsInt({
    message: 'User ID sayı olmalıdır.',
  })
  userId!: number;

  @IsInt({
    message: 'Faculty ID sayı olmalıdır.',
  })
  facultyId!: number;

  @IsInt({
    message: 'Department ID sayı olmalıdır.',
  })
  departmentId!: number;
}