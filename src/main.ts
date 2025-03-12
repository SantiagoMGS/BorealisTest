import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './infrastructure/ilters/http-exception.filter';
import { ResponseInterceptor } from './infrastructure/interceptores/response.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {

  try {
    const app = await NestFactory.create(AppModule);

    // **Configuraciones globales**
    app.get(ConfigService);

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

    // **Iniciar la aplicación**
    const port = process.env.PORT || 3000;
    await app.listen(port);

    Logger.log(`🚀 Aplicación iniciada en http://localhost:${port}/api`);
  } catch (error) {
    Logger.error('❌ Error al iniciar la aplicación', error);
    process.exit(1); 
  }
}

bootstrap();
