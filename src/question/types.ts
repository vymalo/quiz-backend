import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({
    description:
      'The main topic for generating questions (e.g., "Java Concurrency", "History of Rome", ...).',
    required: true,
  })
  @IsNotEmpty({
    message: '[topic] params shall be a string',
  })
  topic: string;

  @ApiProperty({
    description:
      'Optional complementary information or context for the topic (e.g., "ES6 features", "The Punic Wars", "Synchronization good practices).',
    required: false,
  })
  @IsString({
    message: '[complement] params shall be a string if specified',
  })
  @ValidateIf((obj: CreateQuestionDto) => !!obj.complement)
  complement?: string;

  @ApiProperty({
    description:
      'Optional additional instructions or constraints for the AI generating the questions.',
    required: false,
  })
  @IsString({
    message: '[extraPrompt] params shall be a string if specified',
  })
  @ValidateIf((obj: CreateQuestionDto) => !!obj.extraPrompt)
  extraPrompt?: string;

  @ApiProperty({
    description: 'Optional toggle to activate web search.',
    required: false,
  })
  @IsBoolean({
    message: '[web] params shall be a string if specified',
  })
  @ValidateIf((obj: CreateQuestionDto) => !!obj.web)
  web?: boolean;

  @ApiProperty({
    description:
      'Optional name of the database where are saved related data specific to the topic. Can and shall be reused across multiple requests, and also between question and responses.',
    required: false,
  })
  @IsString({
    message: '[local_db] params shall be a string if specified',
  })
  @ValidateIf((obj: CreateQuestionDto) => !!obj.local_db)
  local_db?: string;
}

export class QuestionDto {
  @ApiProperty({
    description: 'The text of the question.',
    required: true,
  })
  public readonly q: string;

  constructor(question: string) {
    this.q = question;
  }
}

export class QuestionsDto {
  @ApiProperty({
    description: 'A list of generated questions.',
    required: true,
    type: [QuestionDto],
  })
  public readonly questions: QuestionDto[];

  @ApiProperty({
    description: 'The total number of questions generated.',
    required: true,
    type: Number,
  })
  public readonly count: number;

  constructor(questions: string[]) {
    this.questions = questions.map((q) => new QuestionDto(q));
    this.count = questions.length;
  }
}
