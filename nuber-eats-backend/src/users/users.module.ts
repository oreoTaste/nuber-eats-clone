import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerification, User, UserGrp } from './entities/user.entity';
import { Logger } from 'src/logger/logger.service';
import { MailService } from 'src/mail/mail.service';
import { LoggerModule } from 'src/logger/logger.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserGrp, EmailVerification]), LoggerModule, MailModule],
  providers: [UsersService, UsersResolver],
  exports: [UsersService]
})
export class UsersModule {}