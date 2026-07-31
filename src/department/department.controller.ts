import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

@Controller('department')
@UseGuards(JwtAuthGuard)
export class DepartmentController {
  constructor(
    private readonly departmentService: DepartmentService,
  ) {}

  @Get()
  findAll() {
    return this.departmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departmentService.findOne(+id);
  }

  @Post()
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  create(
    @Body() createDepartmentDto: CreateDepartmentDto,
  ) {
    return this.departmentService.create(
      createDepartmentDto,
    );
  }

  @Patch(':id')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: string,
    @Body()
    updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentService.update(
      +id,
      updateDepartmentDto,
    );
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.departmentService.remove(+id);
  }
}