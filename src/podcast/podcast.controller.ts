import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { PodcastService } from './podcast.service';

@Controller('podcasts')
export class PodcastController {
  constructor(private readonly podcastService: PodcastService) {}

  @Get()
  getAllPodcasts(): Podcast[] {
    return this.podcastService.getAllPodcasts();
  }
  @Post()
  createPodcast(@Body() podcastData: CreatePodcastDto) {
    return this.podcastService.createPodcast(podcastData);
  }

  @Get('/:id')
  getPodcast(@Param('id') podcastId: number) {
    return this.podcastService.getPodcast(podcastId);
  }

  @Patch('/:id')
  updatePodcast(
    @Param('id') podcastId: number,
    @Body() podcastData: UpdatePodcastDto,
  ) {
    return this.podcastService.updatePodcast(podcastId, podcastData);
  }

  @Delete('/:id')
  removePodcast(@Param('id') podcastId: number) {
    return this.podcastService.removePodcast(podcastId);
  }

  @Get('/:id/episodes')
  getAllEpisodes(@Param('id') podcastId: number): Episode[] {
    return this.podcastService.getAllEpisodes(podcastId);
  }

  @Post('/:id/episodes')
  createEpisode(
    @Param('id') podcastId: number,
    @Body() episodeData: CreateEpisodeDto,
  ) {
    return this.podcastService.createEpisode(podcastId, episodeData);
  }

  @Patch('/:id/episodes/:episodeId')
  updateEpisode(
    @Param('id') podcastId: number,
    @Param('episodeId') episodeId: number,
    @Body() episodeData: UpdateEpisodeDto,
  ) {
    return this.podcastService.updateEpisode(podcastId, episodeId, episodeData);
  }

  @Delete('/:id/episodes/:episodeId')
  removeEpisode(
    @Param('id') podcastId: number,
    @Param('episodeId') episodeId: number,
  ) {
    return this.podcastService.removeEpisode(podcastId, episodeId);
  }
}
