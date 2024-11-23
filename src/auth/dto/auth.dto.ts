import { Exclude, Expose } from 'class-transformer';

export class ResponseAuthDto {
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
  role: string;

  @Exclude()
  refresh_token: string;
}
