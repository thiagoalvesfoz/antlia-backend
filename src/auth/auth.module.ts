import { Module } from '@nestjs/common';
import { AccountManagerModule } from 'src/account-manager/account-manager.module';
import { AuthController } from './controller/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthService } from './service/auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LoginStrategy } from './strategy/login.strategy';
import { RoleGuard } from './guard/role.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    AccountManagerModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LoginStrategy,
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
  exports: [],
})
export class AuthModule {}
