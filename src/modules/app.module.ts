import { MiddlewareConsumer, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../common/prisma/prisma.module';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { BillingModule } from './billing/billing.module';
import { TasksModule } from './billing/tasks/tasks.module';
import { LoggerMiddleware } from '../common/prisma/logger.middleware';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailConfig } from '../config/mail.config';
import { MailModule } from './mail/mail.module';
import { InventoryModule } from './inventory/inventory.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    PrismaModule,
    AccountModule,
    InventoryModule,
    OrdersModule,
    AuthModule,
    BillingModule,
    MailModule,
    TasksModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    MailerModule.forRoot(MailConfig)
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
