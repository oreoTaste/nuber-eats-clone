import { ApolloDriver } from '@nestjs/apollo';
import { ApolloDriverConfig } from '@nestjs/apollo/dist/interfaces';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantModule } from './restaurant/restaurant.module';
import { TypeOrmModule } from "@nestjs/typeorm";
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5433,
      username: "oreoTaste",
      password: "1234",
      database: "nuber-eats",
      synchronize: true,
      logging: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
      subscribers: [],
      migrations: [],
  }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true}),
    RestaurantModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
