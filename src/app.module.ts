import { Module } from '@nestjs/common';
import { AccountManagerModule } from './account-manager/account-manager.module';
import { AuthModule } from './auth/auth.module';
import { AntliaModule } from './antlia/antlia.module';

@Module({
  imports: [AccountManagerModule, AntliaModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
