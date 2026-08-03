import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user/entities/user.entity';
import { StudentProfile } from '../student-profile/entities/student-profile.entity';
import { Advisor } from '../advisor/entities/advisor.entity';
import { Thesis } from '../thesis/entities/thesis.entity';

import { ThesisStatus } from '../thesis/enums/thesis-status.enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(StudentProfile)
    private readonly studentRepository: Repository<StudentProfile>,

    @InjectRepository(Advisor)
    private readonly advisorRepository: Repository<Advisor>,

    @InjectRepository(Thesis)
    private readonly thesisRepository: Repository<Thesis>,
  ) {}

  async getDashboard() {
    const totalUsers = await this.userRepository.count();

    const totalStudents =
      await this.studentRepository.count();

    const totalAdvisors =
      await this.advisorRepository.count();

    const totalTheses =
      await this.thesisRepository.count();

    const draftTheses =
      await this.thesisRepository.count({
        where: {
          status: ThesisStatus.DRAFT,
        },
      });

    const approvedTheses =
      await this.thesisRepository.count({
        where: {
          status: ThesisStatus.APPROVED,
        },
      });

    const rejectedTheses =
      await this.thesisRepository.count({
        where: {
          status: ThesisStatus.REJECTED,
        },
      });

    return {
      totalUsers,
      totalStudents,
      totalAdvisors,
      totalTheses,
      draftTheses,
      approvedTheses,
      rejectedTheses,
    };
  }
}