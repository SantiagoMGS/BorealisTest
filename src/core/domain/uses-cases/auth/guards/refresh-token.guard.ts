import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') implements CanActivate {
  private readonly logger = new Logger(RefreshTokenGuard.name);

  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const result = await super.canActivate(context) as boolean;
      this.logger.log(`🔄 Refresh Token Validation: ${result ? 'Successful' : 'Failed'}`);
      return result;
    } catch (error) {
      this.logger.error('🚫 Refresh Token Validation Error:', error);
      return false;
    }
  }
}