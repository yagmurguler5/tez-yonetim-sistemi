import { ProgramType } from '../enums/program-type.enum';
import { StudentStatus } from '../enums/student-status.enum';

export class CreateStudentProfileDto {
  studentNumber!: string;

  phone!: string;

  programType!: ProgramType;

  currentSemester!: number;

  status!: StudentStatus;

  userId!: number;

  departmentId!: number;
}