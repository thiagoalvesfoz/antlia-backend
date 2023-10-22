import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AccountManagerModule } from './account-manager/account-manager.module';
import { AuthModule } from './auth/auth.module';
import { AntliaModule } from './antlia/antlia.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerMiddleware } from './prisma/logger.middleware';

@Module({
  imports: [PrismaModule, AccountManagerModule, AntliaModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
