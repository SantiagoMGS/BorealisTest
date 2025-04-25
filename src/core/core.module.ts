import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './interceptores/response.interceptor';
import { TenantContextInterceptor } from './interceptores/tenant-context.interceptor';
import { RequestContextService } from './services/request-context.service';

@Module({
  providers: [
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
