import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Global Validation & Transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // remove unknown fields
      forbidNonWhitelisted: true,
      transform: true,           // DTO → typed object
    }),
  );

  // ✅ Global Response Format
  // app.useGlobalInterceptors(new ResponseInterceptor());
  // main.ts
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // ✅ Global Error Handling
  app.useGlobalFilters(new HttpExceptionFilter());

  // ✅ Swagger Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('AI Gatekeeper API')
    .setDescription('Real-time AI-powered security middleware')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}

bootstrap();
