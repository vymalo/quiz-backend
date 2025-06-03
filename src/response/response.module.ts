import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ResponseController } from './response.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  providers: [ResponseService],
  controllers: [ResponseController],
  imports: [AiModule],
})
export class ResponseModule {}
