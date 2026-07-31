import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Faculty } from '../../faculty/entities/faculty.entity';
import { Department } from '../../department/entities/department.entity';

import { ProgramType } from '../enums/program-type.enum';
import { StudentStatus } from '../enums/student-status.enum';

@Entity('student_profiles')
export class StudentProfile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
    length: 20,
  })
  studentNumber!: string;

  @Column({
    nullable: true,
    length: 20,
  })
  phone?: string;

  @Column({
    type: 'enum',
    enum: ProgramType,
  })
  programType!: ProgramType;

  @Column({
    default: 1,
  })
  currentSemester!: number;

  @Column({
    type: 'enum',
    enum: StudentStatus,
    default: StudentStatus.ACTIVE,
  })
  status!: StudentStatus;

  @OneToOne(() => User, {
    eager: true,
  })
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  @ManyToOne(() => Faculty)
  @JoinColumn({
    name: 'faculty_id',
  })
  faculty!: Faculty;

  @ManyToOne(() => Department)
  @JoinColumn({
    name: 'department_id',
  })
  department!: Department;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}