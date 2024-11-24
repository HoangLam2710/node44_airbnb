import { Exclude, Expose } from 'class-transformer';

export class ResponseUserDto {
  @Expose()
  name: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  phone: string;

  @Expose()
  dob: Date;

  @Expose()
  gender: string;

  @Expose()
  role: number;

  @Exclude()
  refresh_token: string;
}
