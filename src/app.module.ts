import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 10, // 10 requests per minute
      },
      {
        ttl: 10000, // 10 seconds
        limit: 5, // 5 requests per 10 seconds (burst)
      },
    ]),
    UserModule,
  ],
})
export class AppModule {}