import { Args, InputType, ObjectType, Query, Resolver } from "@nestjs/graphql";
import { RestaurantDto } from "./dto/restaurant.dto";
import { Restaurant } from "./entity/restaurant.entity";

@Resolver()
export class RestaurantResolver {

    @Query(() => Restaurant)
    BestRestaurants(@Args() restaurant : RestaurantDto) : Restaurant {
        let r = new Restaurant()
        r.id = restaurant.id
        r.name = restaurant.name
        r.isGood = true
        return r
    }
}