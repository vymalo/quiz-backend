import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateQuestionDto, QuestionsDto } from './types';
import { QuestionService } from './question.service';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('questions')
@Controller('questions')
export class QuestionController {
  constructor(private readonly service: QuestionService) {}

  @ApiOperation({
    description:
      'Creates a new set of quiz questions based on the provided topic and optional parameters. ' +
      'This endpoint leverages an AI model to generate contextually relevant questions that can be used ' +
      'for educational purposes, assessments, or interactive learning experiences. ' +
      'The questions are tailored to the specified topic and any complementary information provided. ' +
      'For best results, provide specific topics rather than broad categories.',
    summary: 'Create new questions',
    operationId: 'create_question',
  })
  @ApiBody({
    description: 'The topic and optional parameters for generating questions.',
    type: CreateQuestionDto,
    examples: {
      simple: {
        summary: 'Basic question generation',
        value: {
          topic: 'JavaScript Promises',
        },
      },
      withComplement: {
        summary: 'With complementary information',
        value: {
          topic: 'JavaScript Promises',
          complement: 'async/await syntax and error handling',
        },
      },
      withExtraPrompt: {
        summary: 'With additional instructions',
        value: {
          topic: 'JavaScript Promises',
          complement: 'async/await syntax',
          extra_prompt:
            'Include questions about best practices and common pitfalls',
        },
      },
      withKnowledgeNameSlug: {
        summary: 'With knowledge name slug',
        value: {
          topic: 'JavaScript Promises',
          complement: 'async/await syntax',
          knowledge_name_slug: 'javascript',
        },
      },
    },
  })
  @ApiOkResponse({
    description:
      'Successfully created questions. Returns an array of generated questions and a count.',
    type: QuestionsDto,
  })
  @Post()
  @HttpCode(200)
  @CacheTTL(200)
  @CacheKey('create_question')
  public async createQuestions(@Body() dto: CreateQuestionDto) {
    const { questions } = await this.service.createQuestions(dto);
    return new QuestionsDto(questions);
  }
}
