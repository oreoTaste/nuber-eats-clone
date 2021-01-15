import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';

@Injectable()
export class PodcastService {
  constructor(
    @InjectRepository(Podcast)
    private podcastRepository: Repository<Podcast>,
    @InjectRepository(Episode)
    private episodeRepository: Repository<Episode>,
  ) {}

  async getAll(): Promise<Podcast[]> {
    return await this.podcastRepository.find({ take: 3000 });
  }

  async getOne(id: number): Promise<Podcast> {
    const podcast = await this.podcastRepository.findOne(id);
    if (podcast === undefined || podcast === null) {
      throw new NotFoundException(
        `Couldn't find podcast with the podcast id: ${id}`,
      );
    }
    return podcast;
  }

  async getAllPodcasts(): Promise<AllPodcastsOutput> {
    try {
      const podcasts = await this.podcastRepository
        .createQueryBuilder('podcast')
        .leftJoinAndSelect('podcast.episodes', 'episodes')
        .getMany();
      if (podcasts.length <= 0) {
        throw new NotFoundException("Couldn't find any podcast");
      }
      return { podcasts, ok: true };
    } catch (e) {
      return { error: e.message, ok: false, podcasts: null };
    }
  }

  async getPodcast({ id }: MyPodcastInput): Promise<MyPodcastOutput> {
    try {
      const podcast = await this.podcastRepository
        .createQueryBuilder('podcast')
        .leftJoinAndSelect('podcast.episodes', 'episodes')
        .where('podcast.id = :id', { id })
        .getOne();
      if (!podcast) {
        throw new NotFoundException(`Podcast id : ${id} is not found`);
      }
      return { podcast, ok: true };
    } catch (e) {
      return { podcast: null, ok: false, error: e.message };
    }
  }

  async createPodcast(
    createPodcastInput: CreatePodcastInput,
  ): Promise<CreatePodcastOutput> {
    try {
      const newPodcast = this.podcastRepository.create(createPodcastInput);
      await this.podcastRepository.save(newPodcast);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async updatePodcast({
    id,
    ...rest
  }: UpdatePodcastInput): Promise<UpdatePodcastOutput> {
    try {
      await this.getOne(id);
      await this.podcastRepository.update(id, {
        ...rest,
      });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async removePodcast({
    id,
  }: DeletePodcastInput): Promise<DeletePodcastOutput> {
    try {
      await this.getOne(id);

      const result = await (await this.podcastRepository.delete(id)).affected;
      if (result <= 0) {
        throw new NotImplementedException(
          "Couldn't remove podcast for some reason",
        );
      }
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async getAllEpisodes({ id }: AllEpisodesInput): Promise<AllEpisodesOutput> {
    try {
      const episodes = await this.episodeRepository
        .createQueryBuilder('episode')
        .leftJoin('episode.podcast', 'podcast')
        .where('podcast.id = :id', { id })
        .getMany();
      if (episodes.length <= 0) {
        throw new NotFoundException(
          `Couldn't find episode with the podcast ${id}`,
        );
      }
      return { ok: true, episodes };
    } catch (e) {
      return { episodes: null, ok: false, error: e.message };
    }
  }

  async getEpisode({
    podcastId,
    id,
  }: MyEpisodeInput): Promise<MyEpisodeOutput> {
    try {
      const episode = await this.episodeRepository
        .createQueryBuilder('episode')
        .leftJoin('episode.podcast', 'podcast')
        .where('podcast.id = :podcastId and episode.id = :episodeId', {
          podcastId,
          episodeId: id,
        })
        .getOne();
      if (episode === undefined || episode === null) {
        throw new NotFoundException(
          `Couldn't find episode with the podcast id ${podcastId}and episode id : ${id}`,
        );
      }
      return { episode, ok: true };
    } catch (e) {
      return { ok: false, error: e.message, episode: null };
    }
  }

  async createEpisode({
    podcastId,
    ...rest
  }: CreateEpisodeInput): Promise<CreateEpisodeOutput> {
    try {
      const podcast = await this.getOne(podcastId);

      if (podcast === null || podcast === undefined) {
        throw new NotImplementedException(
          `Couldn't find podcast with podcast id : ${podcastId} to create episode`,
        );
      }
      await this.episodeRepository
        .save(this.episodeRepository.create({ ...rest, podcast }))
        .then((resp) => {
          console.log(resp);
        });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async updateEpisode({
    podcastId,
    id,
    ...rest
  }: UpdateEpisodeInput): Promise<UpdateEpisodeOutput> {
    try {
      const podcast = await this.getOne(podcastId);
      const result = await (
        await this.episodeRepository.update({ podcast, id }, { ...rest })
      ).affected;
      if (result > 0) {
        return { ok: true };
      } else {
        throw new NotImplementedException('Nothing Updated');
      }
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async removeEpisode({
    podcastId,
    id,
  }: DeleteEpisodeInput): Promise<DeleteEpisodeOutput> {
    try {
      const podcast = await this.getOne(podcastId);
      const result = await (
        await this.episodeRepository.delete({ id, podcast })
      ).affected;
      if (result < 0) {
        throw new NotImplementedException('Nothing Removed');
      }
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }
}
