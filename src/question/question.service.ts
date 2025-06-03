import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { CreateQuestionDto } from './types';

@Injectable()
export class QuestionService {
  constructor(private readonly aiService: AiService) {}

  public async createQuestions(dto: CreateQuestionDto) {
    const template = this.prepareTemplate(dto);
    return this.aiService.createQuestion(dto.topic, template);
  }

  private prepareTemplate(dto: CreateQuestionDto) {
    return `
Please create questions about "${dto.topic}".
${dto.complement ?? ''}

${dto.extraPrompt && 'Additional prompt:'}
${dto.extraPrompt ?? ''}

Start now.
`.trim();
  }
}
