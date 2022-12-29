import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { HealthMark } from './entities/health.entity';
import { HealthService } from './health.service';
import { HealthMarkArgs, HealthMarkInput, HealthMarkOutput} from './dtos/health.dto';

@Resolver(type => HealthMark)
export class HealthResolver {
    constructor(private readonly service: HealthService){}

    @Mutation(()=> String)
    insertOne(@Args() dto : HealthMarkArgs):boolean {
        return this.service.insertOne(dto);
    }

    @Query(()=>HealthMarkOutput, {nullable: true})
    getOne(@Args('id') id: number) : Promise<HealthMark>{
        return this.service.getOne(id);
    }

    @Query(()=>[HealthMarkOutput])
    allProperties(): Promise<HealthMark[]> {
        return this.service.getAll();
    }

}
