import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll()', () => {
    it('should return an array', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne()', () => {
    it('should return a movie', () => {
      service.createMovie({
        title: 'Test Movie',
        genres: ['test'],
        year: 2000,
      });

      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
    });

    it('should throw 404 error', () => {
      try {
        service.getOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Movie with ID: 999 not found');
      }
    });
  });

  describe('deleteOne()', () => {
    it('deletes a movie', () => {
      const movieDto = {
        id: 1,
        year: 2020,
        title: 'men in black',
        genres: ['happy'],
      };
      service.createMovie(movieDto);
      const beforeDelete = service.getAll();
      service.deleteOne(1);
      const afterDelete = service.getAll();
      expect(beforeDelete.length).toEqual(afterDelete.length + 1);
      expect(beforeDelete.length).toBeGreaterThan(afterDelete.length);
    });

    it('should return error 404', () => {
      try {
        service.deleteOne(1);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('create()', () => {
    it('should create a movie', () => {
      const beforeCreate = service.getAll().length;
      service.createMovie({
        genres: ['family', 'kids'],
        title: 'title',
        year: 2020,
      });
      const afterCreate = service.getAll().length;
      expect(beforeCreate).toBeLessThan(afterCreate);
      expect(beforeCreate).toBe(afterCreate - 1);
    });

    it('should return error 404', () => {
      try {
        service.deleteOne(1);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('update()', () => {
    it('should be update a movie', () => {
      service.createMovie({
        genres: ['family', 'kids'],
        title: 'title',
        year: 2020,
      });
      const beforeUpdate = service.getOne(1);
      service.update(1, { genres: ['horror'] });
      const afterUpdate = service.getOne(1);

      expect(beforeUpdate.genres).toEqual(['family', 'kids']);
      expect(afterUpdate.genres).toEqual(['horror']);
    });

    it('should return error 404', () => {
      try {
        service.update(1, {});
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
