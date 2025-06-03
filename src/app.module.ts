import { Module } from '@nestjs/common';
import { QuestionModule } from './question/question.module';
import { ResponseModule } from './response/response.module';
import { AiModule } from './ai/ai.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    QuestionModule,
    ResponseModule,
    AiModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
