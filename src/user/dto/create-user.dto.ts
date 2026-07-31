export class CreateUserDto {
  fullName!: string;

  username!: string;

  email!: string;

  password!: string;

  isActive?: boolean;

  roleId!: number;
}