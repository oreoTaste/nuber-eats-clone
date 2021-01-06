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
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { PodcastService } from './podcast.service';

@Resolver()
export class PodcastResolver {
  constructor(private readonly podcastService: PodcastService) {}

  @Query(() => AllPodcastsOutput)
  showAllPodcasts(): AllPodcastsOutput {
    return this.podcastService.getAllPodcasts();
  }

  @Query(() => MyPodcastOutput)
  showPodcast(
    @Args('MyPodcastInput') myPodcastInput: MyPodcastInput,
  ): MyPodcastOutput {
    return this.podcastService.getPodcast(myPodcastInput);
  }

  @Mutation(() => CreatePodcastOutput)
  createPodcast(
    @Args('CreatePodcastInput') createPodcastInput: CreatePodcastInput,
  ): CreatePodcastOutput {
    return this.podcastService.createPodcast(createPodcastInput);
  }

  @Mutation(() => UpdatePodcastOutput)
  updatePodcast(
    @Args('updatePodcastInput') updatePodcastInput: UpdatePodcastInput,
  ): UpdatePodcastOutput {
    console.log(updatePodcastInput);
    return this.podcastService.updatePodcast(updatePodcastInput);
  }

  @Mutation(() => DeletePodcastOutput)
  deletePodcast(
    @Args('deletePodcastInput') deletePodcastInput: DeletePodcastInput,
  ): DeletePodcastOutput {
    return this.podcastService.removePodcast(deletePodcastInput);
  }
}

@Resolver()
export class EpisodeResolver {
  constructor(private readonly podcastService: PodcastService) {}

  @Query(() => AllEpisodesOutput)
  showAllEpisodes(
    @Args('AllEpisodesInput') allEpisodesInput: AllEpisodesInput,
  ): AllEpisodesOutput {
    return this.podcastService.getAllEpisodes(allEpisodesInput);
  }

  @Query(() => MyEpisodeOutput)
  showEpisode(
    @Args('MyEpisodeInput') myEpisodeInput: MyEpisodeInput,
  ): MyEpisodeOutput {
    return this.podcastService.getEpisode(myEpisodeInput);
  }

  @Mutation(() => CreateEpisodeOutput)
  createEpisode(
    @Args('CreateEpisodeInput') createEpisodeInput: CreateEpisodeInput,
  ): CreateEpisodeOutput {
    return this.podcastService.createEpisode(createEpisodeInput);
  }

  @Mutation(() => UpdateEpisodeOutput)
  updateEpisode(
    @Args('UpdateEpisodeInput') updateEpisodeInput: UpdateEpisodeInput,
  ): UpdateEpisodeOutput {
    return this.podcastService.updateEpisode(updateEpisodeInput);
  }

  @Mutation(() => DeleteEpisodeOutput)
  deleteEpisode(
    @Args('DeleteEpisodeInput') deleteEpisodeInput: DeleteEpisodeInput,
  ): DeleteEpisodeOutput {
    return this.podcastService.removeEpisode(deleteEpisodeInput);
  }
}
