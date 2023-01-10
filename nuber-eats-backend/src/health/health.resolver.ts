import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { HealthMark } from './entities/health.entity';
import { HealthService } from './health.service';
import { CreateHealthMarkInput, CreateHealthMarkOutput } from './dtos/create-health-mark.dto';
import { CreateHealthMarkGrpInput, CreateHealthMarkGrpOutput } from './dtos/create-health-mark-grp.dto.';
import { FindHealthRecordInput, FindHealthRecordOutput } from './dtos/find-health-record.dto';
import { FindHealthMarkGrpInput, FindHealthMarkGrpOutput } from './dtos/find-health-mark-grp.dto';
import { FindHealthMarkInput, FindHealthMarkOutput } from './dtos/find-health-mark.dto';
import { CreateHealthRecordInput, CreateHealthRecordOutput } from './dtos/create-health-record.dto';

@Resolver(of => HealthMark)
export class HealthResolver {
    constructor(private readonly service: HealthService){}

    /**
     * @description 건강지표 그룹 추가
     */
    @Mutation(type=> CreateHealthMarkGrpOutput)
    createHealthMarkGrp(@Args('input') input: CreateHealthMarkGrpInput): Promise<CreateHealthMarkGrpOutput> {
        return this.service.createHealthMarkGrp(input);
    }

    /**
     * @description 건강지표 그룹 조회
     */
    @Query(type=> FindHealthMarkGrpOutput)
    findHealthMarkGrp(@Args('input') input: FindHealthMarkGrpInput): Promise<FindHealthMarkGrpOutput> {
        return this.service.findHealthMarkGrp(input);
    }

    /**
     * @description 건강지표 추가
     */
    @Mutation(type=> CreateHealthMarkOutput)
    createHealthMark(@Args('input') input: CreateHealthMarkInput): Promise<CreateHealthMarkOutput> {
        return this.service.createHealthMark(input);
    }

    /**
     * @description 건강지표 조회
     */
    @Query(type=> FindHealthMarkOutput)
    findHealthMark(@Args('input') input: FindHealthMarkInput): Promise<FindHealthMarkOutput> {
        return this.service.findHealthMark(input);
    }

    /**
     * @description 사용자 건강기록 추가
     */
    @Mutation(type => CreateHealthRecordOutput)
    createHealthRecord(@Args('input') input: CreateHealthRecordInput): Promise<CreateHealthRecordOutput> {
        return this.service.createHealthRecord(input);
    }

    /**
     * @description 사용자 건강기록 조회
     */
    @Query(type => FindHealthRecordOutput)
    findHealthRecord(@Args('input') input: FindHealthRecordInput): Promise<FindHealthRecordOutput> {
        return this.service.findHealthRecord(input);
    }
}
