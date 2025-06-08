import { Inject, Injectable, Logger } from '@nestjs/common';
import { generateObject, generateText, NoObjectGeneratedError, tool } from 'ai';
import {
  TOKEN_QUESTION_MODEL,
  TOKEN_RESPONSE_MODEL,
  TOKEN_SUMMARIZER_MODEL,
} from '../constants';
import type { LanguageModelV1 } from '@ai-sdk/provider';
import { z } from 'zod';
import { ConfigService } from '@nestjs/config';
import { DbService } from '../db/db.service';
import { readFile } from 'fs-extra';
import { join } from 'node:path';

type CreateParams = Partial<Record<'knowledge_name', string>>;

@Injectable()
export class AiService {
  constructor(
    @Inject(TOKEN_SUMMARIZER_MODEL)
    private readonly openaiSummarizerModel: LanguageModelV1,
    @Inject(TOKEN_QUESTION_MODEL)
    private readonly openaiQuestionModel: LanguageModelV1,
    @Inject(TOKEN_RESPONSE_MODEL)
    private readonly openaiResponseModel: LanguageModelV1,
    private readonly configService: ConfigService,
    private readonly dbService: DbService,
  ) {}

  public async createQuestion(
    topic: string,
    template: string,
    params?: CreateParams,
  ) {
    const tooling =
      this.configService.get('OPENAI_QUESTION_TOOLING') === 'true';
    const systemPrompt = await this.readPrompt('create-question', { topic });
    const { text } = await generateText({
      model: this.openaiQuestionModel,
      tools: tooling && params ? this.getTools(params) : undefined,
      prompt: template,
      temperature: 0.7,
      system: systemPrompt.trim(),
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
    params?: CreateParams,
  ) {
    const tooling =
      this.configService.get('OPENAI_RESPONSE_TOOLING') === 'true';

    const systemPrompt = await this.readPrompt(
      isGood ? 'create-response-good' : 'create-response-bad',
      { topic },
    );

    const { text } = await generateText({
      model: this.openaiResponseModel,
      prompt: template,
      tools: tooling && params ? this.getTools(params) : undefined,
      temperature: 0,
      system: systemPrompt.trim(),
    });

    return this.formatResponseList(
      `
Please format (and enhance if needed) this responses into a list without enumeration:

${text}
  `.trim(),
    );
  }

  private async formatList(
    text: string,
    counter = 0,
  ): Promise<Record<'questions', string[]>> {
    if (counter === 3) {
      throw new Error('max custom retry reached');
    }

    try {
      const { object } = await generateObject({
        model: this.openaiSummarizerModel,
        schema: z.object({
          questions: z.array(z.string()),
        }),
        temperature: 0,
        prompt: text,
        maxRetries: 3,
      });
      return object;
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        console.log('NoObjectGeneratedError');
        console.log('Cause:', error.cause);
        console.log('Text:', error.text);
        console.log('Response:', error.response);
        console.log('Usage:', error.usage);
        console.log('Finish Reason:', error.finishReason);
        return this.formatList(text, 1 + counter);
      }

      throw error;
    }
  }

  private async formatResponseList(
    text: string,
    counter = 0,
  ): Promise<Record<'responses', string[]>> {
    if (counter === 3) {
      throw new Error('max custom retry reached');
    }

    try {
      const { object } = await generateObject({
        model: this.openaiSummarizerModel,
        schema: z.object({
          responses: z.array(z.string()),
        }),
        temperature: 0,
        prompt: text,
        maxRetries: 3,
      });
      return object;
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        console.log('NoObjectGeneratedError');
        console.log('Cause:', error.cause);
        console.log('Text:', error.text);
        console.log('Response:', error.response);
        console.log('Usage:', error.usage);
        console.log('Finish Reason:', error.finishReason);
        return this.formatResponseList(text, 1 + counter);
      }

      throw error;
    }
  }

  private async readPrompt(name: string, params: Record<string, string>) {
    const prompt = await readFile(
      join(process.cwd(), 'prompts', `${name}.md`),
      'utf-8',
    );
    return prompt.replace(/\$\{(\w+)\}/g, (_, key) => params[key] ?? '');
  }

  private getTools({
    knowledge_name,
  }: CreateParams): Record<string, ReturnType<typeof tool>> | undefined {
    if (!knowledge_name) {
      return undefined;
    }

    const tools: Record<string, any> = {};
    if (knowledge_name) {
      tools.search_knowledge = tool({
        description: 'Search our knowledge source',
        parameters: z.object({
          regex: z.string().describe('The regex for the search'),
        }),
        execute: async ({ regex }) => {
          try {
            Logger.log(knowledge_name, regex, 'search_knowledge');
            const collection =
              await this.dbService.getOrCreateCollection(knowledge_name);
            const result = await collection.query({
              whereDocument: {
                $regex: regex,
              },
            });

            return {
              regex,
              query_result: result.documents.flatMap((o) => o),
            };
          } catch (error) {
            Logger.log('regex >', regex, error);
            return {
              regex,
              query_result: 'could not find any results.',
            };
          }
        },
      });
    }

    if (Object.keys(tools).length === 0) {
      return undefined;
    }

    return tools;
  }
}
