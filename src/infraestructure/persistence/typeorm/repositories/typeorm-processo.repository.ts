import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Processo as ProcessoTypeOrm } from '../entities/processo.entity';
import { Processo } from "src/domain/entities/processo";
import { IProcessoRepository } from 'src/application/interfaces/repositories/processo.repository.interface';
import { TypeOrmProcessoMapper } from '../mapper/typeorm-processo.mapper';
import { PaginationOptions, PaginatedResult } from 'src/application/interfaces/common/pagination.interface';

@Injectable()
export class TypeOrmProcessoRepository implements IProcessoRepository {
  constructor(
    @InjectRepository(ProcessoTypeOrm)
    private processoRepository: Repository<ProcessoTypeOrm>,
  ) {}

  async create(processo: Processo): Promise<Processo> {
    const data = TypeOrmProcessoMapper.toTypeOrm(processo);
    const newProcesso = this.processoRepository.create(data);

    const savedProcesso = await this.processoRepository.save(newProcesso);
    
    return TypeOrmProcessoMapper.toDomain(savedProcesso);
  }

  async findById(id: string): Promise<Processo | null> {
    const processo = await this.processoRepository.findOne({
      where: { id, deleted_at: null },
      relations: ['partes']
    });
    
    if (!processo) {
      return null;
    }
    
    return TypeOrmProcessoMapper.toDomain(processo);
  }

  async findByNumero(numero: string): Promise<Processo | null> {
    const processo = await this.processoRepository.findOne({
      where: { numero, deleted_at: null },
      relations: ['partes']
    });
    
    if (!processo) {
      return null;
    }
    
    return TypeOrmProcessoMapper.toDomain(processo);
  }

  async findByCarteiraId(carteiraId: string, options?: PaginationOptions): Promise<PaginatedResult<Processo>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;
    
    const [processos, total] = await this.processoRepository.findAndCount({
      where: { carteira_id: carteiraId, deleted_at: null },
      relations: ['partes'],
      order: {
        created_at: 'DESC'
      },
      skip,
      take: limit
    });
    
    const totalPages = Math.ceil(total / limit);
        
    return {
      data: processos.map(processo => TypeOrmProcessoMapper.toDomain(processo)),
      total,
      page,
      limit,
      totalPages
    };
  }

  async findAll(options?: PaginationOptions): Promise<PaginatedResult<Processo>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;
    
    const [processos, total] = await this.processoRepository.findAndCount(
      {
        where: { deleted_at: null },
        relations: ['partes'],
        order: {
          created_at: 'DESC'
        },
        skip,
        take: limit
      }
    );
    
    const totalPages = Math.ceil(total / limit);
        
    return {
      data: processos.map(processo => TypeOrmProcessoMapper.toDomain(processo)),
      total,
      page,
      limit,
      totalPages
    };
  }

  async update(id: string, processo: Processo): Promise<Processo | null> {
    const data = TypeOrmProcessoMapper.toTypeOrm(processo);
    
    await this.processoRepository.update(id, data);

    const updatedProcesso = await this.processoRepository.findOne({ 
      where: { id, deleted_at: null },
      relations: ['partes']
    });
    
    if (!updatedProcesso) {
      return null;
    }
    
    return TypeOrmProcessoMapper.toDomain(updatedProcesso);
  }

  async delete(id: string): Promise<void> {
    await this.processoRepository.softDelete(id);
  }

  async existsByCarteiraId(carteiraId: string): Promise<boolean> {
    const processo = await this.processoRepository.findOne({
      where: { carteira_id: carteiraId, deleted_at: null },
    });
    
    if (!processo) {
      return false;
    }
    
    return true;
  }
}
