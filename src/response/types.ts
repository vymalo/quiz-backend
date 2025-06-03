import { ApiProperty } from '@nestjs/swagger';

export class CreateResponseDto {
  @ApiProperty({
    description:
      'The topic of the question for which the response is being submitted.',
    required: true,
  })
  topic: string;

  @ApiProperty({
    description: 'The specific question text to which to respond to.',
    required: true,
  })
  question: string;

  @ApiProperty({
    description:
      'Optional complementary information related to the question or topic.',
    required: false,
  })
  complement?: string;

  @ApiProperty({
    description:
      'Optional additional instructions for evaluating the response.',
    required: false,
  })
  extraPrompt?: string;
}

export class ResponseDto {
  @ApiProperty({
    description: "The text of the question's response.",
    required: true,
  })
  public readonly r: string;

  @ApiProperty({
    description:
      'Indicates whether the response is considered good (true) or not (false).',
    required: true,
  })
  public readonly g: boolean;

  constructor(response: string, isGood: boolean) {
    this.r = response;
    this.g = isGood;
  }
}

export class ResponsesDto {
  @ApiProperty({
    description: 'A list of response evaluations.',
    required: true,
    type: [ResponseDto],
  })
  public readonly responses: ResponseDto[];

  @ApiProperty({
    description: 'The total number of evaluated responses.',
    required: true,
    type: Number,
  })
  public readonly count: number;

  @ApiProperty({
    description: 'The number of responses evaluated as good.',
    required: true,
    type: Number,
  })
  public readonly countGood: number;

  @ApiProperty({
    description:
      'The original question text for which these responses were submitted.',
    required: true,
  })
  public readonly question: string;

  constructor(
    question: string,
    goodResponses: string[],
    badResponses: string[],
  ) {
    this.responses = [
      goodResponses.map((i) => new ResponseDto(i, true)),
      badResponses.map((i) => new ResponseDto(i, false)),
    ].flatMap((i) => i);
    this.count = goodResponses.length + badResponses.length;
    this.countGood = goodResponses.length;
    this.question = question;
  }
}
