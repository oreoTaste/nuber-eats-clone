import { Injectable, NotFoundException } from '@nestjs/common';
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
    try {
      return await this.podcastRepository.find({ take: 3000 });
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getOne(id: number): Promise<Podcast> {
    try {
      return await this.podcastRepository.findOne(id);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getAllPodcasts(): Promise<AllPodcastsOutput> {
    const podcasts = await this.podcastRepository
      .createQueryBuilder('podcast')
      .leftJoinAndSelect('podcast.episodes', 'episodes')
      .getMany();
    return { podcasts, ok: true };
  }

  async getPodcast({ id }: MyPodcastInput): Promise<MyPodcastOutput> {
    const podcast = await this.podcastRepository
      .createQueryBuilder('podcast')
      .leftJoinAndSelect('podcast.episodes', 'episodes')
      .where('podcast.id = :id', { id })
      .getOne();
    if (!podcast) {
      throw new NotFoundException(`Podcast id : ${id} is not found`);
    }
    return { podcast, ok: true };
  }

  async createPodcast(
    createPodcastInput: CreatePodcastInput,
  ): Promise<CreatePodcastOutput> {
    const podcastlist = await this.getAll();
    let podcastId;
    if (podcastlist.length > 0) {
      podcastId = podcastlist[0].id;
      podcastlist.forEach((el) => {
        if (podcastId < el.id) {
          podcastId = el.id;
        }
      });
    } else {
      podcastId = podcastlist.length + 1;
    }

    const newPodcast = this.podcastRepository.create(createPodcastInput);
    newPodcast.id = podcastId;
    await this.podcastRepository.save(newPodcast);
    return { ok: true };
  }

  async updatePodcast({
    id,
    ...rest
  }: UpdatePodcastInput): Promise<UpdatePodcastOutput> {
    await this.podcastRepository.update(id, {
      ...rest,
    });
    return { ok: true };
  }

  async removePodcast({
    id,
  }: DeletePodcastInput): Promise<DeletePodcastOutput> {
    await this.getOne(id);
    await this.podcastRepository.delete(id);
    return { ok: true };
  }

  async getAllEpisodes({ id }: AllEpisodesInput): Promise<AllEpisodesOutput> {
    const episodes = await this.episodeRepository
      .createQueryBuilder('episode')
      .leftJoin('episode.podcast', 'podcast')
      .where('podcast.id = :id', { id })
      .getMany();
    return { ok: true, episodes };
  }

  async getEpisode({
    podcastId,
    id,
  }: MyEpisodeInput): Promise<MyEpisodeOutput> {
    const episodes = await this.episodeRepository
      .createQueryBuilder('episode')
      .leftJoin('episode.podcast', 'podcast')
      .where('podcast.id = :podcastId and episode.id = :episodeId', {
        podcastId,
        episodeId: id,
      })
      .getOne();
    return episodes;
  }

  async createEpisode({
    podcastId,
    story,
    title,
  }: CreateEpisodeInput): Promise<CreateEpisodeOutput> {
    const podcast = await this.getOne(podcastId);

    await this.episodeRepository.save(
      this.episodeRepository.create({ story, title, podcast }),
    );
    return { ok: true };
  }

  async updateEpisode({
    podcastId,
    id,
    ...rest
  }: UpdateEpisodeInput): Promise<UpdateEpisodeOutput> {
    const podcast = await this.getOne(podcastId);
    await this.episodeRepository.update({ podcast, id }, { ...rest });
    return { ok: true };
  }

  async removeEpisode({
    podcastId,
    id,
  }: DeleteEpisodeInput): Promise<DeleteEpisodeOutput> {
    const podcast = await this.getOne(podcastId);
    await this.episodeRepository.delete({ id, podcast });
    return { ok: true };
  }
}
