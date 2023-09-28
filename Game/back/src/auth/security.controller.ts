import {
  Body,
  Controller,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SecurityService } from './security.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { EmailConfirmationGuard } from 'src/guards/email-confirmation.guard';
import JwtAuthenticationGuard from 'src/guards/jwt-authentication.guard';
import { User } from '@prisma/client';
import {
  Add42CredentialsDto,
  TAdd42CredentialsData,
  TtwofaCodeData,
  TwofaCodeDto,
} from 'src/dto';
import { UseZodGuard } from 'nestjs-zod';
import { TwoFaVerificationGuard } from 'src/guards/two-fa-verification.guard';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Authentication protected routes')
@ApiBearerAuth()
@UseGuards(EmailConfirmationGuard)
@UseGuards(JwtAuthenticationGuard)
@Controller('auth')
export class SecurityController {
  constructor(private securityService: SecurityService) {}
  @Get('2fa/generate')
  @Header('Content-Type', 'image/png')
  async generate2Fa(@Req() request: { user: User }, @Res() res: Response) {
    const code = await this.securityService.generate2Fa(request.user, res);

    return code;
  }

  @ApiBody({ type: TwofaCodeDto })
  @UseZodGuard('body', TwofaCodeDto)
  @Post('2fa/enable')
  async enable2Fa(@Req() request: { user: User }, @Body() dto: TtwofaCodeData) {
    return this.securityService.enable2Fa(dto.code, request.user);
  }

  @ApiBody({ type: TwofaCodeDto })
  @UseZodGuard('body', TwofaCodeDto)
  @Post('2fa/verify')
  async verify2Fa(@Req() request: { user: User }, @Body() dto: TtwofaCodeData) {
    await this.securityService.verify2Fa(dto.code, request.user);
  }

  @UseGuards(TwoFaVerificationGuard)
  @Get('2fa/disable')
  async disable2Fa(@Req() request: { user: User }) {
    await this.securityService.disable2Fa(request.user);
  }
  @Get('resend-email')
  resend(@Req() request: { user: User }) {
    return this.securityService.resendEmail(request.user);
  }
  @ApiBody({ type: Add42CredentialsDto })
  @UseZodGuard('body', Add42CredentialsDto)
  @UseGuards(TwoFaVerificationGuard)
  @Post('set-new-username-password')
  setNewPassword(
    @Req() request: { user: User },
    @Body() dto: TAdd42CredentialsData,
  ) {
    return this.securityService.setNewPasswordUsername(dto, request.user);
  }

//   @ApiBody({ type: File })
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(TwoFaVerificationGuard)
  @Post('upload-avatar')
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: { user: User },
  ) {
    if (!file || !file.originalname) {
      throw new HttpException(
        'Please provide a file named "file" in the request.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.securityService.uploadAvatar(file, request.user);
  }

  @UseGuards(TwoFaVerificationGuard)
  @Get('me')
  me(@Req() request: { user: User }) {
    return request.user;
  }
}
