import { Resolver, Query, Args, InputType } from '@nestjs/graphql';
import { Restaurant } from './restaurant.entity';

@Resolver(of => Restaurant)
export class RestaurantResolver {
    @Query(() => [Restaurant])
    allRestaurants(@Args("name") name: string): Restaurant[] {
        console.log(name);
        return [];
    }
    @Query(() => Boolean)
    isMine1(@Args() restaurant: Restaurant): boolean {
        console.log(restaurant);
        return true;
    }    

    @Query(() => Boolean)
    isMine2(@Args("restaurant") restaurant: Restaurant): boolean {
        console.log(restaurant);
        return true;
    }

}
