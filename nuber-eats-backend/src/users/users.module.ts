import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserGrp } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserGrp])],
  providers: [UsersService, UsersResolver]
})
export class UsersModule {}
