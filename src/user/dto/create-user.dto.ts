import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

import { ERole } from '../../types/user.type';

export class CreateUserDto {
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
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'password too weak',
    }
  )
  readonly password: string;

  @IsEnum(ERole)
  readonly role: ERole;
}
