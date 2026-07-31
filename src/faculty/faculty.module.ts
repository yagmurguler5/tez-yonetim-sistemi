import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FacultyController } from './faculty.controller';
import { FacultyService } from './faculty.service';
import { Faculty } from './entities/faculty.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Faculty])],
  controllers: [FacultyController],
  providers: [FacultyService],
  exports: [TypeOrmModule],
})
export class FacultyModule {}