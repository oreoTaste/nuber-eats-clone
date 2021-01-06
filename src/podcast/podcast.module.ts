import { Module } from '@nestjs/common';
import { EpisodeResolver, PodcastResolver } from './podcast.resolver';
import { PodcastService } from './podcast.service';

@Module({
  providers: [PodcastResolver, EpisodeResolver, PodcastService],
})
export class PodcastModule {}
