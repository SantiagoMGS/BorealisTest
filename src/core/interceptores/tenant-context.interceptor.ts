import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import {
  RequestContextService,
  setRequestContextProvider,
} from '../services/request-context.service';

@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TenantContextInterceptor.name);

  constructor(private readonly contextService: RequestContextService) {
    // Establecer el proveedor de contexto para acceso global
    setRequestContextProvider(this.contextService);
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Solo procesar si hay un usuario autenticado
    if (!user) {
      return next.handle();
    }

    this.logger.debug(
      `Configurando contexto para usuario: ${user.id}, compañía: ${user.companyId || 'no establecida'}`,
    );

    // Ejecutar el handler dentro del contexto de la solicitud
    return from(
      this.contextService.run(
        {
          userId: user.id,
          companyId: user.companyId,
          roleId: user.roleId,
        },
        () => next.handle().toPromise(),
      ),
    );
  }
}
