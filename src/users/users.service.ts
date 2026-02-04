import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  async findById(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
    });
  }

  async createUser(
    username: string,
    hashedPassword: string,
    role: UserRole = UserRole.USER,
  ): Promise<User> {
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      role,
    });

    return this.userRepository.save(user);
  }

  async blockUser(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      is_blocked: true,
    });
  }

  async unblockUser(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      is_blocked: false,
    });
  }
}
