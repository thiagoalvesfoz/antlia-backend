import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/account-manager/service/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/account-manager/dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);

    if (user && bcrypt.compareSync(pass, user.password)) {
      return user;
    }

    return null;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: UserDto.build(user),
    };
  }
}
