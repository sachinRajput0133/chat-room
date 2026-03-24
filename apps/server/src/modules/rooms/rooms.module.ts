import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './room.schema';
import { RoomRepository } from './room.repository';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { ChatGatewayModule } from '../../gateway/chat-gateway.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    forwardRef(() => ChatGatewayModule),
  ],
  providers: [RoomsService, RoomRepository],
  controllers: [RoomsController],
  exports: [RoomsService, RoomRepository],
})
export class RoomsModule {}
