import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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
import { PodcastService } from './podcast.service';

@Resolver()
export class PodcastResolver {
  constructor(private readonly podcastService: PodcastService) {}

  @Query(() => AllPodcastsOutput)
  async showAllPodcasts(): Promise<AllPodcastsOutput> {
    return await this.podcastService.getAllPodcasts();
  }

  @Query(() => MyPodcastOutput)
  async showPodcast(
    @Args('MyPodcastInput') myPodcastInput: MyPodcastInput,
  ): Promise<MyPodcastOutput> {
    return await this.podcastService.getPodcast(myPodcastInput);
  }

  @Mutation(() => CreatePodcastOutput)
  async createPodcast(
    @Args('CreatePodcastInput') createPodcastInput: CreatePodcastInput,
  ): Promise<CreatePodcastOutput> {
    return await this.podcastService.createPodcast(createPodcastInput);
  }

  @Mutation(() => UpdatePodcastOutput)
  async updatePodcast(
    @Args('updatePodcastInput') updatePodcastInput: UpdatePodcastInput,
  ): Promise<UpdatePodcastOutput> {
    console.log(updatePodcastInput);
    return await this.podcastService.updatePodcast(updatePodcastInput);
  }

  @Mutation(() => DeletePodcastOutput)
  async deletePodcast(
    @Args('deletePodcastInput') deletePodcastInput: DeletePodcastInput,
  ): Promise<DeletePodcastOutput> {
    return await this.podcastService.removePodcast(deletePodcastInput);
  }
}

@Resolver()
export class EpisodeResolver {
  constructor(private readonly podcastService: PodcastService) {}

  @Query(() => AllEpisodesOutput)
  async showAllEpisodes(
    @Args('AllEpisodesInput') allEpisodesInput: AllEpisodesInput,
  ): Promise<AllEpisodesOutput> {
    return await this.podcastService.getAllEpisodes(allEpisodesInput);
  }

  @Query(() => MyEpisodeOutput)
  async showEpisode(
    @Args('MyEpisodeInput') myEpisodeInput: MyEpisodeInput,
  ): Promise<MyEpisodeOutput> {
    return await this.podcastService.getEpisode(myEpisodeInput);
  }

  @Mutation(() => CreateEpisodeOutput)
  async createEpisode(
    @Args('CreateEpisodeInput') createEpisodeInput: CreateEpisodeInput,
  ): Promise<CreateEpisodeOutput> {
    return await this.podcastService.createEpisode(createEpisodeInput);
  }

  @Mutation(() => UpdateEpisodeOutput)
  async updateEpisode(
    @Args('UpdateEpisodeInput') updateEpisodeInput: UpdateEpisodeInput,
  ): Promise<UpdateEpisodeOutput> {
    return await this.podcastService.updateEpisode(updateEpisodeInput);
  }

  @Mutation(() => DeleteEpisodeOutput)
  async deleteEpisode(
    @Args('DeleteEpisodeInput') deleteEpisodeInput: DeleteEpisodeInput,
  ): Promise<DeleteEpisodeOutput> {
    return await this.podcastService.removeEpisode(deleteEpisodeInput);
  }
}
