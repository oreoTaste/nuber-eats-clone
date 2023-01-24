import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'src/logger/logger.service';
import Mailgun from 'mailgun.js';
import formData from 'form-data';

@Injectable()
export class MailService {
    constructor(private readonly configService: ConfigService
              , private readonly logger: Logger){
        this.logger.setContext(MailService.name);
        this.logger.log("MailService", "constructor");
        // this.send('youngkuk.sohn@gmail.com', 'test subject', 'test body')
    }

    async send(emailTo: string, subject: string, text: string): Promise<boolean> {
        try {
            const EMAILFROM = this.configService.get("MAILGUN_FROM_EMAIL");
            const APIKEY = this.configService.get("MAILGUN_API_KEY");
            const username = "Health Manager";
            const client = new Mailgun(formData).client({ key: APIKEY, username });
            const DOMAIN = this.configService.get("MAILGUN_API_URL");

            let rslt = await client.messages.create(DOMAIN,{from: `Health Manager <${EMAILFROM}>`,
                                                            to: emailTo,
                                                            subject,
                                                            text});
            this.logger.log(`rslt:${rslt}`,'send');
            return true;
        } catch(e) {
            this.logger.error(`catch error e:${e}`,'send');
        }
        return false;
    }
}
