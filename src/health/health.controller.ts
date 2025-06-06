import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly configService: ConfigService,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  @Get('liveness')
  @HealthCheck()
  liveness() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }

  @Get('readiness')
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () =>
        this.http.pingCheck(
          'question-open-ai',
          this.configService.get('OPENAI_QUESTION_BASE_URL') + '/models',
        ),
      () =>
        this.http.pingCheck(
          'response-open-ai',
          this.configService.get('OPENAI_RESPONSE_BASE_URL') + '/models',
        ),
      () =>
        this.http.pingCheck(
          'summarizer-open-ai',
          this.configService.get('OPENAI_SUMMARIZER_BASE_URL') + '/models',
        ),
      () =>
        this.http.pingCheck(
          'embedding-open-ai',
          this.configService.get('OPENAI_EMBEDDING_BASE_URL') + '/models',
        ),
    ]);
  }

  @Get('startup')
  @HealthCheck()
  startup() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }
}
