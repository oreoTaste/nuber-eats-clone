import { Field, ObjectType, InputType, ArgsType} from '@nestjs/graphql';
import { IsString, IsBoolean, IsOptional, Length } from 'class-validator';

@ObjectType()
@InputType("RestaurantInput", {isAbstract: true})
@ArgsType()
export class Restaurant {
    @Field(type => String)
    @IsString()
    @Length(3, 10)
    name: string;
    
    @Field(type => Boolean, {nullable: true})
    @IsBoolean()
    @IsOptional()
    isGood: boolean;
}

