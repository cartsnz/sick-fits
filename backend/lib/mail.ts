import { createTransport, getTestMessageUrl } from 'nodemailer';

const transporter = createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function makeANiceEmail(text: string): string {
  return `
    <div style="
      border: solid 1px black;
      padding: 20px;
      font-family: sans-serif;
      line-height: 2;
      font-size: 30px;
    ">
    <h2>Hello There!</h2>
    <p>${text}</p>
    <p>Yo</p>
  `;
}

export interface MailResponse {
  accepted?: string[] | null;
  rejected?: null[] | null;
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  // eslint-disable-next-line no-use-before-define
  envelope: Envelope;
  messageId: string;
}

export interface Envelope {
  from: string;
  to?: string[] | null;
}

export async function sendPasswordResetEmail(
  resetToken: string,
  to: string
): Promise<void> {
  // email the user a token
  const info = (await transporter.sendMail({
    to,
    from: 'test@example.com',
    subject: 'Reset your password',
    html: makeANiceEmail(`Your Password Reset Token is here!
    <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click here to reset</a>
   `),
  })) as MailResponse;
  if (process.env.MAIL_USER.includes('ethereal.email')) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    // console.log(`Message sent - preview it at ${getTestMessageUrl(info)}`);
  }
}
