import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { MessagesModule } from './modules/messages/messages.module';
import { ChatGatewayModule } from './gateway/chat-gateway.module';
import { winstonConfig } from './utils/logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    WinstonModule.forRoot(winstonConfig),
    DatabaseModule,
    UsersModule,
    AuthModule,
    RoomsModule,
    MessagesModule,
    ChatGatewayModule,
  ],
})
export class AppModule {}
