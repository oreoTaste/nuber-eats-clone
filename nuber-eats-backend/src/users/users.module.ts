import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerification, User, UserGrp } from './entities/user.entity';
import { Logger } from 'src/logger/logger.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserGrp, EmailVerification])],
  providers: [UsersService, UsersResolver, Logger, MailService],
  exports: [UsersService]
})
export class UsersModule {}