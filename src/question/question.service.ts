import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { CreateQuestionDto } from './types';

@Injectable()
export class QuestionService {
  constructor(private readonly aiService: AiService) {}

  public async createQuestions(dto: CreateQuestionDto) {
    const template = this.prepareTemplate(dto);
    return this.aiService.createQuestion(dto.topic, template, {
      local_db: dto.local_db,
      web: dto.web,
    });
  }

  private prepareTemplate(dto: CreateQuestionDto) {
    return `
Please create questions about "${dto.topic}".
${dto.complement && 'More specifically:'}
${dto.complement ?? ''}

${dto.extraPrompt && 'Additional prompt:'}
${dto.extraPrompt ?? ''}

Start now.
`.trim();
  }
}
