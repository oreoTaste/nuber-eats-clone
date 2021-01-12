import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Episode } from './episode.entity';

enum podcastCategory {
  'education',
  'amusement',
}
registerEnumType(podcastCategory, { name: 'podcastCategory' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Podcast extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  title: string;

  @Field(() => podcastCategory)
  @Column({ type: 'enum', enum: podcastCategory })
  @IsString()
  category: string;

  @Field(() => Number)
  @Column({ type: 'float' })
  @IsNumber()
  rating: number;

  @Field(() => [Episode], { defaultValue: [] })
  @OneToMany((type) => Episode, (episode) => episode.podcast, {
    cascade: true,
    lazy: true,
    onDelete: 'CASCADE',
  })
  @IsOptional()
  episodes: Episode[];
}
