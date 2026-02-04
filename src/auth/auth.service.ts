import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<User> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.is_blocked) {
      throw new ForbiddenException(
        'Suspicious activity. You are blocked. Contact admin.',
      );
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET
    });
    return {
      access_token: accessToken
  }
  }
  async signup(username: string, password: string) {
  const existing = await this.usersService.findByUsername(username);
  if (existing) {
    throw new ConflictException('Username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
  await this.usersService.createUser(
    username,
    hashedPassword,
    UserRole.USER, // 🔒 FORCE USER ROLE
  );

  return { message: 'User registered successfully' };
}

}
