import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiUnauthorizedResponse({
  description: 'Unauthorized - Verify your 2FA first',
})
@Injectable()
export class TwoFaVerificationGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request.user?.is2FaEnabled && !request.user?.is2FaVerified) {
      throw new UnauthorizedException('verify your 2fa first');
    }

    return true;
  }
}
