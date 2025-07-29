import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParteProcesso as ParteProcessoTypeOrm } from '../entities/parte-processo.entity';
import { ParteProcesso } from "src/domain/entities/parte-processo";
import { IParteProcessoRepository } from 'src/application/interfaces/repositories/parte-processo.repository.interface';
import { TypeOrmParteProcessoMapper } from '../mapper/typeorm-parte-processo.mapper';

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
      where: { id },
      relations: ['cedente']
    });
    
    if (!parteProcesso) {
      return null;
    }
    
    return TypeOrmParteProcessoMapper.toDomain(parteProcesso);
  }

  async findByProcessoId(processoId: string): Promise<ParteProcesso[]> {
    const partesProcesso = await this.parteProcessoRepository.find({
      where: { processo_id: processoId },
      relations: ['cedente']
    });
    
    return partesProcesso.map(parteProcesso => TypeOrmParteProcessoMapper.toDomain(parteProcesso));
  }

  async findByCedenteId(cedenteId: string): Promise<ParteProcesso[]> {
    const partesProcesso = await this.parteProcessoRepository.find({
      where: { cedente_id: cedenteId },
      relations: ['cedente']
    });
    
    return partesProcesso.map(parteProcesso => TypeOrmParteProcessoMapper.toDomain(parteProcesso));
  }

  async findAll(): Promise<ParteProcesso[]> {
    const partesProcesso = await this.parteProcessoRepository.find({
      relations: ['cedente']
    });
    
    return partesProcesso.map(parteProcesso => TypeOrmParteProcessoMapper.toDomain(parteProcesso));
  }

  async update(id: string, parteProcesso: ParteProcesso): Promise<ParteProcesso | null> {
    const data = TypeOrmParteProcessoMapper.toTypeOrm(parteProcesso);
    
    await this.parteProcessoRepository.update(id, data);

    const updatedParteProcesso = await this.parteProcessoRepository.findOne({ 
      where: { id },
      relations: ['cedente']
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
      where: { processo_id: processoId, cedente_id: cedenteId },
      relations: ['cedente']
    });
    
    if (!parteProcesso) {
      return null;
    }
    
    return TypeOrmParteProcessoMapper.toDomain(parteProcesso);
  }
}
