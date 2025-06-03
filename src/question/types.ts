import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty({
    description:
      'The main topic for generating questions (e.g., "Java Concurrency", "History of Rome", ...).',
    required: true,
  })
  topic: string;

  @ApiProperty({
    description:
      'Optional complementary information or context for the topic (e.g., "ES6 features", "The Punic Wars", "Synchronization good practices).',
    required: false,
  })
  complement?: string;

  @ApiProperty({
    description:
      'Optional additional instructions or constraints for the AI generating the questions.',
    required: false,
  })
  extraPrompt?: string;
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
