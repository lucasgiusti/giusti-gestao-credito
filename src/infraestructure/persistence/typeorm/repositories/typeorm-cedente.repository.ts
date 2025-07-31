import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cedente as CedenteTypeOrm } from '../entities/cedente.entity';
import { Cedente } from "src/domain/entities/cedente";
import { ICedenteRepository } from 'src/application/interfaces/repositories/cedente.repository.interface';
import { PaginationOptions, PaginatedResult } from 'src/application/interfaces/common/pagination.interface';
import { TypeOrmCedenteMapper } from '../mapper/typeorm-cedente.mapper';

@Injectable()
export class TypeOrmCedenteRepository implements ICedenteRepository {
  constructor(
    @InjectRepository(CedenteTypeOrm)
    private cedenteRepository: Repository<CedenteTypeOrm>,
  ) {}

  async create(cedente: Cedente): Promise<Cedente> {
    const data = TypeOrmCedenteMapper.toTypeOrm(cedente);
    const newCedente = this.cedenteRepository.create(data);

    const savedCedente = await this.cedenteRepository.save(newCedente);
    
    return TypeOrmCedenteMapper.toDomain(savedCedente);
  }

  async findById(id: string): Promise<Cedente | null> {
    const cedente = await this.cedenteRepository.findOne({
      where: { id }
    });
    
    if (!cedente) {
      return null;
    }
    
    return TypeOrmCedenteMapper.toDomain(cedente);
  }

  async findAll(options?: PaginationOptions): Promise<PaginatedResult<Cedente>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;
    
    const [cedentes, total] = await this.cedenteRepository.findAndCount({
      order: {
        created_at: 'DESC'
      },
      skip,
      take: limit
    });
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      data: cedentes.map(cedente => TypeOrmCedenteMapper.toDomain(cedente)),
      total,
      page,
      limit,
      totalPages
    };
  }

  async update(id: string, cedente: Cedente): Promise<Cedente | null> {
    const data = TypeOrmCedenteMapper.toTypeOrm(cedente);
    
    await this.cedenteRepository.update(id, data);

    const updatedCedente = await this.cedenteRepository.findOne({ where: { id } });
    
    if (!updatedCedente) {
      return null;
    }
    
    return TypeOrmCedenteMapper.toDomain(updatedCedente);
  }

  async findByDocumento(documento: string): Promise<Cedente | null> {
    const cedente = await this.cedenteRepository.findOne({
      where: { documento }
    });

    if (!cedente) {
      return null;
    }
    
    return TypeOrmCedenteMapper.toDomain(cedente);
  }

  async delete(id: string): Promise<void> {
    await this.cedenteRepository.delete(id);
  }
}
