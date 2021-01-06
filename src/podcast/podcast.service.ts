import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from './dto/create-episode.dto';
import {
  CreatePodcastInput,
  CreatePodcastOutput,
} from './dto/create-podcast.dto';
import {
  DeleteEpisodeInput,
  DeleteEpisodeOutput,
} from './dto/delete-episode.dto';
import {
  DeletePodcastInput,
  DeletePodcastOutput,
} from './dto/delete-podcast.dto';
import {
  AllEpisodesInput,
  AllEpisodesOutput,
  MyEpisodeInput,
  MyEpisodeOutput,
} from './dto/my-episode-dto';
import {
  AllPodcastsOutput,
  MyPodcastInput,
  MyPodcastOutput,
} from './dto/my-podcast.dto';
import {
  UpdateEpisodeInput,
  UpdateEpisodeOutput,
} from './dto/update-episode.dto';
import {
  UpdatePodcastInput,
  UpdatePodcastOutput,
} from './dto/update-podcast.dto';
import { Podcast } from './entities/podcast.entity';

@Injectable()
export class PodcastService {
  private podcasts: Podcast[] = [];

  getAll(): Podcast[] {
    return this.podcasts;
  }

  getOne(id: number): Podcast {
    return this.podcasts.find((el) => el.id === id);
  }

  getAllPodcasts(): AllPodcastsOutput {
    return { podcasts: this.getAll(), ok: true };
  }

  getPodcast({ id }: MyPodcastInput): MyPodcastOutput {
    const podcast = this.getOne(id);
    if (!podcast) {
      throw new NotFoundException(`Podcast id : ${id} is not found`);
    }
    return { podcast, ok: true };
  }
  createPodcast({
    title,
    category,
    rating,
  }: CreatePodcastInput): CreatePodcastOutput {
    if (this.podcasts.length > 0) {
      let maxPodcastId = this.podcasts[0].id;
      this.podcasts.forEach((el) => {
        if (maxPodcastId < el.id) {
          maxPodcastId = el.id;
        }
      });
      this.podcasts.push({
        id: maxPodcastId + 1,
        title,
        category,
        rating,
        episodes: [],
      });
    } else {
      this.podcasts.push({
        id: this.podcasts.length + 1,
        title,
        category,
        rating,
        episodes: [],
      });
    }
    return { ok: true };
  }
  updatePodcast({
    id,
    title,
    category,
    rating,
  }: UpdatePodcastInput): UpdatePodcastOutput {
    const podcast = this.getOne(id);
    this.removePodcast({ id: podcast.id });
    this.podcasts.push({ ...podcast, title, category, rating });
    return { ok: true };
  }

  removePodcast({ id }: DeletePodcastInput): DeletePodcastOutput {
    this.getOne(id);
    this.podcasts = this.podcasts.filter((el) => el.id !== id);
    return { ok: true };
  }

  getAllEpisodes({ id }: AllEpisodesInput): AllEpisodesOutput {
    const podcast = this.getOne(id);
    if (!podcast.episodes) {
      return { ok: true, episodes: [] };
    }
    return { ok: true, episodes: podcast.episodes };
  }

  getEpisode({ podcastId, id }: MyEpisodeInput): MyEpisodeOutput {
    const episodes = this.getAllEpisodes({ id: podcastId }).episodes;
    const episode = episodes.find((el) => el.id === id);
    return episode;
  }

  createEpisode({
    podcastId,
    story,
    title,
  }: CreateEpisodeInput): CreateEpisodeOutput {
    const podcast = this.getOne(podcastId);
    if (podcast.episodes === undefined || podcast.episodes.length <= 0) {
      podcast.episodes = [{ id: 1, story, title }];
    } else {
      let maxEpisodeId = podcast.episodes[0].id;
      podcast.episodes.forEach((el) => {
        if (maxEpisodeId < el.id) {
          maxEpisodeId = el.id;
        }
      });
      podcast.episodes.push({ id: maxEpisodeId + 1, story, title });
    }
    return { ok: true };
  }

  updateEpisode({
    podcastId,
    id,
    story,
    title,
  }: UpdateEpisodeInput): UpdateEpisodeOutput {
    const podcast = this.getOne(podcastId);
    const episode = podcast.episodes.find((el) => el.id === id);
    if (!episode) {
      throw new NotFoundException();
    }
    this.removeEpisode({ podcastId, id });
    podcast.episodes.push({ ...episode, id, story, title });
    return { ok: true };
  }

  removeEpisode({ podcastId, id }: DeleteEpisodeInput): DeleteEpisodeOutput {
    const podcast = this.getOne(podcastId);
    const episode = podcast.episodes.find((el) => el.id === id);
    podcast.episodes = podcast.episodes.filter((el) => el.id !== episode.id);
    return { ok: true };
  }
}
