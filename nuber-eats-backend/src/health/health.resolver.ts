import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { HealthMark } from './entities/health.entity';
import { HealthService } from './health.service';
import { AddHealthMarkInput, AddHealthMarkOutput } from './dtos/add-health-mark.dto';
import { AddHealthMarkGrpInput, AddHealthMarkGrpOutput } from './dtos/add-health-mark-grp.dto.';
import { FindHealthRecordInput, FindHealthRecordOutput } from './dtos/find-health-record.dto';
import { FindHealthMarkGrpInput, FindHealthMarkGrpOutput } from './dtos/find-health-mark-grp.dto';
import { FindHealthMarkInput, FindHealthMarkOutput } from './dtos/find-health-mark.dto';
import { AddHealthRecordInput, AddHealthRecordOutput } from './dtos/add-health-record.dto';

@Resolver(of => HealthMark)
export class HealthResolver {
    constructor(private readonly service: HealthService){}

    /**
     * @description 건강지표 그룹 추가
     */
    @Mutation(type=> AddHealthMarkGrpOutput)
    addHealthMarkGrp(@Args('input') input: AddHealthMarkGrpInput): Promise<AddHealthMarkGrpOutput> {
        return this.service.addHealthMarkGrp(input);
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
    @Mutation(type=> AddHealthMarkOutput)
    addHealthMark(@Args('input') input: AddHealthMarkInput): Promise<AddHealthMarkOutput> {
        return this.service.addHealthMark(input);
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
    @Mutation(type => AddHealthRecordOutput)
    addHealthRecord(@Args('input') input: AddHealthRecordInput): Promise<AddHealthRecordOutput> {
        return this.service.addHealthRecord(input);
    }

    /**
     * @description 사용자 건강기록 조회
     */
    @Query(type => FindHealthRecordOutput)
    findHealthRecord(@Args('input') input: FindHealthRecordInput): Promise<FindHealthRecordOutput> {
        return this.service.findHealthRecord(input);
    }
}
