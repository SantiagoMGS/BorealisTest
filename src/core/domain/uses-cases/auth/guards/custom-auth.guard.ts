import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CustomAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext) : Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const result = await super.canActivate(context) as boolean;
      console.log('✅ Autenticación exitosa:', result);
      return result;
    } catch (error) {
      console.error('🔴 Error en AuthGuard:', error);
      return false;
    }
  }
}
