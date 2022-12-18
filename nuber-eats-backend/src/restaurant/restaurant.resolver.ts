import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RestaurantService } from './restaurant.service';
import { RestaurantDto } from './dtos/restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Resolver()
export class RestaurantResolver {
    constructor(private readonly service: RestaurantService){}

    @Mutation(of => Boolean)
    createRestaurant(@Args() dto : RestaurantDto) : Promise<boolean>{
        return this.service.insert(dto);
    }

    @Query(of => [Restaurant])
    myRestaurant(@Args('name') name: string) : Promise<Restaurant[]> {
        return this.service.getAll(name);
    }
}
