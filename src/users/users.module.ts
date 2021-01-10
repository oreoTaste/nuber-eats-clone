import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [TypeOrmModule.forFeature([Users])],
  exports: [UsersService],
})
export class UsersModule {}
