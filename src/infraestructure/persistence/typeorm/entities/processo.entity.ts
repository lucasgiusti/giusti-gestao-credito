import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index, ManyToOne, JoinColumn, OneToMany, DeleteDateColumn } from 'typeorm';
import { TipoProcesso } from '../../../../domain/entities/processo';
import { Carteira } from './carteira.entity';
import { ParteProcesso } from './parte-processo.entity';

@Entity('processos')
@Index('IDX_PROCESSOS_NUMERO', ['numero'], { unique: true })
export class Processo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  numero: string;

  @Column({ name: 'carteira_id' })
  carteira_id: string;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    name: 'valor_pedido'
  })
  valor_pedido: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    name: 'valor_homologado'
  })
  valor_homologado: number;

  @Column({
    type: 'enum',
    enum: TipoProcesso
  })
  tipo: TipoProcesso;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at: Date;

  // Relacionamentos
  @ManyToOne(() => Carteira)
  @JoinColumn({ name: 'carteira_id' })
  carteira: Carteira;

  @OneToMany(() => ParteProcesso, parteProcesso => parteProcesso.processo)
  partes: ParteProcesso[];
}
