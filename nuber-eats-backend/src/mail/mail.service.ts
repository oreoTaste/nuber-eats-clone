import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'src/logger/logger.service';
import Mailgun from 'mailgun.js';
import * as formData from 'form-data';
import { MailgunMessageData } from 'mailgun.js/interfaces/Messages';

type VARIABLE = {
    code: string,
    value: string
}

@Injectable()
export class MailService {
    constructor(private readonly configService: ConfigService
              , private readonly logger: Logger){
        this.logger.setContext(MailService.name);
        this.logger.log("MailService", "constructor");
        // this.sendTemplate('youngkuk.sohn@gmail.com', 'test subject', 'verification', [{code: "code", value: "12345"}, {code: "username", value: "Youngkuk Sohn"}]);
        // this.sendText('youngkuk.sohn@gmail.com', 'test subject', "normal text");
    }

    async sendTemplate(emailTo: string, subject: string, template: string, variables: VARIABLE[]): Promise<boolean> {
        const EMAILFROM = this.configService.get("MAILGUN_FROM_EMAIL");
        let mailgunVariables = {};
        variables.forEach(el => mailgunVariables[el.code] = el.value);
        const data = {from: `Health Manager <${EMAILFROM}>`,
                      to: emailTo,
                      subject,
                      template,
                      'h:X-Mailgun-Variables': JSON.stringify(mailgunVariables)};
        return await this.send(emailTo, subject, data);
    }
    async sendText(emailTo: string, subject: string, text: string): Promise<boolean> {
        const EMAILFROM = this.configService.get("MAILGUN_FROM_EMAIL");
        const data = {from: `Health Manager <${EMAILFROM}>`,
                      to: emailTo,
                      subject,
                      text};
        return await this.send(emailTo, subject, data);
    }

    async send(emailTo: string, subject: string, data: MailgunMessageData): Promise<boolean> {
        try {
            let {from, to, subject, text, template, ...etc} = data;
            this.logger.log(`from:${from}, emailTo:${emailTo}, subject:${subject}${text?`, text:`+text:""}${template?`, template:`+template: ""}, data:${etc['h:X-Mailgun-Variables']}`,'send');
            const APIKEY = this.configService.get("MAILGUN_API_KEY");
            const username = "Health Manager";
            const client = new Mailgun(formData).client({ key: APIKEY, username });
            const DOMAIN = this.configService.get("MAILGUN_API_URL");

            let {status, id, message} = await client.messages.create(DOMAIN, data);
            this.logger.log(`status:${status}, id:${id}, message:${message}`,'send');
            if(status == 200) {
                return true;
            }
            throw Error(message);
        } catch(e) {
            this.logger.error(`catch error e:${e}`,'send');
        }
        return false;
    }
}