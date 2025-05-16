import { Module } from '@nestjs/common';
import { CurrentTenantAdapter } from '@infrastructure/adapters/current-tenant.adapter';
import { CoreModule } from '../core.module';

// Token para inyección de dependencias
export const CURRENT_TENANT_PORT = 'CURRENT_TENANT_PORT';

@Module({
  imports: [CoreModule],
  providers: [
    {
      provide: CURRENT_TENANT_PORT,
      useClass: CurrentTenantAdapter,
    },
  ],
  exports: [CURRENT_TENANT_PORT],
})
export class TenantModule {}
