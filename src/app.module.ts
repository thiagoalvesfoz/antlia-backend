import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AccountManagerModule } from './account-manager/account-manager.module';
import { AuthModule } from './auth/auth.module';
import { AntliaModule } from './antlia/antlia.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerMiddleware } from './prisma/logger.middleware';
import { BillingModule } from './billing/billing.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailModule } from './mail/mail.module';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    PrismaModule,
    AccountManagerModule,
    AntliaModule,
    AuthModule,
    BillingModule,
    MailModule,
    TasksModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot()
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
