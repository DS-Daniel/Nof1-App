import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { xlsx } from 'src/utils/xlsxGenerator';
import { MailDto } from './dto/mail.dto';

/**
 * Service managing email sending.
 */
@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Send an email with the information contained in MailDto.
   * @param mailDto MailDto.
   * @returns An object { success: boolean, msg: string } indicating email sending success or failure.
   */
  async sendEmail(mailDto: MailDto) {
    const transporter = createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: 587,
      secure: false, // will be upgraded later with STARTTLS (true for 465, false for other ports)
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });

    const { filename, xlsbuf } = await xlsx(mailDto.data);

    return transporter
      .sendMail({
        from: `N-of-1 Service <${this.configService.get<string>('MAIL_USER')}>`,
        to: mailDto.dest,
        subject: 'N-of-1 service - Préparation des substances',
        text: mailDto.msg.text, // plain text body
        html: mailDto.msg.html, // html body
        attachments: [
          {
            filename,
            content: xlsbuf,
            contentType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
        ],
      })
      .then(() => {
        return { success: true, msg: 'Email sent' };
      })
      .catch(() => {
        return { success: false, msg: 'An error occurred, email was not send' };
      });
  }
}
