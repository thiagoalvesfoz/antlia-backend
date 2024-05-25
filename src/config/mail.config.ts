import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

const helpers = {
  price: (total: number) => `R$ ${total.toFixed(2)}`,
  code: (uuid: string) => `#${uuid.split('-')[0]}`,
  firstName: (fullname: string) =>
    fullname.includes(' ') ? `${fullname.split(' ')[0]}` : fullname,
};

export const MailConfig = {
  transport: {
    host: 'smtp.mailgun.org',
    secure: false,
    port: 587,
    ignoreTLS: true,
    auth: {
      user: 'postmaster@sandbox2ee21ac595ff4e3f80b952187e584da2.mailgun.org',
      pass: '861b9617e7fae554125d4505ce8aff71-324e0bb2-0a66062b',
    },
  },
  defaults: {
    from: '"Antlia App" <noreply@example.com>',
  },
  template: {
    dir: join(__dirname, '../modules/mail/templates'),
    adapter: new HandlebarsAdapter(helpers),
    options: {
      strict: true,
    },
  },
};
