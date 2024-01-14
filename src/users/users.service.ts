import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUserDto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    return await this.prisma.user.create({ data: dto });
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (user) {
      return user;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async deleteUserById(id: number) {
    return this.prisma.user.delete({ where: { id: id } });
  }
}
