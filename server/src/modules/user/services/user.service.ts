import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePasswordDto } from '../dtos/update-password.dto';
import { UpdateUsernameDto } from '../dtos/update-username.dto';
import { UserRepository } from '../repositories/user.repository';
import { UpdateNameDto } from '../dtos/update-name.dto';
import { UserDto } from '../dtos/user.dto';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => UserMapper.toDto(user));
  }

  async getUserById(userId: number): Promise<UserDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found.`);
    }

    return UserMapper.toDto(user);
  }

  async updateName(
    updateNameDto: UpdateNameDto,
    userId: number,
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found.`);
    }

    await this.userRepository.update({ name: updateNameDto.newName }, userId);
  }

  async updateUsername(
    updateUsernameDto: UpdateUsernameDto,
    userId: number,
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found.`);
    }

    await this.userRepository.update(
      { username: updateUsernameDto.newUsername },
      userId,
    );
  }

  async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
    userId: number,
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found.`);
    }

    await this.userRepository.update(
      { password: updatePasswordDto.newPassword },
      userId,
    );
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found.`);
    }

    await this.userRepository.deleteById(userId);
  }
}
