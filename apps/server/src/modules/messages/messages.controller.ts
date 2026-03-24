import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('rooms')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(':id/messages')
  @UseGuards(JwtAuthGuard)
  getMessages(
    @Param('id') roomId: string,
    @Query('limit') limit?: string,
  ) {
    return this.messagesService.findByRoom(roomId, limit ? parseInt(limit, 10) : 50);
  }
}
