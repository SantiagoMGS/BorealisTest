import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CustomAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(CustomAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const result = await super.canActivate(context) as boolean;
      this.logger.log('✅ Autenticación exitosa:', result);
      return result;
    } catch (error) {
      this.logger.error('🔴 Error en AuthGuard:', error);
      return false;
    }
  }
}