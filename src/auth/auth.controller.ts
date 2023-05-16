import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LocalAuthGuard } from '../guards/local.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Public } from '../decorators/public.decorator';
import { TObjectId } from '../types/user.type';
import { KeyVerificationDto } from './dto/key-verification.dto';
import { CheckTokenDto } from './dto/check-token.dto';
import { Roles } from '../decorators/roles.decorator';
import { AccountValidationDto } from './dto/account-validation.dto';
import { RoleGuard } from '../guards/role.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Public()
  @Post('signin')
  @UseGuards(LocalAuthGuard)
  signin(@CurrentUser() user: TObjectId) {
    return this.authService.signin(user.id);
  }

  @Public()
  @Post('keyverification')
  keyVerification(@Body() body: KeyVerificationDto) {
    return this.authService.keyVerification(body);
  }

  @Public()
  @Post('checktoken')
  checkToken(@Body() body: CheckTokenDto) {
    return this.authService.checkToken(body.token);
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @Post('accountvalidation')
  accountValidation(@Body() body: AccountValidationDto) {
    return this.authService.accountValidation(body);
  }

  @UseGuards(RoleGuard)
  @Get('whoami')
  whoAmI(@CurrentUser() user: TObjectId) {
    return this.authService.whoAmI(user.id);
  }
}
