import { PrismaService } from '../prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, CreateUserDto } from './dto';
import { checkPassword, hashPassword } from './hash';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ name: loginDto.name }, { email: loginDto.email }],
      },
      select: { id: true, password: true },
    });

    if (!user || !(await checkPassword(loginDto.password, user.password))) {
      throw new UnauthorizedException();
    }

    return this.signToken(user.id);
  }

  async signToken(userId: number) {
    const payload = { sub: userId };
    console.log(this.config.get('JWT_SECRET'));
    return {
      access_token: await this.jwt.signAsync(payload, {
        expiresIn: '1d',
        secret: this.config.get('JWT_SECRET'),
      }),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await hashPassword(createUserDto.password);

    // Create the user with the hashed password
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        is_admin: false,
      },
    });

    return user;
  }
}
