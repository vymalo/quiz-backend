import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { createOpenAI } from '@ai-sdk/openai';
import { ConfigService } from '@nestjs/config';
import {
  TOKEN_BRAVE_SEARCH,
  TOKEN_CHROMA_COLLECTION,
  TOKEN_EMBEDDING_MODEL,
  TOKEN_QUESTION_MODEL,
  TOKEN_RESPONSE_MODEL,
  TOKEN_SUMMARIZER_MODEL,
} from './constants';
import { ChromaClient } from 'chromadb';
import { BraveSearch } from 'brave-search';
import { EmbeddingModelV1 } from '@ai-sdk/provider';
import { embedMany } from 'ai';

@Module({
  providers: [
    AiService,
    {
      provide: TOKEN_CHROMA_COLLECTION,
      useFactory: (config: ConfigService, model: EmbeddingModelV1<string>) => {
        const client = new ChromaClient({
          host: config.get('CHROMA_HOST'),
          port: config.get('CHROMA_PORT'),
          database: config.get('CHROMA_DATABASE'),
        });

        return async (local_db: string) =>
          await client.getOrCreateCollection({
            name: `${config.get('CHROMA_COLLECTION_PREFIX')}${local_db}`,
            embeddingFunction: {
              generate: async (texts: string[]): Promise<number[][]> => {
                const { embeddings } = await embedMany({
                  model: model,
                  values: texts,
                });

                return embeddings;
              },
            },
          });
      },
      inject: [ConfigService, TOKEN_EMBEDDING_MODEL],
    },
    {
      provide: TOKEN_BRAVE_SEARCH,
      useFactory: (config: ConfigService) =>
        new BraveSearch(config.get('BRAVE_SEARCH_API_KEY')!),
      inject: [ConfigService],
    },
    {
      provide: TOKEN_QUESTION_MODEL,
      useFactory: (config: ConfigService) => {
        const openai = createOpenAI({
          compatibility: 'compatible',
          baseURL: config.get('OPENAI_QUESTION_BASE_URL'),
          apiKey: config.get('OPENAI_QUESTION_API_KEY'),
        });
        return openai(config.get('OPENAI_QUESTION_MODEL')!);
      },
      inject: [ConfigService],
    },
    {
      provide: TOKEN_RESPONSE_MODEL,
      useFactory: (config: ConfigService) => {
        const openai = createOpenAI({
          compatibility: 'compatible',
          baseURL: config.get('OPENAI_RESPONSE_BASE_URL'),
          apiKey: config.get('OPENAI_RESPONSE_API_KEY'),
        });
        return openai(config.get('OPENAI_RESPONSE_MODEL')!);
      },
      inject: [ConfigService],
    },
    {
      provide: TOKEN_SUMMARIZER_MODEL,
      useFactory: (config: ConfigService) => {
        const openai = createOpenAI({
          compatibility: 'compatible',
          baseURL: config.get('OPENAI_SUMMARIZER_BASE_URL'),
          apiKey: config.get('OPENAI_SUMMARIZER_API_KEY'),
        });
        return openai(config.get('OPENAI_SUMMARIZER_MODEL')!);
      },
      inject: [ConfigService],
    },
    {
      provide: TOKEN_EMBEDDING_MODEL,
      useFactory: (config: ConfigService) => {
        const openai = createOpenAI({
          compatibility: 'compatible',
          baseURL: config.get('OPENAI_EMBEDDING_BASE_URL'),
          apiKey: config.get('OPENAI_EMBEDDING_API_KEY'),
        });
        return openai.embedding(config.get('OPENAI_EMBEDDING_MODEL')!);
      },
      inject: [ConfigService],
    },
  ],
  exports: [AiService],
})
export class AiModule {}
