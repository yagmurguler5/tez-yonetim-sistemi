import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdvisorController } from './advisor.controller';
import { AdvisorService } from './advisor.service';

import { Advisor } from './entities/advisor.entity';
import { User } from '../user/entities/user.entity';
import { Department } from '../department/entities/department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Advisor,
      User,
      Department,
    ]),
  ],
  controllers: [AdvisorController],
  providers: [AdvisorService],
  exports: [TypeOrmModule],
})
export class AdvisorModule {}