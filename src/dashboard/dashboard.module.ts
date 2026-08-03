import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

import { User } from '../user/entities/user.entity';
import { StudentProfile } from '../student-profile/entities/student-profile.entity';
import { Advisor } from '../advisor/entities/advisor.entity';
import { Thesis } from '../thesis/entities/thesis.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      StudentProfile,
      Advisor,
      Thesis,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}