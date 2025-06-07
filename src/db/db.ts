import { Metadata } from 'chromadb';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class ListKnowledgeQuery {
  @ApiProperty({
    description:
      'Regular expression pattern to match against document content in the knowledge base. ' +
      'This allows for flexible searching of text patterns within stored documents.',
    required: true,
    example: 'async|await',
  })
  @IsNotEmpty({
    message: '[$regex] params shall be a string',
  })
  $regex: string;
}

export class SaveKnowledge {
  @ApiProperty({
    description:
      'A unique identifier for the knowledge collection or category. ' +
      'This slug is used to group related documents together and can be referenced ' +
      'when generating questions or evaluating responses. ' +
      'Examples: "javascript-es6", "roman-history", "machine-learning-basics".',
    required: true,
    example: 'javascript-promises',
  })
  @IsNotEmpty({
    message: '[knowledge_name_slug] params shall be a string',
  })
  knowledge_name_slug: string;

  @ApiProperty({
    description:
      'The actual content of the knowledge document to be stored. ' +
      'This can be any text-based information that will be used as a reference ' +
      'for generating questions or evaluating responses. ' +
      'The content should be comprehensive enough to serve as a reliable knowledge source.',
    required: true,
    example:
      'Promises in JavaScript represent the eventual completion or failure of an asynchronous operation and its resulting value.',
  })
  @IsString({
    message: '[document] documents shall be a string',
  })
  document: string;

  @ApiProperty({
    description:
      'A unique identifier for this specific document within the knowledge collection. ' +
      'This ID can be used to update or retrieve this specific document later. ' +
      'It should be descriptive of the document content for easier reference.',
    required: true,
    example: 'js-promises-intro',
  })
  @IsString({
    message: '[id] item shall be a string',
  })
  id: string;

  @ApiProperty({
    description:
      'Optional metadata associated with this knowledge document. ' +
      'This can include information such as source, author, creation date, ' +
      'version, or any other relevant attributes that help categorize or ' +
      'provide context for the document.',
    additionalProperties: {
      type: 'string',
    },
    required: false,
    example: {
      author: 'John Doe',
      source: 'JavaScript Documentation',
      date: '2023-01-15',
    },
  })
  metadata?: Metadata;
}

@ApiExtraModels(ListKnowledgeQuery)
export class ListKnowledge {
  @ApiProperty({
    description:
      'The identifier of the knowledge collection to search within. ' +
      'This limits the search to documents within a specific category or collection. ' +
      'The knowledge collection must exist in the system before it can be searched.',
    required: true,
    example: 'javascript-promises',
  })
  @IsNotEmpty({
    message: '[knowledge_name_slug] params shall be a string',
  })
  knowledge_name_slug: string;

  @ApiProperty({
    description:
      'The search query parameters to filter documents in the knowledge base. ' +
      'This object contains the regex pattern to match against document content.',
    required: true,
    allOf: [
      {
        $ref: getSchemaPath(ListKnowledgeQuery),
      },
    ],
  })
  @IsObject({
    message: '[query] params shall be an object',
  })
  query: ListKnowledgeQuery;
}

export class SaveKnowledgeResponse {
  @ApiProperty({
    description:
      'Status of the save operation. A value of "ok" indicates that the ' +
      'knowledge document was successfully saved to the database.',
    required: true,
    type: 'string',
    enum: ['ok'],
    enumName: 'SaveKnowledgeResponseStatus',
    example: 'ok',
  })
  @IsString({
    message: "[status] item shall be 'string'",
  })
  public readonly status = 'ok' as const;
}

export class ListKnowledgeResponse {
  @ApiProperty({
    description:
      'The unique identifier of the document within the knowledge collection. ' +
      'This ID can be used to reference this specific document in other operations.',
    required: true,
    example: 'js-promises-intro',
  })
  @IsString({
    message: "[id] item shall be 'string'",
  })
  id: string;

  @ApiProperty({
    description:
      'The content of the knowledge document that matched the search query. ' +
      'This contains the actual text information stored in the knowledge base. ' +
      'May be null or undefined if the document exists but has no content.',
    required: true,
    example:
      'Promises in JavaScript represent the eventual completion or failure of an asynchronous operation and its resulting value.',
  })
  @IsString({
    message: '[document] params shall be a string',
    each: true,
  })
  document: string | null | undefined;

  @ApiProperty({
    description:
      'Metadata associated with the knowledge document. ' +
      'This can include information such as source, author, creation date, ' +
      'or any other attributes that were stored with the document.',
    additionalProperties: {
      type: 'string',
    },
    required: false,
    example: {
      author: 'John Doe',
      source: 'JavaScript Documentation',
      date: '2023-01-15',
    },
  })
  metadata?: Record<string, string>;
}
