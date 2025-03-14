import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './infrastructure/ilters/http-exception.filter';
import { ResponseInterceptor } from './infrastructure/interceptores/response.interceptor';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('BorealisMain');
  try {
    const app = await NestFactory.create(AppModule);

    // **Configuraciones globales**
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true, // 🔹 Convierte automáticamente los datos de entrada al tipo esperado (útil para DTOs)
      }),
    );

    // **Habilitar CORS**
    app.enableCors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // **Prefijo global para la API**
    app.setGlobalPrefix('api');
    // **Configuración de Swagger**
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Borealis API')
      .setDescription('API documentation for the Borealis application')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
        },
        'JWT',
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);

    // **Iniciar la aplicación**
    const port = process.env.PORT || 3000;
    await app.listen(port);

    logger.log(`🚀 Aplicación iniciada en http://localhost:${port}/api`);
    logger.log(`📚 Documentación Swagger disponible en http://localhost:${port}/api/docs`);

  } catch (error) {
    logger.error('❌ Error al iniciar la aplicación', error);
    process.exit(1);
  }
}

bootstrap();
