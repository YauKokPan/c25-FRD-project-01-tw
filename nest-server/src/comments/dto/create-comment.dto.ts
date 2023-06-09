import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  user_id: number;

  hotel_id: number;

  @IsNotEmpty()
  nick_name: string;

  @IsNotEmpty()
  comment_text: string;

  @IsNotEmpty()
  rating: number;
}
