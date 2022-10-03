import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

/**
 * Controller managing users endpoints.
 */
@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Retrieve a user by email.
   * @param email User email.
   * @returns The user id or null if not found.
   */
  @Get(':email')
  exists(@Param('email') email: string) {
    return this.usersService.exists(email);
  }

  /**
   * Update a user email.
   * @param updateUserDto Dto containing user update infos.
   * @returns A message indicating a successful update or a BadRequest message.
   */
  @Patch()
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(
      updateUserDto.email,
      updateUserDto.newEmail,
    );
  }

  /**
   * Delete a user by email.
   * @param email User email.
   * @returns An object indicating the delete count.
   */
  @Delete(':email')
  remove(@Param('email') email: string) {
    return this.usersService.remove(email);
  }
}
