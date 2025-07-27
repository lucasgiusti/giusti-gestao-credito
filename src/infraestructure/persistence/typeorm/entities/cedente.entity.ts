import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';
import { DocumentoTipo } from '../../../../domain/value-objects/documento';

@Entity('cedentes')
@Index('IDX_CEDENTES_DOCUMENTO', ['documento'], { unique: true })
export class Cedente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({
    type: 'enum',
    enum: DocumentoTipo,
    name: 'tipo_documento'
  })
  tipo_documento: DocumentoTipo;

  @Column({ length: 14 })
  documento: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
