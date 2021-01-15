import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { PodcastService } from './podcast.service';

describe('PodcastService', () => {
  const mockRepository = () => ({
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });

  type MockRepository<T = any> = Partial<
    Record<keyof Repository<Podcast>, jest.Mock>
  >;

  let podcastService: PodcastService;
  let podcastRepository: MockRepository;
  let episodeRepository: MockRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PodcastService,
        {
          provide: getRepositoryToken(Podcast),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Episode),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    podcastService = module.get<PodcastService>(PodcastService);
    podcastRepository = module.get(getRepositoryToken(Podcast));
    episodeRepository = module.get(getRepositoryToken(Episode));
  });

  const createPodcast = {
    title: 'title',
    category: 'education',
    rating: 4.5,
    episodes: [],
  };
  describe('getAll', () => {
    it('should return podcasts', async () => {
      podcastRepository.find.mockResolvedValue([createPodcast]);
      const result = await podcastService.getAll();
      expect(result).toEqual([createPodcast]);
      expect(podcastRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getOne', () => {
    it('should return a podcast', async () => {
      podcastRepository.findOne.mockResolvedValue(createPodcast);
      const result = await podcastService.getOne(1);
      expect(result).toEqual(createPodcast);
      expect(podcastRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
  it.todo('getAllPodcasts');
  it.todo('getPodcast');
  it.todo('createPodcast');
  it.todo('updatePodcast');
  it.todo('removePodcast');
  it.todo('getAllEpisodes');
  it.todo('getEpisode');
  it.todo('createEpisode');
  it.todo('updateEpisode');
  it.todo('removeEpisode');
});
