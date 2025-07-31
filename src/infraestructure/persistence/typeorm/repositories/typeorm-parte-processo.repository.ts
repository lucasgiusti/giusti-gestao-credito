import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParteProcesso as ParteProcessoTypeOrm } from '../entities/parte-processo.entity';
import { ParteProcesso } from "src/domain/entities/parte-processo";
import { IParteProcessoRepository } from 'src/application/interfaces/repositories/parte-processo.repository.interface';
import { TypeOrmParteProcessoMapper } from '../mapper/typeorm-parte-processo.mapper';
import { PaginationOptions, PaginatedResult } from 'src/application/interfaces/common/pagination.interface';

@Injectable()
export class TypeOrmParteProcessoRepository implements IParteProcessoRepository {
  constructor(
    @InjectRepository(ParteProcessoTypeOrm)
    private parteProcessoRepository: Repository<ParteProcessoTypeOrm>,
  ) {}

  async create(parteProcesso: ParteProcesso): Promise<ParteProcesso> {
    const data = TypeOrmParteProcessoMapper.toTypeOrm(parteProcesso);
    const newParteProcesso = this.parteProcessoRepository.create(data);

    const savedParteProcesso = await this.parteProcessoRepository.save(newParteProcesso);
    
    return TypeOrmParteProcessoMapper.toDomain(savedParteProcesso);
  }

  async findById(id: string): Promise<ParteProcesso | null> {
    const parteProcesso = await this.parteProcessoRepository.findOne({
      where: { id, deleted_at: null },
      relations: ['cedente', 'processo']
    });
    
    if (!parteProcesso) {
      return null;
    }
    
    return TypeOrmParteProcessoMapper.toDomain(parteProcesso);
  }

  async findByProcessoId(processoId: string, options?: PaginationOptions): Promise<PaginatedResult<ParteProcesso>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;
    
    const [partesProcesso, total] = await this.parteProcessoRepository.findAndCount({
      where: { processo_id: processoId, deleted_at: null },
      relations: ['cedente', 'processo'],
      order: {
        created_at: 'DESC'
      },
      skip,
      take: limit
    });
    
    const totalPages = Math.ceil(total / limit);
        
    return {
      data: partesProcesso.map(parteProcesso => TypeOrmParteProcessoMapper.toDomain(parteProcesso)),
      total,
      page,
      limit,
      totalPages
    };
  }

  async findAll(options?: PaginationOptions): Promise<PaginatedResult<ParteProcesso>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;
    
    const [partesProcesso, total] = await this.parteProcessoRepository.findAndCount({
      where: { deleted_at: null },
      relations: ['cedente', 'processo'],
      order: {
        created_at: 'DESC'
      },
      skip,
      take: limit
    });

    const totalPages = Math.ceil(total / limit);
        
    return {
      data: partesProcesso.map(parteProcesso => TypeOrmParteProcessoMapper.toDomain(parteProcesso)),
      total,
      page,
      limit,
      totalPages
    };
  }

  async update(id: string, parteProcesso: ParteProcesso): Promise<ParteProcesso | null> {
    const data = TypeOrmParteProcessoMapper.toTypeOrm(parteProcesso);
    
    await this.parteProcessoRepository.update(id, data);

    const updatedParteProcesso = await this.parteProcessoRepository.findOne({ 
      where: { id, deleted_at: null },
      relations: ['cedente', 'processo']
    });
    
    if (!updatedParteProcesso) {
      return null;
    }
    
    return TypeOrmParteProcessoMapper.toDomain(updatedParteProcesso);
  }

  async delete(id: string): Promise<void> {
    await this.parteProcessoRepository.softDelete(id);
  }

  async deleteByProcessoId(processoId: string): Promise<void> {
    await this.parteProcessoRepository.softDelete({ processo_id: processoId });
  }

  async findByProcessoIdAndCedenteId(processoId: string, cedenteId: string): Promise<ParteProcesso | null> {
    const parteProcesso = await this.parteProcessoRepository.findOne({
      where: { processo_id: processoId, cedente_id: cedenteId, deleted_at: null },
      relations: ['cedente', 'processo'],
      order: {
        created_at: 'DESC'
      }
    });
    
    if (!parteProcesso) {
      return null;
    }
    
    return TypeOrmParteProcessoMapper.toDomain(parteProcesso);
  }

  async existsByProcessoId(processoId: string): Promise<boolean> {
    const parteProcesso = await this.parteProcessoRepository.findOne({
      where: { processo_id: processoId, deleted_at: null },
    });
    
    if (!parteProcesso) {
      return false;
    }
    
    return true;
  }

  async existsByCedenteId(cedenteId: string): Promise<boolean> {
    const parteProcesso = await this.parteProcessoRepository.findOne({
      where: { cedente_id: cedenteId, deleted_at: null },
    });
    
    if (!parteProcesso) {
      return false;
    }
    
    return true;
  }
}
