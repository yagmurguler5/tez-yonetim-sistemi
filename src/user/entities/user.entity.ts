import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Role } from '../../role/entities/role.entity';
import { StudentProfile } from '../../student-profile/entities/student-profile.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    length: 100,
  })
  fullName!: string;

  @Column({
    unique: true,
    length: 50,
  })
  username!: string;

  @Column({
    unique: true,
    length: 100,
  })
  email!: string;

  @Column()
  password!: string;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({
    name: 'role_id',
  })
  role!: Role;

  @OneToOne(
    () => StudentProfile,
    (studentProfile) => studentProfile.user,
  )
  studentProfile!: StudentProfile;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}