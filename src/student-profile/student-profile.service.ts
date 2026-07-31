import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StudentProfile } from './entities/student-profile.entity';
import { User } from '../user/entities/user.entity';
import { Faculty } from '../faculty/entities/faculty.entity';
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

    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,

    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(createStudentProfileDto: CreateStudentProfileDto) {
    const existingStudent = await this.studentProfileRepository.findOne({
      where: {
        studentNumber: createStudentProfileDto.studentNumber,
      },
    });

    if (existingStudent) {
      throw new ConflictException('Bu öğrenci numarası zaten kayıtlı.');
    }

    const user = await this.userRepository.findOne({
      where: {
        id: createStudentProfileDto.userId,
      },
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı.');
    }

    const existingProfile = await this.studentProfileRepository.findOne({
      where: {
        user: {
          id: createStudentProfileDto.userId,
        },
      },
      relations: {
        user: true,
      },
    });

    if (existingProfile) {
      throw new ConflictException(
        'Bu kullanıcıya ait öğrenci profili zaten bulunmaktadır.',
      );
    }

    const faculty = await this.facultyRepository.findOne({
      where: {
        id: createStudentProfileDto.facultyId,
      },
    });

    if (!faculty) {
      throw new NotFoundException('Fakülte bulunamadı.');
    }

    const department = await this.departmentRepository.findOne({
      where: {
        id: createStudentProfileDto.departmentId,
      },
      relations: {
        faculty: true,
      },
    });

    if (!department) {
      throw new NotFoundException('Bölüm bulunamadı.');
    }

    if (department.faculty.id !== faculty.id) {
      throw new ConflictException(
        'Seçilen bölüm belirtilen fakülteye ait değildir.',
      );
    }

    const studentProfile = this.studentProfileRepository.create({
      studentNumber: createStudentProfileDto.studentNumber,
      phone: createStudentProfileDto.phone,
      programType: createStudentProfileDto.programType,
      currentSemester: createStudentProfileDto.currentSemester,
      status: createStudentProfileDto.status,
      user,
      faculty,
      department,
    });

    return await this.studentProfileRepository.save(studentProfile);
  }

  async findAll() {
    return await this.studentProfileRepository.find({
      relations: {
        user: true,
        faculty: true,
        department: true,
      },
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const studentProfile = await this.studentProfileRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
        faculty: true,
        department: true,
      },
    });

    if (!studentProfile) {
      throw new NotFoundException('Öğrenci bulunamadı.');
    }

    return studentProfile;
  }

  async update(
    id: number,
    updateStudentProfileDto: UpdateStudentProfileDto,
  ) {
    const studentProfile = await this.findOne(id);

    if (
      updateStudentProfileDto.studentNumber &&
      updateStudentProfileDto.studentNumber !== studentProfile.studentNumber
    ) {
      const existingStudent = await this.studentProfileRepository.findOne({
        where: {
          studentNumber: updateStudentProfileDto.studentNumber,
        },
      });

      if (existingStudent) {
        throw new ConflictException('Bu öğrenci numarası zaten kayıtlı.');
      }
    }

    if (
      updateStudentProfileDto.userId &&
      updateStudentProfileDto.userId !== studentProfile.user.id
    ) {
      const user = await this.userRepository.findOne({
        where: {
          id: updateStudentProfileDto.userId,
        },
      });

      if (!user) {
        throw new NotFoundException('Kullanıcı bulunamadı.');
      }

      const existingProfile = await this.studentProfileRepository.findOne({
        where: {
          user: {
            id: updateStudentProfileDto.userId,
          },
        },
        relations: {
          user: true,
        },
      });

      if (existingProfile && existingProfile.id !== studentProfile.id) {
        throw new ConflictException(
          'Bu kullanıcıya ait öğrenci profili zaten bulunmaktadır.',
        );
      }

      studentProfile.user = user;
    }

    if (updateStudentProfileDto.facultyId) {
      const faculty = await this.facultyRepository.findOne({
        where: {
          id: updateStudentProfileDto.facultyId,
        },
      });

      if (!faculty) {
        throw new NotFoundException('Fakülte bulunamadı.');
      }

      studentProfile.faculty = faculty;
    }

    if (updateStudentProfileDto.departmentId) {
      const department = await this.departmentRepository.findOne({
        where: {
          id: updateStudentProfileDto.departmentId,
        },
        relations: {
          faculty: true,
        },
      });

      if (!department) {
        throw new NotFoundException('Bölüm bulunamadı.');
      }

      const selectedFaculty =
        studentProfile.faculty ??
        (await this.facultyRepository.findOne({
          where: {
            id: updateStudentProfileDto.facultyId,
          },
        }));

      if (!selectedFaculty) {
        throw new NotFoundException('Fakülte bulunamadı.');
      }

      if (department.faculty.id !== selectedFaculty.id) {
        throw new ConflictException(
          'Seçilen bölüm belirtilen fakülteye ait değildir.',
        );
      }

      studentProfile.department = department;
    }

    Object.assign(studentProfile, {
      studentNumber:
        updateStudentProfileDto.studentNumber ??
        studentProfile.studentNumber,
      phone: updateStudentProfileDto.phone ?? studentProfile.phone,
      programType:
        updateStudentProfileDto.programType ??
        studentProfile.programType,
      currentSemester:
        updateStudentProfileDto.currentSemester ??
        studentProfile.currentSemester,
      status: updateStudentProfileDto.status ?? studentProfile.status,
    });

    return await this.studentProfileRepository.save(studentProfile);
  }

  async remove(id: number) {
    const studentProfile = await this.findOne(id);

    await this.studentProfileRepository.remove(studentProfile);

    return {
      message: 'Öğrenci başarıyla silindi.',
    };
  }
}