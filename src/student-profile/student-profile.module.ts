import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StudentProfileController } from './student-profile.controller';
import { StudentProfileService } from './student-profile.service';

import { StudentProfile } from './entities/student-profile.entity';
import { User } from '../user/entities/user.entity';
import { Faculty } from '../faculty/entities/faculty.entity';
import { Department } from '../department/entities/department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentProfile,
      User,
      Faculty,
      Department,
    ]),
  ],
  controllers: [StudentProfileController],
  providers: [StudentProfileService],
  exports: [TypeOrmModule],
})
export class StudentProfileModule {}