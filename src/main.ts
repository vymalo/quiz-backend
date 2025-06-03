import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap(port = process.env.PORT ?? 3000) {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Quizz maker')
    .setDescription(
      'Produce questions from simple prompts. \n\n' +
        '**Important Notes:**\n' +
        '- These endpoints utilize an AI model and may take some time to respond.\n' +
        '- The responses from the model are not deterministic. It is recommended to save the generated content if you need to refer to it later.',
    )
    .setVersion('1.0')
    .addTag('questions')
    .addTag('responses')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port, () => {
    Logger.log(`Server is         running http://0.0.0.0:${port}`);
    Logger.log(`OpenAPI is        running http://0.0.0.0:${port}/api`);
    Logger.log(`OpenAPI Spec is   running http://0.0.0.0:${port}/api-json`);
  });
}
bootstrap();
