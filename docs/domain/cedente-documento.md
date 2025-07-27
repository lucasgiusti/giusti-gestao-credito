# Documento Value Object e Entidade Cedente

Este documento descreve a implementação do Value Object `Documento` e sua integração com a entidade de domínio `Cedente`.

## Documento Value Object

O `Documento` é um Value Object que representa documentos de identificação brasileiros (CPF e CNPJ) e encapsula a lógica de validação, formatação e manipulação desses documentos.

### Estrutura

- **Documento (Classe Abstrata)**: Define a interface base para todos os tipos de documento
  - **CPF**: Implementação específica para CPF
  - **CNPJ**: Implementação específica para CNPJ
- **DocumentoFactory**: Factory para criar a instância correta de documento baseada no formato do input

### Características

- **Validação**: Implementa algoritmos de validação específicos para CPF e CNPJ
- **Formatação**: Formata os documentos de acordo com os padrões brasileiros (CPF: XXX.XXX.XXX-XX, CNPJ: XX.XXX.XXX/XXXX-XX)
- **Imutabilidade**: Uma vez criado, o valor do documento não pode ser alterado
- **Igualdade por valor**: Dois documentos são iguais se tiverem o mesmo tipo e valor
- **Serialização JSON**: Suporta serialização para JSON com opção de formatação

### Uso

```typescript
// Criando um documento via factory (recomendado)
const documento = DocumentoFactory.create('12345678901'); // CPF
const documento = DocumentoFactory.create('12345678000199'); // CNPJ

// Criando diretamente (não recomendado)
const cpf = new CPF('12345678901');
const cnpj = new CNPJ('12345678000199');

// Formatação
documento.format(); // Retorna o documento formatado

// Verificação de igualdade
documento1.equals(documento2);

// Serialização
documento.toJSON(true); // Com formatação
documento.toJSON(); // Sem formatação
```

## Entidade Cedente

A entidade `Cedente` representa um cedente no sistema de gestão de crédito, utilizando o Value Object `Documento` para encapsular a lógica de documentos.

### Estrutura

```typescript
class Cedente {
  private _id?: number;
  private _nome: string;
  private _documento: Documento;
  private _createdAt?: Date;
  private _updatedAt?: Date;
  
  // Construtores, getters, métodos de domínio...
}
```

### Características

- **Encapsulamento**: Todos os atributos são privados com getters
- **Validação**: O documento é validado através do Value Object `Documento`
- **Factory Method**: Método estático `create` para facilitar a criação de instâncias
- **Atualização controlada**: Método `update` para atualizar atributos com validação

### Uso

```typescript
// Criando um cedente
const cedente = Cedente.create('Nome do Cedente', '12345678901');

// Atualizando um cedente
cedente.update({ 
  nome: 'Novo Nome', 
  documento: '12345678000199' 
});

// Acessando propriedades
const nome = cedente.nome;
const documento = cedente.documento;
const documentoFormatado = cedente.documento.format();
```

## Persistência

### Entidade TypeORM

A entidade TypeORM `Cedente` mapeia a entidade de domínio para o banco de dados:

```typescript
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
  tipoDocumento: DocumentoTipo;

  @Column({ length: 14 })
  documento: string;

  // Outros campos e métodos...
}
```

### Repositório

O repositório `TypeOrmCedenteRepository` implementa a interface `ICedenteRepository` e fornece métodos para persistência:

```typescript
@Injectable()
export class TypeOrmCedenteRepository implements ICedenteRepository {
  // Métodos de CRUD...
}
```

### Mapper

O mapper `TypeOrmCedenteMapper` converte entre a entidade de domínio e a entidade TypeORM:

```typescript
export class TypeOrmCedenteMapper {
  static toDomain(entity: CedenteTypeOrm): Cedente {
    // Conversão para entidade de domínio
  }

  static toTypeOrm(cedente: Cedente) {
    // Conversão para entidade TypeORM
  }
}
```

## Caso de Uso

O caso de uso `CreateCedenteUseCase` utiliza o repositório para criar um novo cedente:

```typescript
@Injectable()
export class CreateCedenteUseCase {
  constructor(
    private cedenteRepository: ICedenteRepository
  ) {}

  async execute({
    nome,
    documento,
  }: CreateCedenteUseCaseCommand): Promise<Cedente> {
    const cedente = Cedente.create(nome, documento);
    return await this.cedenteRepository.create(cedente);
  }
}
```

## Controller HTTP

O controller `CedenteController` expõe endpoints para manipulação de cedentes:

```typescript
@Controller('cedentes')
export class CedenteController {
  constructor(
    private readonly createCedenteUseCase: CreateCedenteUseCase
  ) {}

  @Post()
  async create(@Body() createCedenteDto: CreateCedenteDto): Promise<CedenteResponseDto> {
    const cedente = await this.createCedenteUseCase.execute(createCedenteDto);
    return CedenteResponseDto.fromDomain(cedente);
  }
}
```

## Migração do Banco de Dados

A migração `CreateCedentesTable` cria a tabela `cedentes` com as seguintes colunas:

- `id`: Chave primária auto-incrementada
- `nome`: String com máximo de 100 caracteres, não nulo
- `tipo_documento`: Enum ('CPF' ou 'CNPJ'), não nulo
- `documento`: String com máximo de 14 caracteres, não nulo, índice único
- `created_at`: Timestamp de criação
- `updated_at`: Timestamp de atualização
