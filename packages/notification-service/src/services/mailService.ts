import nodemailer from 'nodemailer';

export default class MailService {
  private transporter?: nodemailer.Transporter;

  private static instance: MailService;

  private constructor() {}

  static async getInstance() {
    if (!MailService.instance) {
      MailService.instance = new MailService();
    }
    if (!MailService.instance.transporter) {
      await MailService.instance.createConnection();
    }
    return MailService.instance;
  }

  async createConnection() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendMail(options: {
    from?: string;
    to: string;
    subject: string;
    text: string;
    html: string;
  }) {
    const info = await this.transporter?.sendMail({
      from: options.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    console.log(`ethereal url: ${nodemailer.getTestMessageUrl(info)}`);
    return info;
  }
}
