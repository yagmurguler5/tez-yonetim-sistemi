import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Department } from './entities/department.entity';
import { Faculty } from '../faculty/entities/faculty.entity';

import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,

    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    const faculty = await this.facultyRepository.findOne({
      where: {
        id: createDepartmentDto.facultyId,
      },
    });

    if (!faculty) {
      throw new NotFoundException('Fakülte bulunamadı.');
    }

    const existingDepartment = await this.departmentRepository.findOne({
      where: {
        name: createDepartmentDto.name,
      },
    });

    if (existingDepartment) {
      throw new ConflictException(
        'Bu bölüm adı zaten kayıtlı.',
      );
    }

    const department = this.departmentRepository.create({
      name: createDepartmentDto.name,
      code: createDepartmentDto.code,
      isActive: createDepartmentDto.isActive ?? true,
      faculty,
    });

    return await this.departmentRepository.save(department);
  }

  async findAll() {
    return await this.departmentRepository.find({
      relations: {
        faculty: true,
      },
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const department = await this.departmentRepository.findOne({
      where: {
        id,
      },
      relations: {
        faculty: true,
      },
    });

    if (!department) {
      throw new NotFoundException(
        'Bölüm bulunamadı.',
      );
    }

    return department;
  }

  async update(
    id: number,
    updateDepartmentDto: UpdateDepartmentDto,
  ) {
    const department = await this.findOne(id);

    if (
      updateDepartmentDto.name &&
      updateDepartmentDto.name !== department.name
    ) {
      const existingDepartment =
        await this.departmentRepository.findOne({
          where: {
            name: updateDepartmentDto.name,
          },
        });

      if (existingDepartment) {
        throw new ConflictException(
          'Bu bölüm adı zaten kayıtlı.',
        );
      }
    }

    if (updateDepartmentDto.facultyId) {
      const faculty = await this.facultyRepository.findOne({
        where: {
          id: updateDepartmentDto.facultyId,
        },
      });

      if (!faculty) {
        throw new NotFoundException(
          'Fakülte bulunamadı.',
        );
      }

      department.faculty = faculty;
    }

    department.name =
      updateDepartmentDto.name ?? department.name;

    department.code =
      updateDepartmentDto.code ?? department.code;

    department.isActive =
      updateDepartmentDto.isActive ?? department.isActive;

    return await this.departmentRepository.save(
      department,
    );
  }

  async remove(id: number) {
    const department = await this.findOne(id);

    await this.departmentRepository.remove(department);

    return {
      message: 'Bölüm başarıyla silindi.',
    };
  }
}