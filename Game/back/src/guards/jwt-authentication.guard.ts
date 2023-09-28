import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Injectable()
export default class JwtAuthenticationGuard extends AuthGuard('jwt') {}
