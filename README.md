# TaskHub

Gerenciador de tarefas fullstack com NestJS (backend) e Next.js (frontend).

## Estrutura do projeto

```
taskhub/
├── taskhub-backend/   # API REST (NestJS)
├── taskhub-frontend/  # Frontend web (Next.js)
└── .devcontainer/     # Configuração para Dev Containers (Docker)
```

- Backend: ver detalhes em [taskhub-backend](taskhub-backend/README.md)
- Frontend: ver detalhes em [taskhub-frontend](taskhub-frontend/README.md)

## Tecnologias principais

- Node.js / TypeScript
- NestJS, TypeORM, PostgreSQL, JWT
- Next.js 15, React 19, Tailwind CSS

---

## Como rodar localmente (sem Docker)

### 1. Clonar o repositório

```bash
git clone <url-do-repo>
cd taskhub
```

### 2. Backend (API NestJS)

```bash
cd taskhub-backend
npm install
cp .env.example .env   # se existir
# configure as variáveis de ambiente (PostgreSQL, JWT etc.)
npm run start:dev
```

API disponível em http://localhost:3000

### 3. Frontend (Next.js)

Em outro terminal:

```bash
cd taskhub-frontend
npm install
cp .env.example .env.local   # se existir
# defina NEXT_PUBLIC_API_URL=http://localhost:3000
npm run dev
```

Frontend disponível em http://localhost:3001

---

## Como rodar com Docker + Dev Container (VS Code)

Pré‑requisitos:
- Docker instalado e em execução
- VS Code
- Extensão "Dev Containers" (ou "Remote - Containers") instalada

Passos:

1. Abra a pasta `taskhub` no VS Code
2. Use o comando "Dev Containers: Reopen in Container" (Paleta de Comandos)
3. Aguarde o build do container (usa `.devcontainer/devcontainer.json`)
4. Dentro do container, instale e rode backend e frontend:

Backend:
```bash
cd taskhub-backend
npm install
npm run start:dev
```

Frontend (outro terminal dentro do container):
```bash
cd taskhub-frontend
npm install
npm run dev
```

As portas 3000 (API) e 3001 (frontend) são encaminhadas automaticamente pelo Dev Container.

---

## Scripts úteis

Backend (dentro de taskhub-backend):
- `npm run start:dev` – modo desenvolvimento
- `npm run test` – testes unitários (se configurados)

Frontend (dentro de taskhub-frontend):
- `npm run dev` – desenvolvimento
- `npm run build` / `npm start` – produção

---

## Observações

- Verifique os READMEs específicos de backend e frontend para detalhes de rotas, modelos e regras de negócio.
- Certifique‑se de que o banco PostgreSQL está acessível com as credenciais definidas no `.env` do backend.
