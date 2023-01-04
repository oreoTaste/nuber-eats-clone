import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { HealthMark } from './entities/health.entity';
import { HealthService } from './health.service';
import { AddHealthMarkInput, AddHealthMarkOutput } from './dtos/add-health-mark.dto';
import { AddHealthMarkGrpInput, AddHealthMarkGrpOutput } from './dtos/add-health-mark-grp.dto.';
import { ShowHealthRecordInput, ShowHealthRecordOutput } from './dtos/show-health-record.dto';
import { ShowHealthMarkGrpInput, ShowHealthMarkGrpOutput } from './dtos/show-health-mark-grp.dto';
import { ShowHealthMarkInput, ShowHealthMarkOutput } from './dtos/show-health-mark.dto';

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
    @Query(type=> ShowHealthMarkGrpOutput)
    showHealthMarkGrp(@Args('input') input: ShowHealthMarkGrpInput): Promise<ShowHealthMarkGrpOutput> {
        return this.service.showHealthMarkGrp(input);
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
    @Query(type=> ShowHealthMarkOutput)
    showHealthMark(@Args('input') input: ShowHealthMarkInput): Promise<ShowHealthMarkOutput> {
        return this.service.showHealthMark(input);
    }

    /**
     * @description 사용자 건강기록 조회
     */
    @Query(type => ShowHealthRecordOutput)
    showHealthRecord(@Args('input') input: ShowHealthRecordInput): Promise<ShowHealthRecordOutput> {
        return this.service.showHealthRecord(input);
    }
}
