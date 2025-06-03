import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ResponseService {
  constructor(
    private readonly aiService: AiService
  ) {
  }
}
