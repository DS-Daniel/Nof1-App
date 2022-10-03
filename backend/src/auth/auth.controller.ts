import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Public } from '../utils/customDecorators/publicEndpoint';
import { ApiTags } from '@nestjs/swagger';

/**
 * Controller managing user registration and authentication endpoints.
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Authenticate a user and return a JWT token and user information upon success,
   * otherwise a 401 unauthorized response.
   * User is, beforehand, validated through the LocalAuthGuard using the passport
   * local strategy. An unauthorized exception is raised if user is not valid.
   * @param req Request object, containing user informations.
   * @returns An object containing the JWT token and user information, upon
   * successful authentication, otherwise an unauthorized message.
   */
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  /**
   * Register a new user.
   * @param dto User to register.
   * @returns An object containing the JWT token and user information, upon
   * successful authentication, otherwise a BadRequest message.
   */
  @Public()
  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }
}
