import { UserService } from './user.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtGuard)
  async getSelfInfo(@GetUser('id') userId: number) {
    return await this.userService.getSelfInfo(userId);
  }
}
