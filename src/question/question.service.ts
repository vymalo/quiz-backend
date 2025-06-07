import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { CreateQuestionDto } from './types';

@Injectable()
export class QuestionService {
  constructor(private readonly aiService: AiService) {}

  public async createQuestions(dto: CreateQuestionDto) {
    const template = this.prepareTemplate(dto);
    return this.aiService.createQuestion(dto.topic, template, {
      knowledge_name: dto.knowledge_name_slug,
    });
  }

  private prepareTemplate(dto: CreateQuestionDto) {
    return `
Please create questions about "${dto.topic}".
${dto.complement && 'More specifically:'}
${dto.complement ?? ''}

${dto.extra_prompt && 'Additional prompt:'}
${dto.extra_prompt ?? ''}

Start now.
`.trim();
  }
}
