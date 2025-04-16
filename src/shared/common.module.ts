// src/common/common.module.ts
import { HttpExceptionFilter } from '@core/filters/http-exception.filter';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { ResponseService } from '@core/services/http-response.service';
import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  providers: [ResponseService, ResponseInterceptor, HttpExceptionFilter],
  exports: [ResponseService, ResponseInterceptor, HttpExceptionFilter],
})
export class CommonModule {}
