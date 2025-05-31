import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UpdateUsernameDto } from '../dtos/update-username.dto';
import { UpdatePasswordDto } from '../dtos/update-password.dto';
import { UpdateNameDto } from '../dtos/update-name.dto';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') userId: string) {
    const id = parseInt(userId);
    return await this.userService.getUserById(id);
  }

  @Patch(':id/update-name')
  async updateName(
    @Body() updateNameDto: UpdateNameDto,
    @Param('id') userId: string,
  ) {
    const id = parseInt(userId);
    await this.userService.updateName(updateNameDto, id);
  }

  @Patch(':id/update-username')
  async updateUsername(
    @Body() updateUsernameDto: UpdateUsernameDto,
    @Param('id') userId: string,
  ) {
    const id = parseInt(userId);
    await this.userService.updateUsername(updateUsernameDto, id);
  }

  @Patch(':id/update-password')
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Param('id') userId: string,
  ) {
    const id = parseInt(userId);
    await this.userService.updatePassword(updatePasswordDto, id);
  }

  @Delete(':id')
  async deleteUser(@Param('id') userId: string) {
    const id = parseInt(userId);
    await this.userService.deleteUser(id);
  }
}
