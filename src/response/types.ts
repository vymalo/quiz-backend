import { ApiProperty } from '@nestjs/swagger';

export class CreateResponseDto {
  @ApiProperty({
    description: '',
    required: true,
  })
  topic: string;

  @ApiProperty({
    description: '',
    required: true,
  })
  question: string;

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

export class ResponseDto {
  @ApiProperty({
    description: '',
    required: true,
  })
  public readonly r: string;

  @ApiProperty({
    description: '',
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
    description: '',
    required: true,
    type: [ResponseDto],
  })
  public readonly responses: ResponseDto[];

  @ApiProperty({
    description: '',
    required: true,
    type: Number,
  })
  public readonly count: number;

  @ApiProperty({
    description: '',
    required: true,
    type: Number,
  })
  public readonly countGood: number;

  @ApiProperty({
    description: '',
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
