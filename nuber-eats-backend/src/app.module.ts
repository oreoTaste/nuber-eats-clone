import { ApolloDriver } from '@nestjs/apollo';
import { ApolloDriverConfig } from '@nestjs/apollo/dist/interfaces';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { OCR } from './util/OCR';
import { HealthModule } from './health/health.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { UsersModule } from './users/users.module';

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
      namingStrategy: new SnakeNamingStrategy(), 
  }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // autoSchemaFile: true,
      playground: true}),

    HealthModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService, OCR],
})
export class AppModule {}
