import { Inject, Injectable, Logger } from '@nestjs/common';
import { generateObject, generateText, tool } from 'ai';
import {
  TOKEN_QUESTION_MODEL,
  TOKEN_RESPONSE_MODEL,
  TOKEN_SUMMARIZER_MODEL,
} from '../constants';
import type { LanguageModelV1 } from '@ai-sdk/provider';
import { z } from 'zod';
import { ConfigService } from '@nestjs/config';
import { DbService } from '../db/db.service';

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
    const { text } = await generateText({
      model: this.openaiQuestionModel,
      tools: tooling && params ? this.getTools(params) : undefined,
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
- Check the knowledge base if there's new data.

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
    params?: CreateParams,
  ) {
    const tooling =
      this.configService.get('OPENAI_RESPONSE_TOOLING') === 'true';

    const { text } = await generateText({
      model: this.openaiResponseModel,
      prompt: template,
      tools: tooling && params ? this.getTools(params) : undefined,
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
              query_result: result,
            };
          } catch (error) {
            Logger.log(regex, error);
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
