import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createOpenAI } from '@ai-sdk/openai';
import {
  TOKEN_QUESTION_MODEL,
  TOKEN_RESPONSE_MODEL,
  TOKEN_SUMMARIZER_MODEL,
  TOKEN_EMBEDDING_MODEL,
} from '../constants';

@Module({
  providers: [
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
  ],
  exports: [
    TOKEN_EMBEDDING_MODEL,
    TOKEN_QUESTION_MODEL,
    TOKEN_RESPONSE_MODEL,
    TOKEN_SUMMARIZER_MODEL,
  ],
})
export class ModelModule {}
