import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('post')
  async create(@Body() createCommentDto: CreateCommentDto) {
    const postComment = await this.commentsService.createComment(
      createCommentDto,
    );
    return postComment;
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':hotelId')
  async findOne(@Param('hotelId') hotelId: string) {
    return await this.commentsService.findOne(+hotelId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
