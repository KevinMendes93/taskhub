# TaskHub - Gerenciador de Tarefas

Sistema completo de gerenciamento de tarefas desenvolvido com NestJS (backend) e Next.js (frontend).

## 📦 Estrutura do Projeto

```
taskhub/
├── taskhub-backend/     # API REST com NestJS
└── taskhub-frontend/    # Interface com Next.js
```

## 🚀 Tecnologias

### Backend
- **NestJS** - Framework Node.js progressivo
- **TypeScript** - Superset JavaScript com tipagem estática
- **JWT** - Autenticação via JSON Web Tokens
- **TypeORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional

### Frontend
- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset JavaScript com tipagem estática
- **Tailwind CSS** - Framework CSS utility-first
- **Axios** - Cliente HTTP para requisições à API

## 🔧 Instalação Completa

### 1. Backend

```bash
cd taskhub-backend
npm install
# Configurar banco de dados no arquivo .env
npm run start:dev
```

O backend estará disponível em [http://localhost:3000](http://localhost:3000)

### 2. Frontend

```bash
cd taskhub-frontend
npm install
# Verificar .env.local (NEXT_PUBLIC_API_URL=http://localhost:3000)
npm run dev
```

O frontend estará disponível em [http://localhost:3001](http://localhost:3001)

## 📋 Funcionalidades Implementadas

### Autenticação
- ✅ Registro de novos usuários
- ✅ Login com JWT
- ✅ Proteção de rotas
- ✅ Logout

### Frontend
- ✅ Página de login com validação
- ✅ Página de cadastro completo
- ✅ Dashboard principal com estatísticas
- ✅ Proteção automática de rotas
- ✅ Interceptors para autenticação
- ✅ Gerenciamento de tokens via cookies

### Backend
- ✅ API RESTful completa
- ✅ CRUD de Usuários
- ✅ CRUD de Tarefas
- ✅ CRUD de Categorias
- ✅ Autenticação JWT
- ✅ Guards de proteção
- ✅ Validação de dados
- ✅ Tratamento de erros

## 🎯 Endpoints da API

### Autenticação
- `POST /auth/register` - Cadastro de usuário
- `POST /auth/login` - Login
- `POST /auth/reset-password` - Reset de senha

### Usuários
- `GET /user` - Listar usuários
- `GET /user/:id` - Buscar usuário
- `PATCH /user/:id` - Atualizar usuário
- `DELETE /user/:id` - Deletar usuário

### Tarefas
- `GET /task` - Listar tarefas
- `GET /task/:id` - Buscar tarefa
- `POST /task` - Criar tarefa
- `PATCH /task/:id` - Atualizar tarefa
- `DELETE /task/:id` - Deletar tarefa

### Categorias
- `GET /category` - Listar categorias
- `GET /category/:id` - Buscar categoria
- `POST /category` - Criar categoria
- `PATCH /category/:id` - Atualizar categoria
- `DELETE /category/:id` - Deletar categoria

## 🔐 Fluxo de Autenticação

1. Usuário acessa o frontend (`http://localhost:3001`)
2. Se não autenticado, é redirecionado para `/login`
3. Pode fazer login ou ir para `/cadastro`
4. Após login bem-sucedido, recebe um JWT token
5. Token é armazenado em cookie (httpOnly=false para acesso JS)
6. Todas as requisições incluem o token automaticamente
7. Backend valida o token e autoriza acesso
8. Se token inválido/expirado, usuário é redirecionado para login

## 🎨 Telas do Frontend

### Home (/)
- Redirecionamento inteligente baseado em autenticação

### Login (/login)
- Formulário de autenticação
- Validação em tempo real
- Mensagens de erro amigáveis
- Link para cadastro

### Cadastro (/cadastro)
- Formulário completo com:
  - Nome completo
  - E-mail
  - CPF (com formatação automática)
  - Login
  - Senha (mínimo 8 caracteres)
  - Confirmação de senha
- Login automático após cadastro
- Link para página de login

### Dashboard (/principal)
- Estatísticas em cards:
  - Tarefas Pendentes
  - Tarefas Concluídas
  - Categorias
- Ações rápidas:
  - Nova Tarefa
  - Ver Tarefas
  - Categorias
  - Configurações
- Seção de atividade recente
- Botão de logout

## 🛠️ Desenvolvimento

### Executar ambos os servidores

Terminal 1 (Backend):
```bash
cd taskhub-backend
npm run start:dev
```

Terminal 2 (Frontend):
```bash
cd taskhub-frontend
npm run dev
```

### Estrutura de Pastas

**Backend:**
```
src/
├── entities/          # Entidades e módulos de domínio
├── security/          # Autenticação e guards
├── common/            # DTOs e utilitários compartilhados
├── decorators/        # Decorators customizados
├── enums/             # Enumerações
└── validators/        # Validadores customizados
```

**Frontend:**
```
src/
├── app/              # Páginas e rotas (App Router)
└── services/         # Serviços de API e autenticação
```

## 🔒 Segurança

- Senhas hashadas com bcrypt
- JWT para autenticação stateless
- Guards de proteção em rotas sensíveis
- Validação de dados no backend
- Proteção contra injeção SQL (TypeORM)
- CORS configurado
- Cookies seguros

## 🎯 Próximas Funcionalidades

### Backend
- [ ] Refresh tokens
- [ ] Rate limiting
- [ ] Logs de auditoria
- [ ] Upload de arquivos

### Frontend
- [ ] Implementar CRUD completo de tarefas
- [ ] Implementar CRUD completo de categorias
- [ ] Filtros e busca avançada
- [ ] Paginação
- [ ] Notificações toast
- [ ] Tema dark/light
- [ ] Perfil de usuário
- [ ] Dashboards com gráficos

## 🐛 Solução de Problemas

### Backend não inicia
- Verifique se o PostgreSQL está rodando
- Verifique as credenciais no arquivo `.env`
- Verifique se a porta 3000 está livre

### Frontend não conecta ao backend
- Verifique se o backend está rodando na porta 3000
- Verifique a variável `NEXT_PUBLIC_API_URL` no `.env.local`
- Verifique se há CORS habilitado no backend

### Erro de autenticação
- Limpe os cookies do navegador
- Verifique se o token JWT não expirou
- Tente fazer login novamente

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais.

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no repositório.
