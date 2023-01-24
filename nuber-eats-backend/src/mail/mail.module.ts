import { Module } from '@nestjs/common';
import { Logger } from 'src/logger/logger.service';
import { MailService } from './mail.service';

@Module({
  providers: [MailService, Logger],
})
export class MailModule {}
