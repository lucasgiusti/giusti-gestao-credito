# Plano de Desenvolvimento Frontend - Sistema Giusti Gestão de Créditos
## Documento de Setup do Projeto React via lovable.dev

**Versão:** 1.0  
**Data:** 18/07/2025  
**Preparado por:** Equipe de Desenvolvimento

## Objetivo

Este documento detalha o plano para configuração e desenvolvimento do frontend do Sistema Giusti Gestão de Créditos utilizando o serviço lovable.dev para criação do projeto React e configuração da autenticação com o Supabase. O Supabase será utilizado exclusivamente para autenticação, enquanto todas as operações de dados serão realizadas através do backend NestJS.

## 1. Criação do Prompt para lovable.dev

**Nota importante:** O frontend utilizará o Supabase apenas para autenticação. Todas as operações de banco de dados serão realizadas através do backend NestJS.

### Prompt Base para Criação do Projeto

```
Crie um projeto React para um Sistema Giusti Gestão de Créditos com as seguintes especificações:

## Contexto do Projeto
O Sistema Giusti Gestão de Créditos é uma plataforma que permite o gerenciamento completo do ciclo de vida de créditos adquiridos, desde a identificação de oportunidades até o monitoramento e cobrança dos créditos comprados. O sistema é projetado para suportar o fluxo de trabalho específico de empresas que negociam a compra de direitos creditórios oriundos de processos judiciais.
Inicialmente o sistema deve ter apenas a funcionalidade de autenticação.

## Requisitos Técnicos
- React 18+
- TypeScript
- Tailwind CSS para estilização
- Componentes de UI com Shadcn/UI
- React Hook Form para gerenciamento de formulários
- Zod para validação de esquemas
- Integração com Supabase apenas para autenticação
- Hospedagem na Vercel

## Estrutura do Projeto
- Arquitetura baseada em componentes reutilizáveis
- Separação clara entre lógica de negócios e componentes de UI
- Organização por módulos funcionais
- Implementação de padrões de design responsivo para todas as telas

## Funcionalidades Principais

1. Sistema de autenticação completo com:
   - Login/Logout
   - Recuperação de senha
   - Gerenciamento de perfil
   - Controle de acesso baseado em perfis (RBAC)

## Integrações
- API RESTful NestJS para operações de negócio e todas as operações de dados
- Supabase apenas para autenticação

## Design e UX
- Interface moderna e profissional
- Esquema de cores corporativo (tons de azul e cinza)
- Design responsivo para desktop, tablet e mobile
- Foco em usabilidade e acessibilidade
```

### Prompt Específico para Autenticação e Integração com Supabase

```
Implemente o módulo de autenticação para o Sistema Giusti Gestão de Créditos utilizando Supabase com as seguintes especificações:

## Requisitos de Autenticação
- Autenticação via email/senha
- Proteção de rotas baseada em autenticação
- Sistema de RBAC (Role-Based Access Control) com os seguintes perfis:
  - Administrador: acesso completo ao sistema

## Integração com Supabase
- Configuração do cliente Supabase no frontend
- Implementação de hooks personalizados para autenticação
- Armazenamento seguro de tokens JWT
- Refresh automático de tokens
- Interceptores para adicionar tokens em requisições à API

## Fluxos de Autenticação
- Login com validação de campos
- Recuperação de senha
- Redirecionamento após login para última página acessada
- Logout com limpeza de dados de sessão
- Verificação de sessão ativa

## Segurança
- Proteção contra CSRF
- Validação de tokens no lado cliente
- Expiração adequada de sessões
- Armazenamento seguro de tokens

## Componentes de UI para Autenticação
- Página de login responsiva e moderna
- Formulário de recuperação de senha
- Feedback visual para estados de erro e sucesso
- Modal de confirmação para logout
```

## 2. Configuração da Autenticação no Supabase

### 2.1 Criação do Projeto no Supabase

