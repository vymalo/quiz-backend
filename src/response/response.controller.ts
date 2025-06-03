import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseService } from './response.service';
import { CreateResponseDto, ResponsesDto } from './types';

@ApiTags('responses')
@Controller('responses')
export class ResponseController {
  constructor(private readonly service: ResponseService) {}

  @ApiOperation({
    description: '',
    summary: 'create_response',
  })
  @ApiBody({
    description: '',
    type: CreateResponseDto,
  })
  @ApiOkResponse({
    description: '',
    type: ResponsesDto,
  })
  @Post()
  @HttpCode(200)
  public async createResponse(@Body() dto: CreateResponseDto) {
    const { goodResponses, badResponses } =
      await this.service.createResponse(dto);
    return new ResponsesDto(dto.question, goodResponses, badResponses);
  }
}
