import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';
import { Podcast } from './podcast.entity';
import * as bcrypt from 'bcrypt';

@ObjectType()
@InputType({ isAbstract: true })
@Entity()
export class Episode extends CoreEntity {
  @ManyToOne((type) => Podcast, (podcast) => podcast.episodes, { lazy: true })
  podcast: Podcast;

  @Field((is) => String)
  @Column()
  title: string;

  @Field((is) => String)
  @Column()
  story: string;

  @Field((is) => String)
  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
