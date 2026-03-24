import { Module, forwardRef } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessagesModule } from '../modules/messages/messages.module';
import { RoomsModule } from '../modules/rooms/rooms.module';
import { AuthModule } from '../modules/auth/auth.module';

@Module({
  imports: [AuthModule, MessagesModule, forwardRef(() => RoomsModule)],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class ChatGatewayModule {}
