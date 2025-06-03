import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateQuestionDto, QuestionsDto } from './types';
import { QuestionService } from './question.service';

@ApiTags('questions')
@Controller('questions')
export class QuestionController {
  constructor(private readonly service: QuestionService) {}

  @ApiOperation({
    description: '',
    summary: 'create_question',
  })
  @ApiBody({
    description: '',
    type: CreateQuestionDto,
  })
  @ApiOkResponse({
    description: '',
    type: QuestionsDto,
  })
  @Post()
  @HttpCode(200)
  public async createQuestions(@Body() dto: CreateQuestionDto) {
    const questions = await this.service.createQuestions(dto);
    return new QuestionsDto(questions);
  }
}
