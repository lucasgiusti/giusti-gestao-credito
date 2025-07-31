import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User as UserTypeOrm } from '../entities/user.entity';
import { User } from "src/domain/entities/user";
import { IUserRepository } from 'src/application/interfaces/repositories/user.repository.interface';
import { PaginationOptions, PaginatedResult } from 'src/application/interfaces/common/pagination.interface';
import { TypeOrmUserMapper } from '../mapper/typeorm-user.mapper';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserTypeOrm)
    private userRepository: Repository<UserTypeOrm>,
  ) {}

  async create(user: User): Promise<User> {
    const data = TypeOrmUserMapper.toTypeOrm(user);
    const newUser = this.userRepository.create(data);

    const savedUser = await this.userRepository.save(newUser);
    
    return TypeOrmUserMapper.toDomain(savedUser);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id, deleted_at: null }
    });
    
    if (!user) {
      return null;
    }
    
    return TypeOrmUserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email, deleted_at: null }
    });
    
    if (!user) {
      return null;
    }
    
    return TypeOrmUserMapper.toDomain(user);
  }

  async findAll(options?: PaginationOptions): Promise<PaginatedResult<User>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;
    
    const [users, total] = await this.userRepository.findAndCount({
      where: { deleted_at: null },
      order: { created_at: 'DESC' },
      skip,
      take: limit
    });
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      data: users.map(user => TypeOrmUserMapper.toDomain(user)),
      total,
      page,
      limit,
      totalPages
    };
  }

  async update(id: string, user: User): Promise<User | null> {
    const data = TypeOrmUserMapper.toTypeOrm(user);
    
    await this.userRepository.update(id, data);

    const updatedUser = await this.userRepository.findOne({ where: { id, deleted_at: null } });
    
    if (!updatedUser) {
      return null;
    }
    
    return TypeOrmUserMapper.toDomain(updatedUser);
  }

  async findByAuthServiceUserId(authServiceUserId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { auth_service_user_id: authServiceUserId }
    });
    
    if (!user) {
      return null;
    }
    
    return TypeOrmUserMapper.toDomain(user);
  }
}
