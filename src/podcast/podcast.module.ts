import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { EpisodeResolver, PodcastResolver } from './podcast.resolver';
import { PodcastService } from './podcast.service';

@Module({
  imports: [TypeOrmModule.forFeature([Podcast, Episode])],
  providers: [PodcastResolver, EpisodeResolver, PodcastService],
})
export class PodcastModule {}
