import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Department } from '../../department/entities/department.entity';
import { Thesis } from '../../thesis/entities/thesis.entity';

@Entity('advisors')
export class Advisor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    length: 50,
  })
  academicTitle!: string;

  @Column({
    length: 20,
    nullable: true,
  })
  phone!: string;

  @Column({
    length: 100,
    nullable: true,
  })
  office!: string;

  @Column({
    default: 10,
  })
  maxStudentCount!: number;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @OneToOne(
    () => User,
    (user) => user.advisor,
  )
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  @ManyToOne(() => Department)
  @JoinColumn({
    name: 'department_id',
  })
  department!: Department;

  @OneToMany(
    () => Thesis,
    (thesis) => thesis.advisor,
  )
  theses!: Thesis[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}