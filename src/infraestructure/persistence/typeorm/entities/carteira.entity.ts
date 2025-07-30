import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('carteiras')
export class Carteira {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 10, nullable: false })
  codigo: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
