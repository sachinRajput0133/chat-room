import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IAuthUser } from '../../types/auth.types';
import { ChatGateway } from '../../gateway/chat.gateway';

@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.roomsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateRoomDto, @CurrentUser() user: IAuthUser) {
    const room = await this.roomsService.create(dto, user.id);
    // Broadcast to all connected clients so sidebars update instantly
    this.chatGateway.server.emit('room_created', room);
    return room;
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  join(@Param('id') id: string, @CurrentUser() user: IAuthUser) {
    return this.roomsService.join(id, user.id);
  }
}
