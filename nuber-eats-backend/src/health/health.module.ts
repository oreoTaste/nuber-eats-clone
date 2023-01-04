import { Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthResolver } from './health.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthMark, HealthMarkGrp, HealthRecord } from './entities/health.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HealthMark, HealthMarkGrp, HealthRecord, User])],
  providers: [HealthService, HealthResolver]
})
export class HealthModule {}
