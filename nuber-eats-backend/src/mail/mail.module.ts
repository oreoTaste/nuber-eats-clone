import { DynamicModule, Module } from '@nestjs/common';
import { LoggerModule } from 'src/logger/logger.module';
import { Logger } from 'src/logger/logger.service';
import { MailService } from './mail.service';

@Module({
  imports: [LoggerModule],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
