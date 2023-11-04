import { Module } from '@nestjs/common';
import { UsersController } from './http/user.controller';
import { UsersService } from './domain/users.service';
import { AccountController } from './http/account.controller';
import { UserRepositoryProvider } from './adapters';


@Module({
  controllers: [UsersController, AccountController],
  providers: [UsersService, UserRepositoryProvider],
  exports: [UsersService],
})
export class AccountModule {}
