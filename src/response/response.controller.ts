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
      'Submits a response for a given question and evaluates its correctness.',
    summary: 'Submit and evaluate a response',
    operationId: 'create_response',
  })
  @ApiBody({
    description: "The question and the user's response.",
    type: CreateResponseDto,
  })
  @ApiOkResponse({
    description:
      'Returns the evaluation of the response, indicating good and bad aspects.',
    type: ResponsesDto,
  })
  @Post()
  @HttpCode(200)
  @CacheTTL(200)
  @CacheKey('create_response')
  public async createResponse(@Body() dto: CreateResponseDto) {
    const {
      goodResponses: { questions: goodResponses },
      badResponses: { questions: badResponses },
    } = await this.service.createResponse(dto);
    return new ResponsesDto(dto.question, goodResponses, badResponses);
  }
}
