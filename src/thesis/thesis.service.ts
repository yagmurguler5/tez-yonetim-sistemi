import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Thesis } from './entities/thesis.entity';
import { StudentProfile } from '../student-profile/entities/student-profile.entity';
import { Advisor } from '../advisor/entities/advisor.entity';

import { CreateThesisDto } from './dto/create-thesis.dto';
import { UpdateThesisDto } from './dto/update-thesis.dto';

import { ThesisStatus } from './enums/thesis-status.enum';

@Injectable()
export class ThesisService {
  constructor(
    @InjectRepository(Thesis)
    private readonly thesisRepository: Repository<Thesis>,

    @InjectRepository(StudentProfile)
    private readonly studentRepository: Repository<StudentProfile>,

    @InjectRepository(Advisor)
    private readonly advisorRepository: Repository<Advisor>,
  ) {}

  async create(createThesisDto: CreateThesisDto) {
    const existingThesis = await this.thesisRepository.findOne({
      where: {
        thesisNo: createThesisDto.thesisNo,
      },
    });

    if (existingThesis) {
      throw new ConflictException(
        'Bu tez numarası zaten kayıtlı.',
      );
    }

    const student = await this.studentRepository.findOne({
      where: {
        id: createThesisDto.studentId,
      },
      relations: {
        user: true,
      },
    });

    if (!student) {
      throw new NotFoundException(
        'Öğrenci bulunamadı.',
      );
    }

    const advisor = await this.advisorRepository.findOne({
      where: {
        id: createThesisDto.advisorId,
      },
      relations: {
        user: true,
        department: true,
      },
    });

    if (!advisor) {
      throw new NotFoundException(
        'Danışman bulunamadı.',
      );
    }

    const thesis = this.thesisRepository.create({
      thesisNo: createThesisDto.thesisNo,
      title: createThesisDto.title,
      abstract: createThesisDto.abstract,
      keywords: createThesisDto.keywords,
      language: createThesisDto.language,
      type: createThesisDto.type,
      pageCount: createThesisDto.pageCount,
      status:
        createThesisDto.status ??
        ThesisStatus.DRAFT,
      student,
      advisor,
    });

    return await this.thesisRepository.save(thesis);
  }

  async findAll() {
    return await this.thesisRepository.find({
      relations: {
        student: {
          user: true,
        },
        advisor: {
          user: true,
          department: true,
        },
      },
    });
  }

  async findOne(id: number) {
    const thesis = await this.thesisRepository.findOne({
      where: {
        id,
      },
      relations: {
        student: {
          user: true,
        },
        advisor: {
          user: true,
          department: true,
        },
      },
    });

    if (!thesis) {
      throw new NotFoundException(
        'Tez bulunamadı.',
      );
    }

    return thesis;
  }

  async update(
    id: number,
    updateThesisDto: UpdateThesisDto,
  ) {
    const thesis = await this.findOne(id);

    Object.assign(thesis, {
      thesisNo:
        updateThesisDto.thesisNo ?? thesis.thesisNo,
      title:
        updateThesisDto.title ?? thesis.title,
      abstract:
        updateThesisDto.abstract ??
        thesis.abstract,
      keywords:
        updateThesisDto.keywords ??
        thesis.keywords,
      language:
        updateThesisDto.language ??
        thesis.language,
      type:
        updateThesisDto.type ?? thesis.type,
      pageCount:
        updateThesisDto.pageCount ??
        thesis.pageCount,
      status:
        updateThesisDto.status ??
        thesis.status,
    });

    return await this.thesisRepository.save(
      thesis,
    );
  }

  async uploadPdf(
    id: number,
    filename: string,
  ) {
    const thesis = await this.findOne(id);

    thesis.pdfPath = `theses/${filename}`;

    return await this.thesisRepository.save(
      thesis,
    );
  }

  async remove(id: number) {
    const thesis = await this.findOne(id);

    await this.thesisRepository.remove(thesis);

    return {
      message: 'Tez başarıyla silindi.',
    };
  }
}