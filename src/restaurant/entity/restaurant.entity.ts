import { Field, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsInt, IsString, Length } from "class-validator";

@ObjectType()
// @InputType()
export class Restaurant {
    @Field()
    @IsInt()
    @Length(10, 20)
    id: Number
    @Field()
    @IsString()
    name : String
    @Field()
    @IsBoolean()
    isGood?: Boolean
}