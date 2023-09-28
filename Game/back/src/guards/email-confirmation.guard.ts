import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiUnauthorizedResponse({
  description: 'Unauthorized - Confirm your email first',
})
@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!request.user?.isEmailConfirmed) {
      console.log('email not confirmed');
      throw new UnauthorizedException('Confirm your email first');
    }

    return true;
  }
}
