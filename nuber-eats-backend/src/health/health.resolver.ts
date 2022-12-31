import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { HealthMark } from './entities/health.entity';
import { HealthService } from './health.service';
import { HealthMarkArgs, HealthMarkInput, HealthMarkOutput} from './dtos/health.dto';

@Resolver(of => HealthMark)
export class HealthResolver {
    constructor(private readonly service: HealthService){}

    @Mutation(type=> Boolean)
    addHealthMark(@Args() dto : HealthMarkArgs): boolean {
        return this.service.insertOne(dto);
    }

    @Query(type=>HealthMarkOutput, {nullable: true})
    findHealthMark(@Args('id') id: number): Promise<HealthMark>{
        return this.service.getOne(id);
    }

    @Query(type=>[HealthMarkOutput])
    allHealthMarks(): Promise<HealthMark[]> {
        return this.service.getAll();
    }

}
