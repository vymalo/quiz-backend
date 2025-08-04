import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { CreateResponseDto, CreateResponseDtoType } from './types';

@Injectable()
export class ResponseService {
  constructor(private readonly aiService: AiService) {}

  public async createResponse(dto: CreateResponseDto) {
    const isGood = dto.response_type === CreateResponseDtoType.good;
    const template = this.prepareTemplate(dto, isGood);

    return await this.aiService.createResponse(dto.topic, template, isGood, {
      knowledge_name: dto.knowledge_name_slug,
    });
  }

  private prepareTemplate(dto: CreateResponseDto, isGood: boolean) {
    return `
**Question:** "${dto.question}"
**Number of responses to generate:** 3
${isGood ? 'good' : 'wrong/bad'} 

${dto.complement && 'Some complements:'}
${dto.complement ?? ''}

${dto.extra_prompt && 'Additional prompt:'}
${dto.extra_prompt ?? ''}

Start now.
  `.trim();
  }
}
