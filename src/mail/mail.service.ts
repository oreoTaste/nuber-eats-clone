import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOption, MailVariables } from './mail.interface';
import got from 'got';
import * as FormData from 'form-data';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS)
    private readonly options: MailModuleOption,
  ) {}

  private async sendEmail(
    subject: string,
    content: string,
    to: string[],
    variables: MailVariables[],
  ) {
    const form = new FormData();
    form.append('from', `YK <mailgun@${this.options.domain}>`);
    to.forEach((el) => form.append('to', el));
    form.append('subject', subject);
    form.append('template', content);
    variables.forEach((el) => form.append(el.key, el.value));

    try {
      await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
        headers: {
          Authorization: `BASIC ${Buffer.from(
            `api:${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        method: 'POST',
        body: form,
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  async sendVerificationEmail(to: string[], username: string, code: string) {
    await this.sendEmail('Email Verification', 'verification', to, [
      { key: 'v:username', value: username },
      { key: 'v:code', value: code },
    ]);
  }
}
