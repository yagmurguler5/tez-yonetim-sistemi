import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Faculty } from '../../faculty/entities/faculty.entity';

@Entity('departments')
export class Department {
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

  @ManyToOne(() => Faculty, (faculty) => faculty.departments)
  @JoinColumn({
    name: 'faculty_id',
  })
  faculty!: Faculty;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}