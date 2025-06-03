import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { CreateQuestionsDto } from './types';

@Injectable()
export class QuestionService {
  constructor(private readonly aiService: AiService) {}

  public async createQuestions(dto: CreateQuestionsDto) {
    const template = this.prepareTemplate(dto);
    return this.aiService.createQuestion(template);
  }

  private prepareTemplate(dto: CreateQuestionsDto) {
    return `
  Please create questions about "${dto.topic}".
  ${dto.complement ?? ''}
  
  ${dto.extraPrompt && 'Additional prompt'}
  ${dto.extraPrompt ?? ''}
  
  Start now.
  `.trim();
  }
}
