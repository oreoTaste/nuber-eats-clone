import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsDate, IsNumber, IsOptional } from 'class-validator';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class CoreEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  @IsNumber()
  @IsOptional()
  id: number;

  @Field(() => Date)
  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;
}
