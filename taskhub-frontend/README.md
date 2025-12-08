# TaskHub Frontend

Frontend do sistema TaskHub - Gerenciador de Tarefas desenvolvido com Next.js 15, React 19 e TypeScript.

## 🚀 Tecnologias

- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset JavaScript com tipagem estática
- **Tailwind CSS** - Framework CSS utility-first
- **Axios** - Cliente HTTP para requisições à API
- **js-cookie** - Biblioteca para gerenciamento de cookies

## 📋 Pré-requisitos

- Node.js 18.18 ou superior
- npm ou yarn
- Backend TaskHub rodando (http://localhost:3000)

## 🔧 Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env.local

# Configurar a URL da API no .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🎮 Execução

```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar versão de produção
npm start

# Linting
npm run lint
```

O aplicativo estará disponível em [http://localhost:3001](http://localhost:3001)

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── layout.tsx         # Layout global
│   ├── page.tsx           # Página inicial (redirecionamento)
│   ├── login/             # Página de login
│   ├── cadastro/          # Página de cadastro
│   └── principal/         # Dashboard principal
└── services/              # Serviços da aplicação
    └── api.ts             # Configuração Axios e serviço de autenticação
```

## 🔐 Funcionalidades de Autenticação

### Login
- Endpoint: `POST /auth/login`
- Campos: login, password
- Retorna: access_token (JWT)
- Token armazenado em cookie com duração de 1 dia

### Cadastro
- Endpoint: `POST /auth/register`
- Campos:
  - login (obrigatório)
  - password (obrigatório, mínimo 8 caracteres)
  - user.name (obrigatório)
  - user.email (obrigatório)
  - user.cpf (obrigatório, apenas números)
- Após cadastro, faz login automático

### Logout
- Remove o cookie de autenticação
- Redireciona para página de login

## 🎨 Páginas

### Home (/)
- Redireciona para `/principal` se autenticado
- Redireciona para `/login` se não autenticado

### Login (/login)
- Formulário de autenticação
- Link para página de cadastro
- Validação de campos
- Tratamento de erros da API

### Cadastro (/cadastro)
- Formulário de registro completo
- Validação de senha (mínimo 8 caracteres)
- Confirmação de senha
- Formatação automática de CPF (000.000.000-00)
- Login automático após cadastro bem-sucedido
- Link para página de login

### Principal (/principal)
- Dashboard com estatísticas
  - Tarefas Pendentes
  - Tarefas Concluídas
  - Categorias
- Ações rápidas
  - Nova Tarefa
  - Ver Tarefas
  - Categorias
  - Configurações
- Atividade recente
- Botão de logout
- Proteção por autenticação (redirect se não autenticado)

## 🔒 Proteção de Rotas

O sistema implementa proteção de rotas através de:

1. **Interceptor de Requisições**: Adiciona automaticamente o token JWT no header Authorization
2. **Interceptor de Resposta**: Detecta erros 401 (não autorizado) e redireciona para login
3. **Verificação Client-Side**: Páginas protegidas verificam autenticação no useEffect

## 🌐 Integração com API

### Configuração Base
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
```

### Serviços Disponíveis

```typescript
// Login
authService.login({ login, password })

// Cadastro
authService.register({ 
  login, 
  password, 
  user: { cpf, email, name } 
})

// Logout
authService.logout()

// Verificar autenticação
authService.isAuthenticated()

// Obter token
authService.getToken()

// Definir token
authService.setToken(token)
```

## 🎯 Próximos Passos

- [ ] Implementar CRUD de Tarefas
- [ ] Implementar CRUD de Categorias
- [ ] Adicionar filtros e busca
- [ ] Implementar paginação
- [ ] Adicionar notificações/toasts
- [ ] Implementar tema dark/light
- [ ] Adicionar testes unitários
- [ ] Adicionar testes E2E

## 🐛 Solução de Problemas

### Erro de conexão com API
- Verifique se o backend está rodando na porta 3000
- Verifique a variável `NEXT_PUBLIC_API_URL` no arquivo `.env.local`
- Verifique se há CORS habilitado no backend

### Token expirado
- O sistema detecta automaticamente e redireciona para login
- Cookie expira em 1 dia

### Erros de validação
- CPF deve conter apenas números (formatação automática)
- Senha deve ter no mínimo 8 caracteres
- Todos os campos do cadastro são obrigatórios

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais.
