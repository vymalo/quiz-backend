import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { CreateResponseDto } from './types';

@Injectable()
export class ResponseService {
  constructor(private readonly aiService: AiService) {}

  public async createResponse(dto: CreateResponseDto) {
    const templateGood = this.prepareTemplate(dto, true);
    const templateBad = this.prepareTemplate(dto, false);

    const goodResponses = await this.aiService.createResponse(
      dto.topic,
      templateGood,
      true,
      {
        knowledge_name: dto.knowledge_name_slug,
      },
    );

    const badResponses = await this.aiService.createResponse(
      dto.topic,
      templateBad,
      false,
      {
        knowledge_name: dto.knowledge_name_slug,
      },
    );

    return { goodResponses, badResponses };
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
