import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const customEmailValidator = z.string().refine(
  (value) => {
    // Use a regular expression or any custom logic to validate the email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isStandardEmail = emailRegex.test(value);

    // You can also add custom logic to check for specific domains, like "@student.1337.ma"
    const isCustomEmail = value.endsWith('@student.1337.ma');

    return isStandardEmail || isCustomEmail;
  },
  {
    message: 'Invalid email address format',
  },
);

export const AuthsignUpSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: 'Required' })
    .describe('Username'),
  email: customEmailValidator.describe('Email'),
  password: z
    .password()
    .min(8, { message: 'Required' })
    .describe('This is a password'),
});

export const AuthSignInSchema = z.object({
  password: z.password().min(8, { message: 'Required' }).describe('Password'),
  identifier: z
    .string()
    .trim()
    .min(1, { message: 'Required' })
    .describe('Username or email'),
});

export const SetPasswordSchema = z
  .object({
    password: z.password().min(8, { message: 'Required' }).describe('Password'),
    confirmPassword: z
      .password()
      .min(8, { message: 'Required' })
      .describe('Matching password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirm'],
  });
export const Add42CredentialsSchema = z
  .object({
    password: z.password().min(8, { message: 'Required' }).describe('Password'),
    confirmPassword: z
      .password()
      .min(8, { message: 'Required' })
      .describe('Matching password'),
    username: z
      .string()
      .trim()
      .min(1, { message: 'Required' })
      .describe('Username'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirm'],
  });

export const TwofaCodeSchema = z.object({
  code: z.string().trim().min(1, { message: 'Required' }).describe('2fa Code'),
});

export const ForgetPasswordSchema = z.object({
  email: z.string().trim().min(1, { message: 'Required' }).describe('Email'),
});

export class AuthSignUpDto extends createZodDto(AuthsignUpSchema) {}
export class AuthSignInDto extends createZodDto(AuthSignInSchema) {}
export class SetPasswordDto extends createZodDto(SetPasswordSchema) {}
export class Add42CredentialsDto extends createZodDto(Add42CredentialsSchema) {}
export class TwofaCodeDto extends createZodDto(TwofaCodeSchema) {}
export class ForgetPassworddto extends createZodDto(ForgetPasswordSchema) {}

export type TSigninData = z.infer<typeof AuthSignInSchema>;
export type TSignupData = z.infer<typeof AuthsignUpSchema>;
export type TSetPasswordData = z.infer<typeof SetPasswordSchema>;
export type TtwofaCodeData = z.infer<typeof TwofaCodeSchema>;
export type TforgetPasswordData = z.infer<typeof ForgetPasswordSchema>;
export type TAdd42CredentialsData = z.infer<typeof Add42CredentialsSchema>;
