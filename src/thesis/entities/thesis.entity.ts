import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { StudentProfile } from '../../student-profile/entities/student-profile.entity';
import { Advisor } from '../../advisor/entities/advisor.entity';

import { ThesisStatus } from '../enums/thesis-status.enum';
import { ThesisLanguage } from '../enums/thesis-language.enum';
import { ThesisType } from '../enums/thesis-type.enum';

@Entity('theses')
export class Thesis {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
    length: 30,
  })
  thesisNo!: string;

  @Column({
    length: 255,
  })
  title!: string;

  @Column({
    type: 'text',
  })
  abstract!: string;

  @Column({
    length: 500,
    nullable: true,
  })
  keywords?: string;

  @Column({
    type: 'enum',
    enum: ThesisLanguage,
    default: ThesisLanguage.TURKISH,
  })
  language!: ThesisLanguage;

  @Column({
    type: 'enum',
    enum: ThesisType,
    default: ThesisType.UNDERGRADUATE,
  })
  type!: ThesisType;

  @Column({
    default: 0,
  })
  pageCount!: number;

  @Column({
    type: 'enum',
    enum: ThesisStatus,
    default: ThesisStatus.DRAFT,
  })
  status!: ThesisStatus;

  @Column({
    nullable: true,
  })
  pdfPath?: string;

  @ManyToOne(
    () => StudentProfile,
    (student) => student.theses,
  )
  @JoinColumn({
    name: 'student_id',
  })
  student!: StudentProfile;

  @ManyToOne(
    () => Advisor,
    (advisor) => advisor.theses,
  )
  @JoinColumn({
    name: 'advisor_id',
  })
  advisor!: Advisor;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}