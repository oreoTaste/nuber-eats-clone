import { ArgsType, Field } from "@nestjs/graphql";
import { IsBoolean, IsInt, IsString, Length } from "class-validator";

// @InputType()
@ArgsType()
export class RestaurantDto {
    @Field()
    @IsInt()
    id: Number
    @Field()
    @IsString()
    name : String
    @Field()
    @IsBoolean()
    isGood?: Boolean
}