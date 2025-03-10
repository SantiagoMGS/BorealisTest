import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './infrastructure/ilters/http-exception.filter';
import { ResponseInterceptor } from './infrastructure/interceptores/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  Logger.log('🚀 Aplicación iniciada correctamente');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
