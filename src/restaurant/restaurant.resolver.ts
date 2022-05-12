import { Args, Query, Resolver } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurant.entity';

@Resolver((_) => Restaurant)
export class RestaurantResolver {
  @Query(() => Restaurant)
  myRestaurant (@Args('id') id : Number) : Restaurant{
    console.log(id)
    let r = new Restaurant()
    r.isGood = true
    r.name = "myRestaurant"
    return r;
  }

  @Query(() => Restaurant)
  myRestaurant2() {
    let r = new Restaurant()
    r.isGood = false
    r.name = "myRestaurant2"
    return r;
  }

}
