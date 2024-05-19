import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Roles } from 'src/users/dto/createUser.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async giveAdminRights(id: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: id } });

      if (!user) {
        throw new Error();
      }

      if (user?.role['ADMIN']) {
        return 'This user is already admin!';
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: id },
        data: { ...user, role: [...user?.role, Roles.ADMIN] },
      });

      if (!updatedUser) {
        throw new Error();
      }

      return updatedUser;
    } catch (error) {
      throw new HttpException('Error with giving admin access', 401);
    }
  }

  async removeAdminRights(id: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: id } });

      if (!user) {
        throw new Error();
      }

      if (!user?.role.includes('ADMIN')) {
        throw new Error();
      }

      const newRoles = user.role.filter((role) => role != 'ADMIN');

      const updatedUser = await this.prisma.user.update({
        where: { id: id },
        data: { ...user, role: newRoles },
      });

      if (!updatedUser) {
        throw new Error();
      }

      return updatedUser;
    } catch (error) {
      throw new HttpException('Error with removing admin access', 401);
    }
  }
}
