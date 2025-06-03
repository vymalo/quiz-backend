import { Inject, Injectable } from '@nestjs/common';
import { generateText } from 'ai';
import {
  SEPARATOR,
  TOKEN_QUESTION_MODEL,
  TOKEN_RESPONSE_MODEL,
} from './constants';
import type { LanguageModelV1 } from '@ai-sdk/provider';

@Injectable()
export class AiService {
  constructor(
    @Inject(TOKEN_QUESTION_MODEL)
    private readonly openaiQuestionModel: LanguageModelV1,
    @Inject(TOKEN_RESPONSE_MODEL)
    private readonly openaiResponseModel: LanguageModelV1,
  ) {}

  public async createQuestion(questionTemplate: string) {
    const { text } = await generateText({
      model: this.openaiQuestionModel,
      prompt: questionTemplate,
      temperature: 0.7,
      system: `
You're a useful assistant and work to help users create Q&A content for their classes. Please separate each question using "${SEPARATOR}".
- Format in a way that the questions are easy to read.
- Use introduction.
- No enumeration.
- Don't include answers.
- They should be short and concise.
- They should should be at least 15 items.
- Use markdown formatting.
- No HTML.
- No response.
- No conclusion.
- No explanation.
- Your first token should be a question already.
          `.trim(),
    });

    return text
      .split(SEPARATOR)
      .filter(Boolean)
      .map((i) => i.replace(/^\n+|\n+$/g, ''));
  }

  public async createResponse(questionTemplate: string) {
    const { text } = await generateText({
      model: this.openaiResponseModel,
      prompt: questionTemplate,
      temperature: 0.7,
      system: `
You're a useful assistant and work to help users create Q&A content for their classes.
- Please separate each response for a question using four "${SEPARATOR})".
- If asked for bad responses, make it misleading or incorrect.
          `.trim(),
    });

    return text
      .split(SEPARATOR)
      .filter(Boolean)
      .map((i) => i.replace(/^\n+|\n+$/g, ''));
  }
}
