import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { createOpenAI, OpenAIProvider } from '@ai-sdk/openai';
import { ConfigService } from '@nestjs/config';
import { TOKEN_QUESTION, TOKEN_QUESTION_MODEL, TOKEN_RESPONSE, TOKEN_RESPONSE_MODEL } from './constants';

@Module({
  providers: [
    AiService,
    {
      provide: TOKEN_QUESTION,
      useFactory: (config: ConfigService) =>
        createOpenAI({
          compatibility: 'compatible',
          baseURL: config.get('OPENAI_QUESTION_BASE_URL'),
          apiKey: config.get('OPENAI_QUESTION_API_KEY'),
        }),
      inject: [ConfigService],
    },
    {
      provide: TOKEN_QUESTION_MODEL,
      useFactory: (openai: OpenAIProvider, config: ConfigService) =>
        openai(config.get('OPENAI_QUESTION_MODEL')!),
      inject: [TOKEN_QUESTION, ConfigService],
    },
    {
      provide: TOKEN_RESPONSE,
      useFactory: (config: ConfigService) =>
        createOpenAI({
          compatibility: 'compatible',
          baseURL: config.get('OPENAI_RESPONSE_BASE_URL'),
          apiKey: config.get('OPENAI_RESPONSE_API_KEY'),
        }),
      inject: [ConfigService],
    },
    {
      provide: TOKEN_RESPONSE_MODEL,
      useFactory: (openai: OpenAIProvider, config: ConfigService) =>
        openai(config.get('OPENAI_RESPONSE_MODEL')!),
      inject: [TOKEN_RESPONSE, ConfigService],
    },
  ],
  exports: [AiService],
})
export class AiModule {}
