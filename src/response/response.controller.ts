import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseService } from './response.service';
import { CreateResponseDto, ResponsesDto } from './types';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('responses')
@Controller('responses')
export class ResponseController {
  constructor(private readonly service: ResponseService) {}

  @ApiOperation({
    description:
      'Submits a response for a given question and evaluates its correctness using AI analysis. ' +
      'This endpoint analyzes the provided response against the question context and topic, ' +
      'identifying both correct elements (good responses) and incorrect or incomplete elements (bad responses). ' +
      'The evaluation is comprehensive and considers factual accuracy, completeness, and relevance to the question. ' +
      'This can be used for educational assessment, self-study verification, or automated grading systems.',
    summary: 'Submit and evaluate a response',
    operationId: 'create_response',
  })
  @ApiBody({
    description:
      "The question, topic, and the user's response to be evaluated.",
    type: CreateResponseDto,
    examples: {
      basic: {
        summary: 'Basic response evaluation',
        value: {
          topic: 'JavaScript Promises',
          response_type: 'good',
          question:
            'Explain the difference between Promise.all() and Promise.race()',
        },
      },
      withComplement: {
        summary: 'With complementary information',
        value: {
          topic: 'JavaScript Promises',
          complement: 'Include error handling considerations',
          response_type: 'bad',
          question:
            'Explain the difference between Promise.all() and Promise.race()',
        },
      },
      withKnowledgeNameSlug: {
        summary: 'With knowledge name slug',
        value: {
          topic: 'JavaScript Promises',
          complement: 'Include error handling considerations',
          response_type: 'good',
          question:
            'Explain the difference between Promise.all() and Promise.race()',
          knowledge_name_slug: 'javascript',
        },
      },
    },
  })
  @ApiOkResponse({
    description:
      'Returns a detailed evaluation of the response, categorizing elements as good (correct) or bad (incorrect/incomplete). ' +
      'The response includes the original question, counts of good and bad elements, and the specific feedback points.',
    type: ResponsesDto,
  })
  @Post()
  @HttpCode(200)
  @CacheTTL(200)
  @CacheKey('create_response')
  public async createResponse(@Body() dto: CreateResponseDto) {
    const { responses } = await this.service.createResponse(dto);
    return new ResponsesDto(dto.question, responses, dto.response_type);
  }
}
