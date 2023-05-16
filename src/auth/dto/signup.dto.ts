import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

import { ERole } from '../../types/user.type';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly name: string;

  @IsEmail()
  // @Matches(/^[A-Za-z0-9._%+-]+@ndu.edu\.lb$/, {
  //   message: 'Please use your NDU email example@ndu.edu.lb',
  // })
  readonly email: string;

  @MinLength(8)
  @IsString()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'Password should be at least 8 characters contain at least one uppercase character, one lowercase character, one number and one special character',
  })
  readonly password: string;

  @IsEnum(ERole)
  readonly role: ERole;
}
