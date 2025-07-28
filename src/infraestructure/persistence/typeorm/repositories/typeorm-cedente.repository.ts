import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cedente as CedenteTypeOrm } from '../entities/cedente.entity';
import { Cedente } from "src/domain/entities/cedente";
import { ICedenteRepository } from 'src/application/interfaces/repositories/cedente.repository.interface';
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

  async findAll(): Promise<Cedente[]> {
    const cedentes = await this.cedenteRepository.find();
    
    return cedentes.map(cedente => TypeOrmCedenteMapper.toDomain(cedente));
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
