import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { showErrorFields } from 'src/exceptions/showErrorFields';
import { RolesDecorator } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { CreateUserDto, Roles } from './dto/createUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAll() {
    return this.usersService.getAllUsers();
  }

  @Post('create')
  async createNewUser(
    @Body(
      new ValidationPipe({
        exceptionFactory: (errors) => showErrorFields(errors),
      }),
    )
    userDto: CreateUserDto,
  ) {
    return this.usersService.createUser(userDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserById(@Param('id', new ParseIntPipe()) id: number) {
    console.log(typeof id);
    return this.usersService.getUserById(id);
  }

  @RolesDecorator(Roles.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  async deleteUserById(@Param('id', new ParseIntPipe()) id: number) {
    return this.usersService.deleteUserById(id);
  }
}
