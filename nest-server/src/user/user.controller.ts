import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Put,
  Delete,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Put(':id')
  async update(@Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    const id = updateUserDto.id;
    if (id === undefined || isNaN(+id)) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Invalid user ID',
      });
    }

    try {
      console.log('Received request to update user:', id);
      console.log('UpdateUserDto:', updateUserDto);
      const updatedUser = await this.userService.update(+id, updateUserDto);
      console.log('Updated user:', updatedUser);
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error.message, error.stack);
      return res.status(500).json({
        statusCode: 500,
        message: 'Internal Server Error',
      });
    }
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
