import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesDecorator } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/users/dto/createUser.dto';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @RolesDecorator(Roles.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('make/:id')
  async setAdmin(@Param('id', new ParseIntPipe()) id: number) {
    return await this.adminService.giveAdminRights(id);
  }

  @RolesDecorator(Roles.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('delete/:id')
  async deleteAdmin(@Param('id', new ParseIntPipe()) id: number) {
    return await this.adminService.removeAdminRights(Number(id));
  }
}
