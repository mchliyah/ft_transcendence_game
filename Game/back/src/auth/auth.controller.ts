import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UseZodGuard } from 'nestjs-zod';
import {
  AuthSignInDto,
  AuthSignUpDto,
  ForgetPassworddto,
  SetPasswordDto,
  TSetPasswordData,
  TSigninData,
  TSignupData,
  TforgetPasswordData,
} from 'src/dto';
import { AuthService } from './auth.service';
import _42AuthenticationGuard from '../guards/42-authentication.guard';
import { Response } from 'express';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

@ApiTags('Authentication non protected routes')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: AuthSignUpDto })
  @UseZodGuard('body', AuthSignUpDto)
  @Post('signup')
  signup(@Body() dto: TSignupData) {
    return this.authService.signup(dto);
  }

  @ApiQuery({ name: 'token', type: 'string' })
  @Get('confirm-email')
  confirm(@Query('token') token: string) {
    return this.authService.confirmRegister(token);
  }

  @ApiBody({ type: AuthSignInDto })
  @UseZodGuard('body', AuthSignInDto)
  @Post('signin')
  signin(@Body() dto: TSigninData) {
    return this.authService.signin(dto);
  }

  @UseGuards(_42AuthenticationGuard)
  @Get('42signin')
  signin42() {
    return;
  }

  @UseGuards(_42AuthenticationGuard)
  @Get('42/callback')
  async signin42Callback(@Req() request: { user: User }, @Res() res: Response) {
    const token = await this.authService.signin42(request.user);
    console.log(token);

    return res.redirect(`http://localhost:3000/signin42?token=${token}`);
  }

  @ApiBody({ type: ForgetPassworddto })
  @UseZodGuard('body', ForgetPassworddto)
  @Post('forget-password')
  async forgetPassword(@Body() dto: TforgetPasswordData) {
    return this.authService.forgetPassword(dto);
  }

  @ApiBody({ type: SetPasswordDto })
  @ApiQuery({ name: 'token', type: 'string' })
  @UseZodGuard('body', SetPasswordDto)
  @Post('change-password')
  async confirmChangePassword(
    @Body() dto: TSetPasswordData,
    @Query('token') token: string,
  ) {
    return this.authService.confirmChangePassword(token, dto);
  }
}
