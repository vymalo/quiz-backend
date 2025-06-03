import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  providers: [QuestionService],
  controllers: [QuestionController],
  imports: [AiModule],
})
export class QuestionModule {}
