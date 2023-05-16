import {
  Injectable,
  ConflictException,
  NotFoundException,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { MailerService } from '../utils/mail.service';
import { generateKey } from '../utils/generate-key.util';
import { AccountValidationDto } from './dto/account-validation.dto';
import { SignupDto } from './dto/signup.dto';
import { KeyVerificationDto } from './dto/key-verification.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async signup(body: SignupDto) {
    const checkEmail = await this.userService.findUserByEmail(body.email);

    if (checkEmail) {
      if (checkEmail.isValid && checkEmail.isVerified) {
        throw new ConflictException('You Already have an account');
      } else {
        if (!checkEmail.isVerified) {
          const checkToken = await this.checkToken(checkEmail.key);

          if (checkToken.message !== 'jwt valid') {
            this.userService.deleteUserByEmail(checkEmail.email);
          }
        }
        if (!checkEmail.isValid) {
          throw new HttpException(
            'Your account needs an approval from us. We will return to you as soon as possible.',
            HttpStatus.FORBIDDEN,
          );
        }
      }
    }

    const key = await generateKey();

    const jwtKey = this.jwtService.sign({ key }, { expiresIn: '5m' });

    const html = `
                  <div style="display: flex; justify-content: center">
                    <div>
                      <strong>Hello ${body.name}</strong>
                        <p>Thanks for signing up</p>
                        <hr />
                        <p>We're happy you're here, Let's get your email address verified.</p>
                        <p>The passcode to verify your email is: <b>${key}</b></p>
                        <br />
                        <p>Enter this passcode on the account creation section page to verify your account.</p>
                        <b>This passcode is valid for 5 minutes.</b>
                    </div>
                  </div>
                `;

    this.mailerService.sendMail(
      body.email,
      `Verification by ${process.env.GMAIL_NAME}`,
      html,
    );

    this.userService.create(body, jwtKey);
    return { message: 'Check your email in order to verify your account.' };
  }

  async signin(id: string) {
    const checkUser = await this.userService.findUserById(id);

    if (!checkUser.isVerified) {
      throw new HttpException('Account is not verified', HttpStatus.FORBIDDEN);
    }

    if (!checkUser.isValid) {
      throw new HttpException(
        'Your account needs an approval from us. We will return to you as soon as possible.',
        HttpStatus.FORBIDDEN,
      );
    }

    const payload = { id: checkUser.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async keyVerification(body: KeyVerificationDto) {
    const { key, email } = body;

    const verified = await this.userService.findUserByEmail(email);

    if (!verified) throw new NotFoundException('Email is Wrong');

    if (verified.isVerified)
      throw new NotFoundException('Account is already Verified');

    const checkToken = await this.checkToken(verified.key);

    if (checkToken.message === 'jwt valid') {
      const decodedKey = this.jwtService.decode(verified.key);

      if (decodedKey['key'] === key) {
        this.userService.update(verified.id, { isVerified: true }, { key: 1 });
        return { message: 'Account is Verified' };
      } else {
        this.userService.deleteUserByEmail(email);
        throw new NotFoundException('Incorrect Key');
      }
    } else {
      this.userService.deleteUserByEmail(email);
      return checkToken;
    }
  }

  async checkToken(token: string) {
    try {
      const { exp } = await this.jwtService.verify(token);
      return {
        message: 'jwt valid',
        expiredAt: new Date(exp),
      };
    } catch (error) {
      return error;
    }
  }

  async accountValidation(body: AccountValidationDto) {
    const { userId } = body;

    const user = await this.userService.findUserById(userId.toString());

    if (!user) throw new NotFoundException('User Not found');

    if (user.isValid) throw new BadRequestException('User is already valid');

    await this.userService.update(user.id, { isValid: true });

    const html = `
    <div style="display: flex; justify-content: center">
      <div>
        <strong>Hello ${user.name}</strong>
          <p>Your account is valid now</p>
      </div>
    </div>
  `;

    this.mailerService.sendMail(
      user.email,
      `Validation by ${process.env.GMAIL_NAME}`,
      html,
    );

    return { message: 'Account is now valid' };
  }

  async whoAmI(id: string) {
    return this.userService.findUserById(id);
  }
}
