import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateQuestionDto, QuestionsDto } from './types';
import { QuestionService } from './question.service';

@ApiTags('questions')
@Controller('questions')
export class QuestionController {
  constructor(private readonly service: QuestionService) {}

  @ApiOperation({
    description:
      'Creates a new set of questions based on the provided topic and difficulty.',
    summary: 'Create new questions',
    operationId: 'create_question',
  })
  @ApiBody({
    description: 'The topic and difficulty level for generating questions.',
    type: CreateQuestionDto,
  })
  @ApiOkResponse({
    description: 'Successfully created questions.',
    type: QuestionsDto,
  })
  @Post()
  @HttpCode(200)
  public async createQuestions(@Body() dto: CreateQuestionDto) {
    const questions = await this.service.createQuestions(dto);
    return new QuestionsDto(questions);
  }
}
