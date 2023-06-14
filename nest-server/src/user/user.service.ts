import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSelfInfo(userId: number) {
    const foundUser = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });
    return foundUser;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} comment`;
  // }
}
