import { Module } from '@nestjs/common';
import { UsersController } from './controller/user.controller';
import { UsersService } from './service/users.service';
import { UserRepositoryProvider } from './repository';
import { AccountController } from './controller/account.controller';

@Module({
  controllers: [UsersController, AccountController],
  providers: [UsersService, UserRepositoryProvider],
  exports: [UsersService],
})
export class AccountManagerModule {}
