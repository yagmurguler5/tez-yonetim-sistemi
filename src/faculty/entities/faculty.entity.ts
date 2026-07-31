import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Department } from '../../department/entities/department.entity';
import { StudentProfile } from '../../student-profile/entities/student-profile.entity';

@Entity('faculties')
export class Faculty {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
    length: 100,
  })
  name!: string;

  @Column({
    nullable: true,
    length: 20,
  })
  code!: string;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @OneToMany(() => Department, (department) => department.faculty)
  departments!: Department[];

  @OneToMany(
    () => StudentProfile,
    (studentProfile) => studentProfile.faculty,
  )
  studentProfiles!: StudentProfile[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}