import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChromaClient } from 'chromadb';
import { DbService } from './db.service';
import { DbController } from './db.controller';
import { ModelModule } from '../model/model.module';
import { TOKEN_DB } from '../constants';

@Module({
  providers: [
    {
      provide: TOKEN_DB,
      useFactory: (config: ConfigService) =>
        new ChromaClient({
          host: config.get('CHROMA_HOST'),
          port: config.get('CHROMA_PORT'),
          database: config.get('CHROMA_DATABASE'),
        }),
      inject: [ConfigService],
    },
    DbService,
  ],
  imports: [ModelModule],
  exports: [DbService],
  controllers: [DbController],
})
export class DbModule {}
