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
      where: { id }
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
    const users = await this.userRepository.find();
    
    return users.map(user => TypeOrmUserMapper.toDomain(user));
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async update(id: number, user: User): Promise<User> {
    const data = TypeOrmUserMapper.toTypeOrm(user);
    const updatedUser = this.userRepository.create(data);
    
    const savedUser = await this.userRepository.save(updatedUser);
    
    return TypeOrmUserMapper.toDomain(savedUser);
  }
}
