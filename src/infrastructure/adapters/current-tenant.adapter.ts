import { Injectable } from '@nestjs/common';
import { ICurrentTenantPort } from '@domain/ports/common/current-tenant.port';
import { RequestContextService } from '@core/services/request-context.service';

/**
 * Adaptador que implementa el puerto ICurrentTenantPort utilizando
 * el servicio RequestContextService para obtener la información del tenant actual
 */
@Injectable()
export class CurrentTenantAdapter implements ICurrentTenantPort {
  constructor(private readonly contextService: RequestContextService) {}

  /**
   * @inheritdoc
   */
  getCompanyId(): string | undefined {
    return this.contextService.getCompanyId();
  }

  /**
   * @inheritdoc
   */
  getUserId(): string | undefined {
    return this.contextService.getUserId();
  }

  /**
   * @inheritdoc
   */
  getRoleId(): string | undefined {
    return this.contextService.getRoleId();
  }
}
