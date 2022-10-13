import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { xlsx } from 'src/utils/xlsxGenerator';
import { MailDto } from './dto/mail.dto';
import { PatientMailDto } from './dto/patientMail.dto';

/**
 * Service managing email sending.
 */
@Injectable()
export class MailService {
  private readonly transporter: Transporter<SMTPTransport.SentMessageInfo>;
  private readonly from: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.transporter = createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: 587,
      secure: false, // will be upgraded later with STARTTLS (true for 465, false for other ports)
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
    this.from = `N-of-1 Service <${this.configService.get<string>(
      'MAIL_USER',
    )}>`;
  }

  /**
   * Sends an email with the information contained in MailDto.
   * Converts the N-of-1 test preparation data to XLSX format and attaches it to the email.
   * @param mailDto MailDto.
   * @returns An object { success: boolean, msg: string } indicating email sending success or failure.
   */
  async sendEmail(mailDto: MailDto) {
    const { filename, xlsbuf } = await xlsx(mailDto.data);

    return this.transporter
      .sendMail({
        from: this.from,
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

  /**
   * Sends an email to a patient to provide a link to the health logbook form page.
   * @param mailDto PatientMailDto.
   * @returns An object { success: boolean, msg: string } indicating email sending success or failure.
   */
  async sendPatientEmail(mailDto: PatientMailDto) {
    const token = this.jwtService.sign(
      { dest: mailDto.dest },
      {
        expiresIn: mailDto.tokenExp,
        notBefore: mailDto.notBefore,
      },
    );
    const txtMsg = mailDto.msg.text.replace('TOKEN', token);
    const htmlMsg = mailDto.msg.html.replace('TOKEN', token);

    return this.transporter
      .sendMail({
        from: this.from,
        to: mailDto.dest,
        subject:
          'Carnet de relevés des paramètres de santé concernant votre test thérapeutique.',
        text: txtMsg, // plain text body
        html: htmlMsg, // html body
      })
      .then(() => {
        return { success: true, msg: 'Email sent' };
      })
      .catch(() => {
        return { success: false, msg: 'An error occurred, email was not send' };
      });
  }
}
