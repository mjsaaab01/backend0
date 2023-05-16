import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class KeyVerificationDto {
  @IsEmail()
  // @Matches(/^[A-Za-z0-9._%+-]+@ndu.edu\.lb$/, {
  //   message: 'Please use your NDU email example@ndu.edu.lb',
  // })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6, {
    message: 'key must be equal to 6 characters',
  })
  readonly key: string;
}
