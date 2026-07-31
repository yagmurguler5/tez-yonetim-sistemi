import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StudentProfile } from './entities/student-profile.entity';
import { User } from '../user/entities/user.entity';
import { Department } from '../department/entities/department.entity';

import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';

@Injectable()
export class StudentProfileService {
  constructor(
    @InjectRepository(StudentProfile)
    private readonly studentProfileRepository: Repository<StudentProfile>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(createStudentProfileDto: CreateStudentProfileDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: createStudentProfileDto.userId,
      },
    });

    const department = await this.departmentRepository.findOne({
      where: {
        id: createStudentProfileDto.departmentId,
      },
    });

    const studentProfile = this.studentProfileRepository.create({
      studentNumber: createStudentProfileDto.studentNumber,
      phone: createStudentProfileDto.phone,
      programType: createStudentProfileDto.programType,
      currentSemester: createStudentProfileDto.currentSemester,
      status: createStudentProfileDto.status,
      user: user!,
      department: department!,
    });

    return await this.studentProfileRepository.save(studentProfile);
  }

  async findAll() {
    return await this.studentProfileRepository.find({
      relations: {
        user: true,
        department: {
          faculty: true,
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.studentProfileRepository.findOne({
      where: { id },
      relations: {
        user: true,
        department: {
          faculty: true,
        },
      },
    });
  }

  update(id: number, updateStudentProfileDto: UpdateStudentProfileDto) {
    return `StudentProfile ${id} güncellenecek.`;
  }

  remove(id: number) {
    return `StudentProfile ${id} silinecek.`;
  }
}