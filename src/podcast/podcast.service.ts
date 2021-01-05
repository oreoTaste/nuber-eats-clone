import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';

@Injectable()
export class PodcastService {
  private podcasts: Podcast[] = [];

  getAllPodcasts() {
    return this.podcasts;
  }
  createPodcast(podcastData: Podcast) {
    if (this.podcasts.length > 0) {
      let maxPodcastId = this.podcasts[0].id;
      this.podcasts.forEach((el) => {
        if (maxPodcastId < el.id) {
          maxPodcastId = el.id;
        }
      });
      this.podcasts.push({ id: maxPodcastId + 1, ...podcastData });
    } else {
      this.podcasts.push({ id: this.podcasts.length + 1, ...podcastData });
    }
  }
  getPodcast(podcastId: number) {
    const podcast = this.podcasts.find((el) => el.id === podcastId);
    if (!podcast) {
      throw new NotFoundException(`Podcast id : ${podcastId} is not found`);
    }
    return podcast;
  }
  updatePodcast(podcastId: number, podcastData: UpdatePodcastDto) {
    const podcast = this.getPodcast(podcastId);
    this.removePodcast(podcast.id);
    this.podcasts.push({ ...podcast, ...podcastData });
  }
  removePodcast(podcastId: number) {
    this.getPodcast(podcastId);
    this.podcasts = this.podcasts.filter((el) => el.id !== podcastId);
  }
  getAllEpisodes(podcastId: number): Episode[] {
    const podcast = this.getPodcast(podcastId);
    if (!podcast.episodes) {
      return [];
    }
    return podcast.episodes;
  }
  createEpisode(podcastId: number, episodeData: CreateEpisodeDto) {
    const podcast = this.getPodcast(podcastId);
    if (podcast.episodes === undefined || podcast.episodes.length <= 0) {
      podcast.episodes = [{ id: 1, ...episodeData }];
    } else {
      let maxEpisodeId = podcast.episodes[0].id;
      podcast.episodes.forEach((el) => {
        if (maxEpisodeId < el.id) {
          maxEpisodeId = el.id;
        }
      });
      podcast.episodes.push({ id: maxEpisodeId + 1, ...episodeData });
    }
  }
  updateEpisode(
    podcastId: number,
    episodeId: number,
    episodeData: UpdateEpisodeDto,
  ) {
    const podcast = this.getPodcast(podcastId);
    const episode = podcast.episodes.find((el) => el.id === episodeId);
    if (!episode) {
      throw new NotFoundException();
    }
    this.removeEpisode(podcastId, episodeId);
    podcast.episodes.push({ ...episode, ...episodeData });
  }
  removeEpisode(podcastId: number, episodeId: number) {
    const podcast = this.getPodcast(podcastId);
    const episode = podcast.episodes.find((el) => el.id === episodeId);
    podcast.episodes = podcast.episodes.filter((el) => el.id !== episode.id);
  }
}
