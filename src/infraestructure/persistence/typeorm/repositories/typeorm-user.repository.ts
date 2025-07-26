import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User as UserTypeOrm } from '../entities/user.entity';
import { User } from "src/domain/entities/user";
import { IUserRepository } from 'src/application/interfaces/repositories/user.repository.interface';
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

  async findById(id: number): Promise<User | null> {
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

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({ where: { deleted_at: null } });
    
    return users.map(user => TypeOrmUserMapper.toDomain(user));
  }

  async update(id: number, user: User): Promise<User | null> {
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
