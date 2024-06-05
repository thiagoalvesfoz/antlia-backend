import { Module } from '@nestjs/common';
import { UsersService } from '@account/application/users.service';
import {
  AccountController,
  UsersController,
} from '@account/infrastructure/adapters/in';
import { UserRepositoryProvider } from '@account/infrastructure/adapters/out';

@Module({
  controllers: [UsersController, AccountController],
  providers: [UsersService, UserRepositoryProvider],
  exports: [UsersService],
})
export class AccountModule {}
