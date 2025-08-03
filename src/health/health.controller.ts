import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { UrlBuilder } from '@innova2/url-builder';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly configService: ConfigService,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  @ApiExcludeEndpoint(true)
  @Get('liveness')
  @HealthCheck()
  liveness() {
    return this.health.check([() => this.checkHeap()]);
  }

  @ApiExcludeEndpoint(true)
  @Get('readiness')
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.checkHeap(),
      () =>
        this.getOpenAiCompatibleHealthCheck(
          'question-open-ai',
          'OPENAI_QUESTION_BASE_URL',
          'OPENAI_QUESTION_API_KEY',
        ),
      () =>
        this.getOpenAiCompatibleHealthCheck(
          'response-open-ai',
          'OPENAI_RESPONSE_BASE_URL',
          'OPENAI_RESPONSE_API_KEY',
        ),
      () =>
        this.getOpenAiCompatibleHealthCheck(
          'summarizer-open-ai',
          'OPENAI_SUMMARIZER_BASE_URL',
          'OPENAI_SUMMARIZER_API_KEY',
        ),
      () =>
        this.getOpenAiCompatibleHealthCheck(
          'embedding-open-ai',
          'OPENAI_EMBEDDING_BASE_URL',
          'OPENAI_EMBEDDING_API_KEY',
        ),
    ]);
  }

  @ApiExcludeEndpoint(true)
  @Get('startup')
  @HealthCheck()
  startup() {
    return this.health.check([() => this.checkHeap()]);
  }

  private checkHeap() {
    return this.memory.checkHeap('memory-heap', 800 * 1024 * 1024);
  }

  private getOpenAiCompatibleHealthCheck(
    key: string,
    urlKey: string,
    apiKeyKey: string,
  ) {
    const apiKey: string | undefined = this.configService.get(apiKeyKey);
    const headers = apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined;
    const urlBuilder = UrlBuilder.createFromUrl(
      this.configService.getOrThrow(urlKey),
    );
    const url = urlBuilder.addPath('/models');
    const finalUrl = url.toString();

    return this.http.pingCheck(key, finalUrl, { headers });
  }
}
