import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    return await this.prisma.user.create({ data: dto });
  }

  async getUserById(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: id },
      });

      if (!user) {
        throw new Error();
      }

      return user;
    } catch (error) {
      throw new HttpException('User not found', 404);
    }
  }

  async getAllUsers() {
    try {
      const users = await this.prisma.user.findMany();

      if (!users) {
        throw new Error();
      }

      return users;
    } catch (error) {
      throw new HttpException('Users not found', 404);
    }
  }

  async deleteUserById(id: number) {
    try {
      const deletedUser = this.prisma.user.delete({ where: { id: id } });

      if (!deletedUser) {
        throw new Error();
      }
    } catch (error) {
      throw new HttpException('Error with user deletion', 401);
    }
  }
}