1. **Criar novo projeto no Supabase**
   - Acessar o dashboard do Supabase (https://app.supabase.io)
   - Criar novo projeto com nome "gestao-credito"
   - Selecionar região mais próxima (preferencialmente São Paulo, Brasil)
   - Configurar senha forte para o banco de dados PostgreSQL

2. **Configuração de Segurança**
   - Configurar tempo de expiração de tokens JWT (2 horas)
   - Configurar refresh tokens (14 dias)
   - Implementar validação de tokens no backend NestJS

### 2.2 Configuração de Perfis de Usuário

O Supabase será utilizado apenas para autenticação, enquanto o banco de dados será gerenciado pelo backend NestJS. No entanto, precisamos configurar os perfis de usuário para o RBAC:

1. **Perfis de Usuário**
   - Administrador: acesso completo ao sistema

2. **Armazenamento de Perfis**
   - Os perfis serão armazenados como claims nos tokens JWT
   - O backend NestJS será responsável por validar esses claims e aplicar as restrições de acesso
   - Ao criar um usuário no Supabase, o perfil inicial será definido como 'Administrador'

### 2.3 Configuração de Autenticação no Supabase

1. **Configuração de Provedores de Autenticação**
   - Email/senha (principal)

2. **Configuração de Templates de Email**
   - Email de confirmação
   - Email de recuperação de senha
   - Email de convite

3. **Configuração de Redirecionamentos**
   - URLs de redirecionamento após confirmação
   - URLs de redirecionamento após recuperação de senha

4. **Configuração de Webhooks**
   - Webhook para eventos de autenticação
   - Integração com sistema de logs

## 3. Implementação do Fluxo de Autenticação Básico

### 3.1 Estrutura de Arquivos no Frontend

```
src/
│à── pages/
│   │à── auth/
│   │   │à── login.tsx
│   │   │à── register.tsx
│   │   │à── forgot-password.tsx
│   │   └── reset-password.tsx
│   │à── dashboard/
│   │   └── index.tsx
│   │à── _app.tsx
│   └── index.tsx
│à── components/
│   │à── auth/
│   │   │à── LoginForm.tsx
│   │   │à── RegisterForm.tsx
│   │   └── PasswordResetForm.tsx
│   │à── layout/
│   │   │à── Header.tsx
│   │   └── Footer.tsx
│   └── ui/
│       └── [componentes shadcn/ui]
│à── lib/
│   │à── supabase/
│   │   │à── client.ts
│   │   └── auth.ts
│   └── utils.ts
└── routes/
    └── ProtectedRoute.tsx
```

### 3.2 Implementação do Cliente Supabase

**`lib/supabase/client.ts`**
```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL as string;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

### 3.3 Implementação do Componente de Rota Protegida

**`routes/ProtectedRoute.tsx`**
```typescript
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Redirecionar para login se não estiver autenticado
        navigate('/auth/login', { 
          state: { redirectTo: window.location.pathname } 
        });
      }
    };
    
    checkAuth();
  }, [navigate]);

  return <>{children}</>;
};

// Uso em rotas:
// <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
```

### 3.4 Implementação do Componente de Login

**`components/auth/LoginForm.tsx`**
```tsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo || '/dashboard';
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    navigate(redirectTo);
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="seu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="link"
              className="px-0"
              onClick={() => router.push('/forgot-password')}
            >
              Esqueceu a senha?
            </Button>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
```

### 3.5 Implementação do Hook de Autenticação

**`lib/supabase/auth.ts`**
```typescript
'use client';

import { useRouter } from 'next/navigation';
import { createClient } from './client';
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erro ao obter sessão:', error);
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return {
    user,
    session,
    loading,
    signOut,
  };
}
```

## 4. Próximos Passos

1. **Fase 1: Configuração Inicial**
   - [x] Definir prompt para lovable.dev
   - [ ] Criar projeto no Supabase (apenas para autenticação)
   - [ ] Configurar serviço de autenticação
   - [ ] Criar projeto Next.js via lovable.dev

2. **Implementação da Autenticação**
   - [ ] Configurar provedores de autenticação no Supabase
   - [ ] Implementar componentes de autenticação no frontend
   - [ ] Configurar middleware para proteção de rotas
   - [ ] Implementar sistema RBAC

3. **Integração com API Backend**
   - [ ] Configurar cliente HTTP para comunicação com API NestJS
   - [ ] Implementar interceptores para inclusão de tokens JWT
   - [ ] Criar hooks para consumo de endpoints da API

4. **Testes e Validação**
   - [ ] Testar fluxos de autenticação
   - [ ] Validar proteção de rotas
   - [ ] Verificar funcionamento do RBAC
   - [ ] Testar integração com API backend

---

Este documento serve como guia para a implementação do frontend do Sistema de Gestão de Créditos utilizando o serviço lovable.dev. Os prompts e códigos fornecidos devem ser adaptados conforme necessário durante o desenvolvimento.
