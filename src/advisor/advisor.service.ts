import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Advisor } from './entities/advisor.entity';
import { User } from '../user/entities/user.entity';
import { Department } from '../department/entities/department.entity';

import { CreateAdvisorDto } from './dto/create-advisor.dto';
import { UpdateAdvisorDto } from './dto/update-advisor.dto';

@Injectable()
export class AdvisorService {
  constructor(
    @InjectRepository(Advisor)
    private readonly advisorRepository: Repository<Advisor>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(createAdvisorDto: CreateAdvisorDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: createAdvisorDto.userId,
      },
      relations: {
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'Kullanıcı bulunamadı.',
      );
    }

    if (user.role.name !== 'ADVISOR') {
      throw new ConflictException(
        'Seçilen kullanıcı danışman rolüne sahip değildir.',
      );
    }

    const existingAdvisor =
      await this.advisorRepository.findOne({
        where: {
          user: {
            id: createAdvisorDto.userId,
          },
        },
        relations: {
          user: true,
        },
      });

    if (existingAdvisor) {
      throw new ConflictException(
        'Bu kullanıcıya ait danışman kaydı zaten bulunmaktadır.',
      );
    }

    const department =
      await this.departmentRepository.findOne({
        where: {
          id: createAdvisorDto.departmentId,
        },
      });

    if (!department) {
      throw new NotFoundException(
        'Bölüm bulunamadı.',
      );
    }

    const advisor =
      this.advisorRepository.create({
        academicTitle:
          createAdvisorDto.academicTitle,
        phone: createAdvisorDto.phone,
        office: createAdvisorDto.office,
        maxStudentCount:
          createAdvisorDto.maxStudentCount,
        isActive:
          createAdvisorDto.isActive ?? true,
        user,
        department,
      });

    return await this.advisorRepository.save(
      advisor,
    );
  }

  async findAll() {
    return await this.advisorRepository.find({
      relations: {
        user: {
          role: true,
        },
        department: {
          faculty: true,
        },
      },
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const advisor =
      await this.advisorRepository.findOne({
        where: {
          id,
        },
        relations: {
          user: {
            role: true,
          },
          department: {
            faculty: true,
          },
        },
      });

    if (!advisor) {
      throw new NotFoundException(
        'Danışman bulunamadı.',
      );
    }

    return advisor;
  }

   async update(
    id: number,
    updateAdvisorDto: UpdateAdvisorDto,
  ) {
    const advisor = await this.findOne(id);

    if (
      updateAdvisorDto.userId &&
      updateAdvisorDto.userId !== advisor.user.id
    ) {
      const user = await this.userRepository.findOne({
        where: {
          id: updateAdvisorDto.userId,
        },
        relations: {
          role: true,
        },
      });

      if (!user) {
        throw new NotFoundException(
          'Kullanıcı bulunamadı.',
        );
      }

      if (user.role.name !== 'ADVISOR') {
        throw new ConflictException(
          'Seçilen kullanıcı danışman rolüne sahip değildir.',
        );
      }

      const existingAdvisor =
        await this.advisorRepository.findOne({
          where: {
            user: {
              id: updateAdvisorDto.userId,
            },
          },
          relations: {
            user: true,
          },
        });

      if (
        existingAdvisor &&
        existingAdvisor.id !== advisor.id
      ) {
        throw new ConflictException(
          'Bu kullanıcıya ait danışman kaydı zaten bulunmaktadır.',
        );
      }

      advisor.user = user;
    }

    if (updateAdvisorDto.departmentId) {
      const department =
        await this.departmentRepository.findOne({
          where: {
            id: updateAdvisorDto.departmentId,
          },
        });

      if (!department) {
        throw new NotFoundException(
          'Bölüm bulunamadı.',
        );
      }

      advisor.department = department;
    }

    Object.assign(advisor, {
      academicTitle:
        updateAdvisorDto.academicTitle ??
        advisor.academicTitle,

      phone:
        updateAdvisorDto.phone ??
        advisor.phone,

      office:
        updateAdvisorDto.office ??
        advisor.office,

      maxStudentCount:
        updateAdvisorDto.maxStudentCount ??
        advisor.maxStudentCount,

      isActive:
        updateAdvisorDto.isActive ??
        advisor.isActive,
    });

    return await this.advisorRepository.save(
      advisor,
    );
  }

  async remove(id: number) {
    const advisor = await this.findOne(id);

    await this.advisorRepository.remove(advisor);

    return {
      message:
        'Danışman başarıyla silindi.',
    };
  }
}
