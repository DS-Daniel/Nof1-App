import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// Create app and start server.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: [process.env.FRONTEND_URL] });

  // OpenAPI configuration
  const config = new DocumentBuilder()
    .setTitle('Nof1-API')
    .setDescription('The N-of-1 API doc')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
