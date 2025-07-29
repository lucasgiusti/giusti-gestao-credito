import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { Processo } from './processo.entity';
import { Cedente } from './cedente.entity';

@Entity('partes_processo')
export class ParteProcesso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'processo_id' })
  processo_id: string;

  @Column({ name: 'cedente_id' })
  cedente_id: string;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2
  })
  valor: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 4
  })
  percentual: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at: Date;

  // Relacionamentos
  @ManyToOne(() => Processo, processo => processo.partes)
  @JoinColumn({ name: 'processo_id' })
  processo: Processo;

  @ManyToOne(() => Cedente)
  @JoinColumn({ name: 'cedente_id' })
  cedente: Cedente;
}
