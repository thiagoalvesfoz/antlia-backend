import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

const setUp: any = {
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    'info',
    'warn',
    'error',
  ],
};

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);
  private readonly version = Prisma.prismaVersion.client;

  constructor() {
    super(setUp);
    this.configLogger();
  }

  configLogger() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.$on<any>('query', (e: Prisma.QueryEvent) => {
      const { query, params, duration } = e;

      const text = `Prisma v${this.version} - duration: ${duration}ms
      Query: ${query}
      Params: ${params}
      `;

      this.logger.debug(text);
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
