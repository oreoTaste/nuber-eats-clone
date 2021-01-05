import { Module } from '@nestjs/common';
import { PodcastModule } from './podcast/podcast.module';

@Module({
  imports: [PodcastModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
