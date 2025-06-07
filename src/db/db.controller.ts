import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CacheKey } from '@nestjs/cache-manager';
import {
  ListKnowledge,
  ListKnowledgeResponse,
  SaveKnowledge,
  SaveKnowledgeResponse,
} from './db';
import { DbService } from './db.service';
import { raw } from 'express';

@ApiTags('knowledge')
@Controller('knowledge')
export class DbController {
  constructor(private readonly service: DbService) {}

  @ApiOperation({
    description:
      'Saves a document to the knowledge base with the specified identifier. ' +
      'This endpoint allows storing text-based knowledge that can later be used for generating ' +
      'or evaluating questions. The knowledge is stored with metadata for better organization and retrieval. ' +
      'This is useful for creating domain-specific question sets based on custom content.',
    summary: 'Save document to knowledge base',
    operationId: 'save_knowledge',
  })
  @ApiBody({
    description:
      'The knowledge document to save, along with its identifier and metadata.',
    type: SaveKnowledge,
    examples: {
      basic: {
        summary: 'Basic knowledge document',
        value: {
          knowledge_name_slug: 'javascript-promises',
          document:
            'Promises in JavaScript represent the eventual completion or failure of an asynchronous operation and its resulting value.',
          id: 'js-promises-intro',
        },
      },
      withMetadata: {
        summary: 'With metadata',
        value: {
          knowledge_name_slug: 'javascript-promises',
          document:
            'Promises in JavaScript represent the eventual completion or failure of an asynchronous operation and its resulting value.',
          id: 'js-promises-intro',
          metadata: {
            author: 'John Doe',
            source: 'JavaScript Documentation',
            date: '2023-01-15',
          },
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Successfully saved the knowledge document to the database.',
    type: SaveKnowledgeResponse,
  })
  @Post('save_knowledge')
  @HttpCode(200)
  @CacheKey('save_knowledge')
  public async saveKnowledge(@Body() dto: SaveKnowledge) {
    await this.service.saveKnowledge(dto);
    return new SaveKnowledgeResponse();
  }

  @ApiOperation({
    description:
      'Retrieves documents from the knowledge base that match the specified query. ' +
      'This endpoint allows searching through stored knowledge using regular expressions. ' +
      'Results include the document content and associated metadata. ' +
      'This is useful for retrieving specific information from the knowledge base for ' +
      'review, verification, or to understand what content is available for question generation.',
    summary: 'Search knowledge base documents',
    operationId: 'list_knowledge',
  })
  @ApiBody({
    description: 'The knowledge base identifier and search query parameters.',
    type: ListKnowledge,
    examples: {
      basic: {
        summary: 'Basic knowledge search',
        value: {
          knowledge_name_slug: 'javascript-promises',
          query: {
            $regex: 'async',
          },
        },
      },
    },
  })
  @ApiOkResponse({
    description:
      'Returns matching documents from the knowledge base along with their metadata.',
    type: ListKnowledgeResponse,
  })
  @Post('list_knowledge')
  @HttpCode(200)
  @CacheKey('list_knowledge')
  public listKnowledge(@Body() dto: ListKnowledge) {
    return this.service.listKnowledge(dto);
  }
}
