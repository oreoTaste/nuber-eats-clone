import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'src/logger/logger.service';
import Mailgun from 'mailgun.js';
import * as formData from 'form-data';
import { MailgunMessageData } from 'mailgun.js/interfaces/Messages';

type VARIABLES = {
    username: string,
    code: string
}

@Injectable()
export class MailService {
    constructor(private readonly configService: ConfigService
              , private readonly logger: Logger){
        this.logger.setContext(MailService.name);
        this.logger.log("MailService", "constructor");
        // this.sendTemplate('youngkuk.sohn@gmail.com', 'test subject', 'verification', {username: "Youngkuk Sohn", code: "test code 12345"});
        // this.sendText('youngkuk.sohn@gmail.com', 'test subject', "normal text");
    }

    async sendTemplate(emailTo: string, subject: string, template: string, variables: VARIABLES): Promise<boolean> {
        const EMAILFROM = this.configService.get("MAILGUN_FROM_EMAIL");
        const data = {from: `Health Manager <${EMAILFROM}>`,
                            to: emailTo,
                            subject,
                            template,
                            'h:X-Mailgun-Variables': JSON.stringify(variables)
                        };
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
            this.logger.log(`emailTo:${emailTo}, subject:${subject}`,'send');
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