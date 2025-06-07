import { Inject, Injectable } from '@nestjs/common';
import { ChromaClient, Collection } from 'chromadb';
import { embedMany } from 'ai';
import { ConfigService } from '@nestjs/config';
import { TOKEN_DB, TOKEN_EMBEDDING_MODEL } from '../constants';
import { EmbeddingModelV1 } from '@ai-sdk/provider';
import { ListKnowledge, SaveKnowledge } from './db';

@Injectable()
export class DbService {
  constructor(
    @Inject(TOKEN_DB)
    private readonly client: ChromaClient,
    @Inject(TOKEN_EMBEDDING_MODEL)
    private readonly model: EmbeddingModelV1<string>,
    private readonly config: ConfigService,
  ) {}

  public async getOrCreateCollection(
    collectionName: string,
  ): Promise<Collection> {
    return await this.client.getOrCreateCollection({
      name: `${this.config.get('CHROMA_COLLECTION_PREFIX')}${collectionName}`,
      embeddingFunction: {
        generate: async (texts: string[]): Promise<number[][]> => {
          const { embeddings } = await embedMany({
            model: this.model,
            values: texts,
          });

          return embeddings;
        },
      },
    });
  }

  public async saveKnowledge(dto: SaveKnowledge) {
    const col = await this.getOrCreateCollection(dto.knowledge_name_slug);
    await col.upsert({
      documents: [dto.document],
      ids: [dto.id],
      metadatas: dto.metadata ? [dto.metadata] : undefined,
    });
  }

  public async listKnowledge(dto: ListKnowledge) {
    const col = await this.getOrCreateCollection(dto.knowledge_name_slug);
    const result = await col.get({
      whereDocument: dto.query,
    });

    return result.rows();
  }
}
