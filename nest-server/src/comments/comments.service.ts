import { Injectable } from '@nestjs/common';
import { Comment } from '@prisma/client';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

export interface CommentData {
  nick_name: string;
  comment_text: string;
  rating: number;
  createdAt: Date;
}

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}
  async createComment(inputData: CreateCommentDto): Promise<Comment> {
    const { user_id, hotel_id, nick_name, comment_text, rating } = inputData;

    const postComment = await this.prisma.comment.create({
      data: {
        user_booking_key: { connect: { id: user_id } },
        user_hotel_booking_key: { connect: { id: hotel_id } },
        nick_name,
        comment_text,
        rating,
        is_deleted: false,
      },
    });

    return postComment;
  }

  findAll() {
    return `This action returns all comments`;
  }

  async findOne(hotelId: number): Promise<CommentData[]> {
    return await this.prisma.comment.findMany({
      where: {
        user_hotel_booking_key: { id: hotelId },
      },

      select: {
        nick_name: true,
        comment_text: true,
        rating: true,
        createdAt: true,
      },
    });
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
