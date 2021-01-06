import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PodcastModule } from './podcast/podcast.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    PodcastModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
