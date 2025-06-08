import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export enum CreateResponseDtoType {
  good = 'good',
  bad = 'bad',
}

export class CreateResponseDto {
  @ApiProperty({
    description:
      'The topic of the question for which the response is being submitted. ' +
      'This provides context for the AI to evaluate the response appropriately. ' +
      'The topic should match or be closely related to the topic used when generating the question.',
    required: true,
    example: 'JavaScript Promises',
  })
  @IsNotEmpty({
    message: '[topic] params shall be a string',
  })
  topic: string;

  @ApiProperty({
    description:
      'The specific question text to which the response is being submitted. ' +
      'This should be the exact question text that was presented to the user. ' +
      'The AI will evaluate the response in relation to this question.',
    required: true,
    example: 'Explain the difference between Promise.all() and Promise.race()',
  })
  @IsNotEmpty({
    message: '[question] params shall be a string',
  })
  question: string;

  @ApiProperty({
    description: '',
    required: true,
    example: 'good',
    enum: CreateResponseDtoType,
    enumName: 'CreateResponseDtoType',
  })
  @IsEnum(CreateResponseDtoType, {
    message: '[response_type] params shall be either "good" or "bad"',
  })
  response_type: CreateResponseDtoType;

  @ApiProperty({
    description:
      'Optional complementary information related to the question or topic. ' +
      'This can provide additional context for the AI to consider when evaluating the response, ' +
      'such as specific aspects to focus on or additional background information.',
    required: false,
    example: 'Include error handling considerations',
  })
  @IsString({
    message: '[complement] params shall be a string if specified',
  })
  @ValidateIf((obj: CreateResponseDto) => !!obj.complement)
  complement?: string;

  @ApiProperty({
    description:
      'Optional additional instructions for evaluating the response. ' +
      'This can include specific criteria to consider, aspects to emphasize or de-emphasize, ' +
      'or particular standards to apply during evaluation.',
    required: false,
    example: 'Focus on technical accuracy rather than writing style',
  })
  @IsString({
    message: '[extra_prompt] params shall be a string if specified',
  })
  @ValidateIf((obj: CreateResponseDto) => !!obj.extra_prompt)
  extra_prompt?: string;

  @ApiProperty({
    description:
      'Optional reference to a specific knowledge base to use when evaluating the response. ' +
      "This allows the evaluation to be based on specific stored knowledge rather than the AI's general knowledge. " +
      'The knowledge base must exist in the system before it can be referenced.',
    required: false,
    example: 'javascript-es6-guide',
  })
  @IsString({
    message: '[knowledge_name_slug] params shall be a string if specified',
  })
  @ValidateIf((obj: CreateResponseDto) => !!obj.knowledge_name_slug)
  knowledge_name_slug?: string;
}

export class ResponseDto {
  @ApiProperty({
    description:
      'The text of an evaluation point from the response analysis. ' +
      'This represents either a correct element (when g=true) or an incorrect/missing element (when g=false) ' +
      "identified in the user's response.",
    required: true,
    example:
      'Correctly identified that Promise.race() returns as soon as any promise settles',
  })
  public readonly r: string;

  @ApiProperty({
    description:
      'Indicates whether this evaluation point is considered good/correct (true) or bad/incorrect (false). ' +
      'Good points represent accurate and relevant information in the response, ' +
      'while bad points represent inaccuracies, misconceptions, or missing critical information.',
    required: true,
    example: true,
  })
  public readonly g: boolean;

  constructor(response: string, isGood: boolean) {
    this.r = response;
    this.g = isGood;
  }
}

export class ResponsesDto {
  @ApiProperty({
    description:
      'A list of response evaluation points. Each point represents either a correct element ' +
      "or an incorrect/missing element identified in the user's response. " +
      'This combined list provides comprehensive feedback on the strengths and weaknesses of the response.',
    required: true,
    type: [ResponseDto],
  })
  public readonly responses: ResponseDto[];

  @ApiProperty({
    description:
      'The total number of evaluation points (both good and bad). ' +
      'This represents the total number of distinct elements that were assessed in the response.',
    required: true,
    type: Number,
    example: 5,
  })
  public readonly count: number;

  @ApiProperty({
    description:
      'The original question text for which the response was submitted and evaluated. ' +
      'This is included for reference and context.',
    required: true,
    example: 'Explain the difference between Promise.all() and Promise.race()',
  })
  public readonly question: string;

  constructor(
    question: string,
    responses: string[],
    response_type: CreateResponseDtoType,
  ) {
    this.responses = responses.map(
      (i) => new ResponseDto(i, response_type === CreateResponseDtoType.good),
    );
    this.count = responses.length;
    this.question = question;
  }
}
