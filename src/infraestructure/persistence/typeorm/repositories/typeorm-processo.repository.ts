import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Processo as ProcessoTypeOrm } from '../entities/processo.entity';
import { Processo } from "src/domain/entities/processo";
import { IProcessoRepository } from 'src/application/interfaces/repositories/processo.repository.interface';
import { TypeOrmProcessoMapper } from '../mapper/typeorm-processo.mapper';

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

  async findByCarteiraId(carteiraId: string): Promise<Processo[]> {
    const processos = await this.processoRepository.find({
      where: { carteira_id: carteiraId, deleted_at: null },
      relations: ['partes']
    });
    
    return processos.map(processo => TypeOrmProcessoMapper.toDomain(processo));
  }

  async findAll(): Promise<Processo[]> {
    const processos = await this.processoRepository.find(
      {
        where: { deleted_at: null },
        relations: ['partes']
      }
    );
    
    return processos.map(processo => TypeOrmProcessoMapper.toDomain(processo));
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
}
