import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Podcast } from './podcast.entity';

@ObjectType()
@InputType({ isAbstract: true })
@Entity()
export class Episode {
  @ManyToOne((type) => Podcast, (podcast) => podcast.episodes)
  podcast: Podcast;

  @Field((is) => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field((is) => String)
  @Column()
  title: string;

  @Field((is) => String)
  @Column()
  story: string;
}
