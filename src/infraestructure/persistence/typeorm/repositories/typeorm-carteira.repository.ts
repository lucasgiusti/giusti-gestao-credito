import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carteira as CarteiraTypeOrm } from '../entities/carteira.entity';
import { Carteira } from "src/domain/entities/carteira";
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';
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

  async findAll(): Promise<Carteira[]> {
    const carteiras = await this.carteiraRepository.find();
    
    return carteiras.map(carteira => TypeOrmCarteiraMapper.toDomain(carteira));
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
