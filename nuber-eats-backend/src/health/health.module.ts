import { Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthResolver } from './health.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthMark, HealthMarkGrp, HealthRecord } from './entities/health.entity';
import { CoreEntity } from 'src/common/entities/core.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HealthMark, HealthMarkGrp, HealthRecord])],
  providers: [HealthService, HealthResolver]
})
export class HealthModule {}
