import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MailDto } from './dto/mail.dto';
import { MailService } from './mail.service';

/**
 * Controller managing mail sending request endpoint.
 */
@ApiBearerAuth()
@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  /**
   * Send an email with the information contained in MailDto.
   * @param mailDto MailDto.
   * @returns An object { success: boolean, msg: string } indicating
   * email sending success or failure.
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  sendEmail(@Body() mailDto: MailDto) {
    return this.mailService.sendEmail(mailDto);
  }
}
