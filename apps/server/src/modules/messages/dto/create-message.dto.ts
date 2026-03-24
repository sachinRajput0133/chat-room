import { IsString, IsNotEmpty, MaxLength, IsMongoId } from 'class-validator';

export class CreateMessageDto {
  @IsMongoId()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;
}
