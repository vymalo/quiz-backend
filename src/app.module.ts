import { Module } from '@nestjs/common';
import { QuestionModule } from './question/question.module';
import { ResponseModule } from './response/response.module';
import { AiModule } from './ai/ai.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv, Keyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';
import { HealthModule } from './health/health.module';
import { DbModule } from './db/db.module';
import { ModelModule } from './model/model.module';

@Module({
  imports: [
    QuestionModule,
    ResponseModule,
    AiModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        isGlobal: true,
        stores: [
          new Keyv({
            store: new CacheableMemory({
              ttl: config.get('CACHE_TTL'),
              lruSize: 5000,
            }),
          }),
          createKeyv(config.get('CACHE_REDIS_URL')),
        ],
      }),
      inject: [ConfigService],
    }),
    HealthModule,
    DbModule,
    ModelModule,
  ],
})
export class AppModule {}
