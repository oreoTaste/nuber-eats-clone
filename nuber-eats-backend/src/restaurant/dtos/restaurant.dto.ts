import { ArgsType, InputType, OmitType } from "@nestjs/graphql";
import { Restaurant } from "../entities/restaurant.entity";

@ArgsType()
export class RestaurantDto extends OmitType(Restaurant, ['id'], ArgsType) {}
@InputType()
export class RestaurantInput extends OmitType(Restaurant, ['id'], InputType) {}
