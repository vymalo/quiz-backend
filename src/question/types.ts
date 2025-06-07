import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({
    description:
      'The main topic for generating questions. This should be specific enough to generate focused questions ' +
      'but not so narrow that the AI model has insufficient context. ' +
      'Examples: "Java Concurrency", "History of Rome", "Machine Learning Algorithms", "Climate Change".',
    required: true,
    example: 'JavaScript Promises',
  })
  @IsNotEmpty({
    message: '[topic] params shall be a string',
  })
  topic: string;

  @ApiProperty({
    description:
      'Optional complementary information or context to further refine the questions. ' +
      'This can include specific aspects, time periods, or subtopics within the main topic. ' +
      'Examples: "ES6 features", "The Punic Wars", "Synchronization good practices", "Neural Networks".',
    required: false,
    example: 'async/await syntax and error handling',
  })
  @IsString({
    message: '[complement] params shall be a string if specified',
  })
  @ValidateIf((obj: CreateQuestionDto) => !!obj.complement)
  complement?: string;

  @ApiProperty({
    description:
      'Optional additional instructions or constraints for the AI generating the questions. ' +
      'This can include specific formats, difficulty levels, or types of questions to include or exclude. ' +
      'Examples: "Include code examples", "Focus on practical applications", "Include both theoretical and applied questions".',
    required: false,
    example: 'Include questions about best practices and common pitfalls',
  })
  @IsString({
    message: '[extra_prompt] params shall be a string if specified',
  })
  @ValidateIf((obj: CreateQuestionDto) => !!obj.extra_prompt)
  extra_prompt?: string;

  @ApiProperty({
    description:
      'Optional reference to a specific knowledge base to use when generating questions. ' +
      "This allows the questions to be based on specific stored knowledge rather than the AI's general knowledge. " +
      'The knowledge base must exist in the system before it can be referenced.',
    required: false,
    example: 'javascript-es6-guide',
  })
  @IsString({
    message: '[knowledge_name_slug] params shall be a string if specified',
  })
  @ValidateIf((obj: CreateQuestionDto) => !!obj.knowledge_name_slug)
  knowledge_name_slug?: string;
}

export class QuestionDto {
  @ApiProperty({
    description:
      'The text of the generated question. This is the complete question text that can be presented to users.',
    required: true,
    example:
      'What is the primary advantage of using async/await syntax over traditional Promise chains in JavaScript?',
  })
  public readonly q: string;

  constructor(question: string) {
    this.q = question;
  }
}

export class QuestionsDto {
  @ApiProperty({
    description:
      'A list of generated questions. Each question is represented as a QuestionDto object.',
    required: true,
    type: [QuestionDto],
  })
  public readonly questions: QuestionDto[];

  @ApiProperty({
    description:
      'The total number of questions generated. This value will match the length of the questions array.',
    required: true,
    type: Number,
    example: 5,
  })
  public readonly count: number;

  constructor(questions: string[]) {
    this.questions = questions.map((q) => new QuestionDto(q));
    this.count = questions.length;
  }
}
