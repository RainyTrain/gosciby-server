import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Roles } from 'src/users/dto/createUser.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async giveAdminRights(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });

    if (!user) {
      return NotFoundError;
    }

    if (user?.role['ADMIN']) {
      return 'This user is already admin!';
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: id },
      data: { ...user, role: [...user?.role, Roles.ADMIN] },
    });

    return updatedUser;
  }

  async removeAdminRights(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });

    if (!user) {
      return NotFoundError;
    }

    if (!user?.role.includes('ADMIN')) {
      return 'This user is not admin!';
    }

    const newRoles = user.role.filter((role) => role != 'ADMIN');

    const updatedUser = await this.prisma.user.update({
      where: { id: id },
      data: { ...user, role: newRoles },
    });

    return updatedUser;
  }
}
