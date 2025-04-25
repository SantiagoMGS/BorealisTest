import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ResponseInterceptor } from './interceptores/response.interceptor';
import { TenantContextInterceptor } from './interceptores/tenant-context.interceptor';
import { RequestContextService } from './services/request-context.service';

@Module({
  providers: [
    // Filtros
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },

    // Interceptores
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantContextInterceptor,
    },

    // Servicios
    RequestContextService,
  ],
  exports: [RequestContextService],
})
export class CoreModule {}
