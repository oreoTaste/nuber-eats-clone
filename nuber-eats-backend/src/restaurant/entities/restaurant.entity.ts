import { ArgsType, Field, InputType, ObjectType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@InputType({ isAbstract: true })
@ArgsType()
@ObjectType()
@Entity()
export class Restaurant {
    @Field()
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Field({nullable: true})
    @Column({nullable: true})
    @ApiProperty()
    name?: string;
}


