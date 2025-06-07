import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';

async function bootstrap(port = process.env.PORT ?? 3000) {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Quizz maker')
    .setDescription(
      'An AI-powered API for generating quiz questions and evaluating responses based on provided topics. \n\n' +
        '**Important Notes:**\n' +
        '- These endpoints utilize an AI model and may take some time to respond (typically 5-15 seconds).\n' +
        '- The responses from the model are not deterministic. It is recommended to save the generated content if you need to refer to it later.\n' +
        '- The API uses caching to improve performance for repeated requests.\n' +
        '- All endpoints return JSON responses and accept JSON request bodies.\n\n' +
        '**Authentication:**\n' +
        '- No authentication is currently required for development environments.\n' +
        '- Production deployments may require API keys (see documentation for details).',
    )
    .setVersion('1.0')
    .addTag(
      'questions',
      'Endpoints for generating quiz questions on specified topics',
    )
    .addTag('responses', 'Endpoints for evaluating user responses to questions')
    .addTag(
      'knowledge',
      'Endpoints for managing knowledge base content used for question generation',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
      'JWT-auth',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe());
  app.use(compression());

  await app.listen(port, () => {
    Logger.log('');
    Logger.log(`Server is         running http://0.0.0.0:${port}`);
    Logger.log(`OpenAPI is        running http://0.0.0.0:${port}/api`);
    Logger.log(`OpenAPI Spec is   running http://0.0.0.0:${port}/api-json`);
    Logger.log('');
    Logger.log(
      `Liveness at       running http://0.0.0.0:${port}/health/liveness`,
    );
    Logger.log(
      `Readiness at      running http://0.0.0.0:${port}/health/readiness`,
    );
    Logger.log(
      `Startup at        running http://0.0.0.0:${port}/health/startup`,
    );
  });
}

bootstrap();
