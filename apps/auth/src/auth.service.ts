import { Injectable } from '@nestjs/common';
import { UserDocument } from './models/user.schema';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  login(user: UserDocument, res: Response) {
    const tokenPayload = {
      userId: user._id.toHexString(),
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRES'),
    );

    const token = this.jwtService.sign(tokenPayload);
    res.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }
}
