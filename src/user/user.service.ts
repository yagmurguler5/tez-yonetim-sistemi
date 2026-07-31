import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        'Bu e-posta adresi zaten kayıtlı.',
      );
    }

    const role = await this.roleRepository.findOne({
      where: { id: createUserDto.roleId },
    });

    if (!role) {
      throw new NotFoundException(
        'Rol bulunamadı.',
      );
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      10,
    );

    const user = this.userRepository.create({
      fullName: createUserDto.fullName,
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
      isActive: createUserDto.isActive ?? true,
      role,
    });

    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find({
      relations: {
        role: true,
        studentProfile: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      relations: {
        role: true,
        studentProfile: true,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `User ${id} güncellenecek.`;
  }

  remove(id: number) {
    return `User ${id} silinecek.`;
  }
}