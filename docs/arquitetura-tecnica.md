# Sistema Giusti Gestão de Créditos
## Documento de Arquitetura Técnica

**Versão:** 1.0  
**Data:** 18/07/2025  
**Preparado por:** Equipe de Arquitetura

## Sumário Executivo

Este documento apresenta a arquitetura técnica do Sistema Giusti Gestão de Créditos, detalhando as tecnologias, componentes e integrações que compõem a solução. A arquitetura foi projetada para atender aos requisitos funcionais e não-funcionais especificados no documento de especificação funcional, garantindo escalabilidade, segurança e manutenibilidade.

## Visão Geral da Arquitetura

O Sistema Giusti Gestão de Créditos segue uma arquitetura moderna baseada em microserviços, utilizando tecnologias cloud-native para garantir escalabilidade e resiliência. A arquitetura é composta por três camadas principais:

1. **Frontend**: Interface do usuário desenvolvida com React e hospedada na Vercel (implementação via lovable.dev)
2. **Backend**: API RESTful desenvolvida com NestJS e hospedada na Railway
3. **Banco de Dados e Autenticação**: Supabase (PostgreSQL + Serviços de Autenticação, com implementação da autenticação via lovable.dev)

```mermaid
flowchart TD
    subgraph "Frontend (Vercel)"
        A[Next.js/React]
    end
    
    subgraph "Backend (Railway)"
        B[NestJS API]
    end
    
    subgraph "Supabase"
        C[PostgreSQL]
        D[Autenticação]
    end
    
    A <--> B
    A <--> D
    B <--> C
    B <--> D
```

## Stack Tecnológica

### Frontend
- **Tecnologia**: React
- **Hospedagem**: Vercel
- **Implementação**: Serviço lovable.dev
- **Papel**: Interface do usuário, consumindo APIs do NestJS e serviços do Supabase
- **Principais bibliotecas**:
  - React Query: Gerenciamento de estado e cache de dados
  - Tailwind CSS: Framework CSS para estilização
  - React Hook Form: Gerenciamento de formulários
  - Zod: Validação de esquemas
  - Supabase JS Client: Integração direta com serviços do Supabase
  - React Router: Gerenciamento de rotas

  ### Backend
- **Tecnologia**: NestJS
- **Hospedagem**: Railway
- **Papel**: Lógica de negócios, validações, integrações externas
- **Principais módulos**:
  - NestJS Core: Framework base
  - TypeORM: ORM para acesso ao banco de dados
  - Passport: Middleware de autenticação
  - Supabase Admin SDK: Integração com serviços do Supabase
  - Swagger: Documentação de API

### Banco de Dados e Autenticação
- **Tecnologia**: Supabase
- **Hospedagem**: Gerenciada pelo Supabase
- **Implementação da Autenticação**: Serviço lovable.dev
- **Papel**: 
  - PostgreSQL: Armazenamento de dados
  - Autenticação: JWT, OAuth, gerenciamento de usuários

## Fluxo de Autenticação

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Supabase Auth
    participant Backend
    participant Database
    
    User->>Frontend: Login (email/senha)
    Frontend->>Supabase Auth: Autenticar
    Supabase Auth-->>Frontend: JWT Token
    Frontend->>Backend: Requisição API com JWT
    Backend->>Supabase Auth: Validar Token
    Supabase Auth-->>Backend: Token Válido + Claims
    Backend->>Database: Consulta/Operação
    Database-->>Backend: Resultado
    Backend-->>Frontend: Resposta
    Frontend-->>User: Exibir Dados
```

1. O usuário realiza login através da interface frontend
2. O frontend se comunica diretamente com o serviço de autenticação do Supabase
3. Após autenticação bem-sucedida, o Supabase retorna um JWT
4. O frontend armazena o token e o utiliza em todas as requisições subsequentes
5. O backend valida o token JWT usando o SDK do Supabase antes de processar requisições
6. Após validação, o backend processa a requisição e retorna os dados necessários

## Componentes do Sistema

### Módulos do Frontend

1. **Módulo de Autenticação**
   - Login/Logout
   - Recuperação de senha
   - Gerenciamento de perfil

### Módulos do Backend

1. **Módulo de Autenticação e Autorização**
   - Validação de tokens JWT
   - Controle de acesso baseado em perfis
   - Integração com Supabase Auth

## Integrações

### Integrações Internas

1. **Frontend → Supabase Auth**
   - Autenticação direta de usuários
   - Gerenciamento de sessões

2. **Frontend → Backend API**
   - Consumo de endpoints para operações de negócio
   - Envio de dados de formulários

3. **Backend → Supabase Database**
   - Operações CRUD no banco de dados
   - Consultas complexas e relatórios

4. **Backend → Supabase Auth**
   - Validação de tokens JWT
   - Verificação de permissões

## Considerações de Segurança

1. **Autenticação**
   - Utilização de JWT com tempo de expiração adequado
   - Refresh tokens para renovação segura de sessões
   - Autenticação multifator para operações sensíveis

2. **Autorização**
   - Controle de acesso baseado em perfis (RBAC) utilizando claims do JWT
   - Validação de permissões em nível de API no backend NestJS
   - Sem utilização de Row Level Security do PostgreSQL
   - Logs de auditoria para ações sensíveis

3. **Proteção de Dados**
   - Criptografia de dados sensíveis em repouso
   - HTTPS para todas as comunicações
   - Sanitização de inputs para prevenir injeções

4. **Conformidade com LGPD**
   - Consentimento explícito para coleta de dados
   - Mecanismos para exclusão de dados pessoais
   - Registro de operações de tratamento de dados

## Escalabilidade e Desempenho

1. **Estratégias de Escalabilidade**
   - Arquitetura stateless permitindo escalabilidade horizontal
   - Uso de cache para reduzir carga no banco de dados
   - Paginação e limitação de resultados em consultas pesadas

2. **Otimização de Desempenho**
   - Indexação adequada no banco de dados
   - Lazy loading de componentes no frontend
   - Compressão de respostas HTTP

3. **Monitoramento**
   - Logs estruturados para análise de erros

## Estratégia de Implantação

1. **Ambientes**
   - Desenvolvimento: Para desenvolvimento ativo
   - Homologação: Para testes de aceitação
   - Produção: Ambiente final para usuários

2. **CI/CD**
   - GitHub Actions para automação de builds e testes
   - Deploy automático para Vercel (frontend via lovable.dev) e Railway (backend)
   - Testes automatizados antes de cada deploy

3. **Versionamento**
   - Semântico (MAJOR.MINOR.PATCH)
   - Branches protegidas com revisão de código obrigatória
   - Changelogs automáticos

---

Este documento é uma arquitetura inicial baseada nas informações fornecidas. Ajustes e refinamentos serão realizados conforme feedback dos stakeholders e evolução do entendimento dos requisitos do sistema.
