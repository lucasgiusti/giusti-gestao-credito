import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carteira as CarteiraTypeOrm } from '../entities/carteira.entity';
import { Carteira } from "src/domain/entities/carteira";
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';
import { IPaginationOptions, IPaginatedResult } from 'src/application/interfaces/common/pagination.interface';
import { TypeOrmCarteiraMapper } from '../mapper/typeorm-carteira.mapper';

@Injectable()
export class TypeOrmCarteiraRepository implements ICarteiraRepository {
  constructor(
    @InjectRepository(CarteiraTypeOrm)
    private carteiraRepository: Repository<CarteiraTypeOrm>,
  ) {}

  async create(carteira: Carteira): Promise<Carteira> {
    const data = TypeOrmCarteiraMapper.toTypeOrm(carteira);
    const newCarteira = this.carteiraRepository.create(data);

    const savedCarteira = await this.carteiraRepository.save(newCarteira);
    
    return TypeOrmCarteiraMapper.toDomain(savedCarteira);
  }

  async findById(id: string): Promise<Carteira | null> {
    const carteira = await this.carteiraRepository.findOne({
      where: { id }
    });
    
    if (!carteira) {
      return null;
    }
    
    return TypeOrmCarteiraMapper.toDomain(carteira);
  }

  async findByCodigo(codigo: string): Promise<Carteira | null> {
    const carteira = await this.carteiraRepository.findOne({
      where: { codigo }
    });
    
    if (!carteira) {
      return null;
    }
    
    return TypeOrmCarteiraMapper.toDomain(carteira);
  }

  async findAll(options?: IPaginationOptions): Promise<IPaginatedResult<Carteira>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;
    
    const [carteiras, total] = await this.carteiraRepository.findAndCount({
      order: {
        created_at: 'DESC'
      },
      skip,
      take: limit
    });
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      data: carteiras.map(carteira => TypeOrmCarteiraMapper.toDomain(carteira)),
      total,
      page,
      limit,
      totalPages
    };
  }

  async update(id: string, carteira: Carteira): Promise<Carteira | null> {
      const data = TypeOrmCarteiraMapper.toTypeOrm(carteira);
      
      await this.carteiraRepository.update(id, data);
  
      const updatedCarteira = await this.carteiraRepository.findOne({ where: { id } });
      
      if (!updatedCarteira) {
        return null;
      }
      
      return TypeOrmCarteiraMapper.toDomain(updatedCarteira);
  }

  async delete(id: string): Promise<void> {
    await this.carteiraRepository.delete(id);
  }
}
