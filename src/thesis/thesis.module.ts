import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ThesisService } from './thesis.service';
import { ThesisController } from './thesis.controller';

import { Thesis } from './entities/thesis.entity';
import { StudentProfile } from '../student-profile/entities/student-profile.entity';
import { Advisor } from '../advisor/entities/advisor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Thesis,
      StudentProfile,
      Advisor,
    ]),
  ],
  controllers: [ThesisController],
  providers: [ThesisService],
})
export class ThesisModule {}