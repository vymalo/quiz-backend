import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateResponseDto {
  @ApiProperty({
    description:
      'The topic of the question for which the response is being submitted.',
    required: true,
  })
  @IsNotEmpty({
    message: '[topic] params shall be a string',
  })
  topic: string;

  @ApiProperty({
    description: 'The specific question text to which to respond to.',
    required: true,
  })
  @IsNotEmpty({
    message: '[question] params shall be a string',
  })
  question: string;

  @ApiProperty({
    description:
      'Optional complementary information related to the question or topic.',
    required: false,
  })
  @IsString({
    message: '[complement] params shall be a string if specified',
  })
  @ValidateIf((obj: CreateResponseDto) => !!obj.complement)
  complement?: string;

  @ApiProperty({
    description:
      'Optional additional instructions for evaluating the response.',
    required: false,
  })
  @IsString({
    message: '[extraPrompt] params shall be a string if specified',
  })
  @ValidateIf((obj: CreateResponseDto) => !!obj.extraPrompt)
  extraPrompt?: string;

  @ApiProperty({
    description: 'Optional toggle to activate web search.',
    required: false,
  })
  @IsBoolean({
    message: '[web] params shall be a string if specified',
  })
  @ValidateIf((obj: CreateResponseDto) => !!obj.web)
  web?: boolean;

  @ApiProperty({
    description:
      'Optional name of the database where are saved related data specific to the topic. Can and shall be reused across multiple requests, and also between question and responses.',
    required: false,
  })
  @IsString({
    message: '[local_db] params shall be a string if specified',
  })
  @ValidateIf((obj: CreateResponseDto) => !!obj.local_db)
  local_db?: string;
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
