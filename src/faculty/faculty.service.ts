import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Faculty } from './entities/faculty.entity';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';

@Injectable()
export class FacultyService {
  constructor(
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,
  ) {}

  async create(createFacultyDto: CreateFacultyDto) {
    const existingName = await this.facultyRepository.findOne({
      where: {
        name: createFacultyDto.name,
      },
    });

    if (existingName) {
      throw new ConflictException(
        'Bu fakülte adı zaten kayıtlı.',
      );
    }

    if (createFacultyDto.code) {
      const existingCode = await this.facultyRepository.findOne({
        where: {
          code: createFacultyDto.code,
        },
      });

      if (existingCode) {
        throw new ConflictException(
          'Bu fakülte kodu zaten kayıtlı.',
        );
      }
    }

    const faculty = this.facultyRepository.create(createFacultyDto);

    return await this.facultyRepository.save(faculty);
  }

  async findAll() {
    return await this.facultyRepository.find({
      relations: {
        departments: true,
      },
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const faculty = await this.facultyRepository.findOne({
      where: { id },
      relations: {
        departments: true,
      },
    });

    if (!faculty) {
      throw new NotFoundException(
        'Fakülte bulunamadı.',
      );
    }

    return faculty;
  }

  async update(
    id: number,
    updateFacultyDto: UpdateFacultyDto,
  ) {
    const faculty = await this.findOne(id);

    if (
      updateFacultyDto.name &&
      updateFacultyDto.name !== faculty.name
    ) {
      const existingName = await this.facultyRepository.findOne({
        where: {
          name: updateFacultyDto.name,
        },
      });

      if (existingName) {
        throw new ConflictException(
          'Bu fakülte adı zaten kayıtlı.',
        );
      }
    }

    if (
      updateFacultyDto.code &&
      updateFacultyDto.code !== faculty.code
    ) {
      const existingCode = await this.facultyRepository.findOne({
        where: {
          code: updateFacultyDto.code,
        },
      });

      if (existingCode) {
        throw new ConflictException(
          'Bu fakülte kodu zaten kayıtlı.',
        );
      }
    }

    Object.assign(faculty, updateFacultyDto);

    return await this.facultyRepository.save(faculty);
  }

  async remove(id: number) {
    const faculty = await this.findOne(id);

    await this.facultyRepository.remove(faculty);

    return {
      message: 'Fakülte başarıyla silindi.',
    };
  }
}