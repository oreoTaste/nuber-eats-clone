import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserGrp } from './entities/user.entity';
import { Logger } from 'src/logger/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserGrp])],
  providers: [UsersService, UsersResolver, Logger],
  exports: [UsersService]
})
export class UsersModule {}