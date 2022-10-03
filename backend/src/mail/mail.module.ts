import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

/**
 * Mail Module configuration.
 */
@Module({
  providers: [MailService],
  controllers: [MailController],
})
export class MailModule {}
