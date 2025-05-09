import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error on unknown properties
      transform: true,        // Automatically transform types
    }),
  );
   // Swagger setup
   const config = new DocumentBuilder()
   .setTitle('Task Management API')
   .setDescription('API for managing tasks')
   .setVersion('1.0')
   .build();
 const document = SwaggerModule.createDocument(app, config);
 SwaggerModule.setup('greeka', app, document); 

  
  await app.listen(3000);
}
bootstrap();
