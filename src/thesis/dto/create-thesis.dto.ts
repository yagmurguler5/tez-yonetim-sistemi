import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { ThesisLanguage } from '../enums/thesis-language.enum';
import { ThesisStatus } from '../enums/thesis-status.enum';
import { ThesisType } from '../enums/thesis-type.enum';

export class CreateThesisDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  thesisNo!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString()
  @IsNotEmpty()
  abstract!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  keywords?: string;

  @IsEnum(ThesisLanguage)
  language!: ThesisLanguage;

  @IsEnum(ThesisType)
  type!: ThesisType;

  @IsInt()
  @Min(1)
  pageCount!: number;

  @IsOptional()
  @IsEnum(ThesisStatus)
  status?: ThesisStatus;

  @IsInt()
  studentId!: number;

  @IsInt()
  advisorId!: number;
}