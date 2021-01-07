import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import {
  Column,
  Double,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Episode } from './episode.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Podcast {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  @IsNumber()
  @IsOptional()
  id: number;

  @Field(() => String)
  @Column()
  @IsString()
  title: string;

  @Field(() => String)
  @Column()
  @IsString()
  category: string;

  @Field(() => Number)
  @Column()
  @IsNumber()
  rating: number;

  @Field(() => [Episode], { defaultValue: [] })
  @OneToMany((type) => Episode, (episode) => episode.podcast)
  @IsOptional()
  episodes: Episode[];
}
