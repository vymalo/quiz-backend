import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { CreateResponseDto } from './types';

@Injectable()
export class ResponseService {
  constructor(private readonly aiService: AiService) {}

  public async createResponse(dto: CreateResponseDto) {
    const templateGood = this.prepareTemplate(dto, true);
    const templateBad = this.prepareTemplate(dto, false);
    const [goodResponses, badResponses] = await Promise.all([
      this.aiService.createResponse(dto.topic, templateGood, true),
      this.aiService.createResponse(dto.topic, templateBad, false),
    ]);

    return { goodResponses, badResponses };
  }

  private prepareTemplate(dto: CreateResponseDto, isGood: boolean) {
    return `
**Question:** "${dto.question}"
**Number of responses to generate:** 3
${isGood ? 'good' : 'wrong/bad'} 

${dto.complement && 'Some complements:'}
${dto.complement ?? ''}

${dto.extraPrompt && 'Additional prompt:'}
${dto.extraPrompt ?? ''}

Start now.
  `.trim();
  }
}
