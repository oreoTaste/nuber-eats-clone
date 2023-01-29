import { DynamicModule, Global, Module } from '@nestjs/common';
import { LoggerModule } from 'src/logger/logger.module';
import { Logger } from 'src/logger/logger.service';
import { MailService } from './mail.service';

// @Global()
@Module({
  imports: [LoggerModule],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
