import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { ModelModule } from '../model/model.module';
import { DbModule } from '../db/db.module';

@Module({
  providers: [AiService],
  imports: [ModelModule, DbModule],
  exports: [AiService],
})
export class AiModule {}
