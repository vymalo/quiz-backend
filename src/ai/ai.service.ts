import { Inject, Injectable, Logger } from '@nestjs/common';
import { generateObject, generateText, tool } from 'ai';
import {
  TOKEN_BRAVE_SEARCH,
  TOKEN_CHROMA_COLLECTION,
  TOKEN_QUESTION_MODEL,
  TOKEN_RESPONSE_MODEL,
  TOKEN_SUMMARIZER_MODEL,
} from './constants';
import type { LanguageModelV1 } from '@ai-sdk/provider';
import { z } from 'zod';
import type { Collection } from 'chromadb';
import type { BraveSearch } from 'brave-search';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  constructor(
    @Inject(TOKEN_SUMMARIZER_MODEL)
    private readonly openaiSummarizerModel: LanguageModelV1,
    @Inject(TOKEN_QUESTION_MODEL)
    private readonly openaiQuestionModel: LanguageModelV1,
    @Inject(TOKEN_RESPONSE_MODEL)
    private readonly openaiResponseModel: LanguageModelV1,
    @Inject(TOKEN_CHROMA_COLLECTION)
    private readonly chromaCollection: (
      local_db: string,
    ) => Promise<Collection>,
    @Inject(TOKEN_BRAVE_SEARCH)
    private readonly braveSearch: BraveSearch,
    private readonly configService: ConfigService,
  ) {}

  public async createQuestion(
    topic: string,
    template: string,
    params?: Partial<Record<'local_db', string> & Record<'web', boolean>>,
  ) {
    const { text } = await generateText({
      model: this.openaiQuestionModel,
      tools: this.getTools({
        ...params,
        tooling: this.configService.get('OPENAI_QUESTION_TOOLING') === 'true',
      }),
      prompt: template,
      temperature: 0.7,
      system: `
You're a senior expert "${topic}".
Your task is to generate a list of responses to a given question.

- Format in a way that the questions are easy to read.
- Use introduction.
- Don't include answers.
- They should be short and concise.
- They should should be at least 15 items.
- Use markdown formatting.
- No HTML.
- No response.
- No conclusion.
- No explanation.
- No introductory or concluding remarks from you.
- Your first generated token should be a question.
- Check the local db if there's new data.

Do not include any other text, explanations, or introductory/concluding remarks outside the responses themselves.
  `.trim(),
    });

    return this.formatList(
      `
Please format all these questions into a simple list without enumeration. 
- Don't reduce the amount.
- Remove pure duplicate questions.

Here're the data
${text}
  `.trim(),
    );
  }

  public async createResponse(
    topic: string,
    template: string,
    isGood: boolean,
    params?: Partial<Record<'local_db', string> & Record<'web', boolean>>,
  ) {
    const { text } = await generateText({
      model: this.openaiResponseModel,
      prompt: template,
      tools: this.getTools({
        ...params,
        tooling: this.configService.get('OPENAI_RESPONSE_TOOLING') === 'true',
      }),
      temperature: 0.7,
      system: `
You're a senior expert "${topic}".
Your task is to generate a list of responses to a given question.
${
  isGood &&
  `
Generate responses that are:
- Factually accurate and correct.
- Directly answer the question.
- Relevant and provide insightful, helpful, and complete information.
- Clearly written and easy to understand.
`.trim()
}

${
  !isGood &&
  `
Generate responses that are:
- Factually incorrect or misleading.
- Irrelevant or do not directly answer the question.
- Vague, incomplete, or lack necessary detail.
- Subtly flawed or contain common misconceptions related to the topic.
- Aim for plausible-sounding but incorrect/misleading answers where appropriate, rather than outright nonsensical ones.
`.trim()
}

Note:
- Format in a way that the response are easy to read.
- Create short responses.
- No introduction.
- Use markdown formatting.
- No HTML.
- No conclusion.
- No explanation.
- Your first token should be a response already.
          `.trim(),
    });

    return this.formatList(
      `
Please format (and enhance if needed) this responses into a list without enumeration:

${text}
  `.trim(),
    );
  }

  private async formatList(text: string) {
    const { object } = await generateObject({
      model: this.openaiSummarizerModel,
      schema: z.object({
        questions: z.array(z.string()),
      }),
      temperature: 0.3,
      prompt: text,
    });
    return object;
  }

  private getTools({
    web,
    local_db,
    tooling,
  }: Partial<Record<'web' | 'tooling', boolean> & Record<'local_db', string>>):
    | Record<string, any>
    | undefined {
    if (!tooling) {
      return undefined;
    }
    if (!(local_db && web)) {
      return undefined;
    }

    return {
      search_local_db:
        local_db &&
        tool({
          description: 'Search our data source',
          parameters: z.object({
            query: z.string().describe('The query of the search'),
          }),
          execute: async ({ query }) => {
            try {
              Logger.log(local_db, query, 'search_local_db');
              const collection = await this.chromaCollection(local_db);
              const result = await collection.query({
                queryTexts: [query],
              });

              return {
                query,
                query_result: result,
              };
            } catch (error) {
              Logger.log(query, error);
              return {
                query,
                query_result: 'could not find any results.',
              };
            }
          },
        }),
      save_to_local_db:
        local_db &&
        tool({
          description:
            'Save something our data source. Useful to speed-up future requests',
          parameters: z.object({
            text: z.string().describe('The text to save'),
          }),
          execute: async ({ text }) => {
            try {
              Logger.log(local_db, text, 'search_local_db');
              const collection = await this.chromaCollection(local_db);
              await collection.upsert({
                documents: [text],
                ids: [crypto.randomUUID()],
              });

              return {
                text,
                status: 'done',
              };
            } catch (error) {
              Logger.log(text, error);
              return {
                text,
                status: 'Could not save any results.',
              };
            }
          },
        }),
      search_web:
        web &&
        tool({
          description: 'Search the internet',
          parameters: z.object({
            query: z.string().describe('The query of the search'),
          }),
          execute: async ({ query }) => {
            try {
              Logger.log(query, 'search_web');
              const result = await this.braveSearch.webSearch(query);
              return {
                query,
                query_result: result.web,
              };
            } catch (error) {
              Logger.error(query, error);
              return {
                query,
                query_result: 'could not find any result',
              };
            }
          },
        }),
    };
  }
}
