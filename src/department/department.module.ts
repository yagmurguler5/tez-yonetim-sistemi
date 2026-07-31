import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';

import { Department } from './entities/department.entity';
import { Faculty } from '../faculty/entities/faculty.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Department,
      Faculty,
    ]),
  ],
  controllers: [DepartmentController],
  providers: [DepartmentService],
  exports: [TypeOrmModule],
})
export class DepartmentModule {}