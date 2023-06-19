import { PrismaService } from '../prisma/prisma.service';
import { Injectable, UnauthorizedException, Req } from '@nestjs/common';
import { LoginDto, CreateUserDto } from './dto';
import { checkPassword, hashPassword } from './hash';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { KafkaMiddleware } from 'src/kafka/kafka.middleware';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly kafkaMiddleware: KafkaMiddleware,
  ) {}

  async login(@Req() req: Request, loginDto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ name: loginDto.name }, { email: loginDto.email }],
      },
      select: {
        id: true,
        password: true,
        name: true,
        email: true,
        is_admin: true,
      },
    });

    if (!user || !(await checkPassword(loginDto.password, user.password))) {
      throw new UnauthorizedException();
    }
    // Log user login information to Kafka
    this.kafkaMiddleware.logUserLogin(user.name, user.email, req);
    return this.signToken(user);
  }

  async signToken(user: {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
  }) {
    const payload = { sub: user.id };
    console.log(this.config.get('JWT_SECRET'));
    return {
      access_token: await this.jwt.signAsync(payload, {
        expiresIn: '1d',
        secret: this.config.get('JWT_SECRET'),
      }),
      name: user.name,
      email: user.email,
      id: user.id,
      is_admin: user.is_admin,
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
