import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { HealthMark } from './entities/health.entity';
import { HealthService } from './health.service';
import { AddHealthMarkInput, AddHealthMarkOutput } from './dtos/add-health-mark.dto';
import { AddHealthMarkGrpInput, AddHealthMarkGrpOutput } from './dtos/add-health-mark-grp.dto.';

@Resolver(of => HealthMark)
export class HealthResolver {
    constructor(private readonly service: HealthService){}

    @Mutation(type=> AddHealthMarkGrpOutput)
    addHealthMarkGrp(@Args('input') addHealthMarkGrpInput: AddHealthMarkGrpInput): Promise<AddHealthMarkGrpOutput> {
        return this.service.addHealthMarkGrp(addHealthMarkGrpInput);
    }

    @Mutation(type=> AddHealthMarkOutput)
    addHealthMark(@Args('input') addHealthMarkInput: AddHealthMarkInput): Promise<AddHealthMarkOutput> {
        return this.service.addHealthMark(addHealthMarkInput);
    }

}
