import { Module } from '@nestjs/common';
import { UsersController } from './controller/user.controller';
import { UsersService } from './service/users.service';
import { UserRepositoryProvider } from './repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepositoryProvider],
})
export class AccountManagerModule {}
