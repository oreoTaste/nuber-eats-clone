import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CommonOutput {
    @Field({nullable: true})
    cnt: number;

    @Field({nullable: true})
    reason: string;
}