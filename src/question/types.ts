import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionsDto {
  @ApiProperty({
    description: '',
    required: true,
  })
  topic: string;

  @ApiProperty({
    description: '',
    required: false,
  })
  complement?: string;

  @ApiProperty({
    required: false,
  })
  extraPrompt?: string;
}

export class QuestionDto {
  @ApiProperty({
    description: '',
    required: true,
  })
  public readonly q: string;

  constructor(question: string) {
    this.q = question;
  }
}

export class QuestionsDto {
  @ApiProperty({
    description: '',
    required: true,
    type: [QuestionDto],
  })
  public readonly questions: QuestionDto[];

  @ApiProperty({
    description: '',
    required: true,
    type: Number,
  })
  public readonly count: number;

  constructor(questions: string[]) {
    this.questions = questions.map((q) => new QuestionDto(q));
    this.count = questions.length;
  }
}
