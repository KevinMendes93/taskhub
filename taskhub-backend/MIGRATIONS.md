# Migrations - TaskHub Backend

## Visão Geral

Este projeto usa TypeORM para gerenciar migrações do banco de dados. As migrations garantem que o schema do banco de dados seja versionado e reproduzível entre ambientes.

## Ambiente de Desenvolvimento

No desenvolvimento, o projeto está configurado com `synchronize: true`, o que significa que o TypeORM automaticamente sincroniza o schema do banco com as entidades.

## Ambiente de Produção

Em produção, **SEMPRE** use migrations ao invés de `synchronize: true`. 

### Pré-requisitos

1. Configure a variável de ambiente `ENV` diferente de `'development'`
2. Certifique-se de que as credenciais do banco de dados estão corretas
3. Faça backup do banco antes de executar migrations em produção

### Comandos Disponíveis

```bash
# Gerar uma nova migration baseada nas mudanças das entidades
npm run migration:generate -- src/migrations/NomeDaMigration

# Criar uma migration vazia (para SQL customizado)
npm run migration:create -- src/migrations/NomeDaMigration

# Executar migrations pendentes (desenvolvimento)
npm run migration:run

# Executar migrations pendentes (produção - usa código compilado)
npm run migration:run:prod

# Reverter a última migration executada
npm run migration:revert

# Mostrar migrations executadas e pendentes
npm run migration:show
```

### Processo de Deploy em Produção

1. **Build do projeto:**
   ```bash
   npm run build
   ```

2. **Executar migrations:**
   ```bash
   npm run migration:run:prod
   ```

3. **Iniciar a aplicação:**
   ```bash
   npm run start:prod
   ```

### Migration Inicial - CompleteSchema

A migration `CompleteSchema` (timestamp: 1765492640360) cria toda a estrutura inicial do banco:

#### Tabelas Criadas:
- **user**: Usuários do sistema
  - Campos: id, cpf (unique), email (unique), name, createdAt, updatedAt, roles (array enum)
  
- **account**: Contas de acesso dos usuários
  - Campos: id, login (unique), password, refreshTokenHash, user_id (FK)
  - Relacionamento: 1:1 com User (CASCADE on delete)

- **category**: Categorias de tarefas
  - Campos: id, name, description, user_id (FK)
  - Relacionamento: N:1 com User (CASCADE on delete)

- **tasks**: Tarefas dos usuários
  - Campos: id, title, description, status (enum), due_date (date), createdAt, updatedAt, user_id (FK), category_id (FK)
  - Relacionamentos: N:1 com User e Category (CASCADE on delete)

#### ENUMs Criados:
- `user_roles_enum`: 'admin', 'user'
- `tasks_status_enum`: 'pending', 'in_progress', 'completed'

### Rollback

Se algo der errado, você pode reverter a última migration:

```bash
npm run migration:revert
```

⚠️ **ATENÇÃO**: O rollback apaga TODAS as tabelas e dados! Use com extremo cuidado em produção.

### Boas Práticas

1. **Sempre teste migrations em ambiente de staging primeiro**
2. **Faça backup do banco antes de executar migrations em produção**
3. **Nunca edite uma migration já executada em produção**
4. **Crie novas migrations para mudanças incrementais**
5. **Use nomes descritivos para suas migrations**
6. **Revise o SQL gerado antes de executar**

### Troubleshooting

#### Erro: "Cannot find module 'src/entities/...'"
- Certifique-se de que o `tsconfig-paths` está instalado
- Verifique se o `tsconfig.json` tem a configuração de paths correta

#### Migration já existe no banco mas não no código
- Use `npm run migration:show` para ver o estado
- Sincronize manualmente ou crie uma migration para ajustar

#### Schema diferente entre dev e prod
- Sempre gere migrations a partir do ambiente de desenvolvimento
- Execute `npm run migration:generate` para detectar diferenças

## Estrutura de Arquivos

```
src/
├── migrations/                         # Todas as migrations
│   └── 1765492640360-CompleteSchema.ts # Migration inicial
├── data-source.ts                      # Configuração do DataSource
└── entities/                           # Entidades que geram o schema
```

## Configuração do DataSource

O arquivo `src/data-source.ts` contém a configuração do TypeORM para migrations:

- **entities**: Carregadas automaticamente de `**/*.entity.{ts,js}`
- **migrations**: Carregadas de `migrations/*{.ts,.js}`
- **synchronize**: Sempre `false` no DataSource (controlado por ENV no app.module.ts)

## Referências

- [TypeORM Migrations Documentation](https://typeorm.io/migrations)
- [NestJS Database](https://docs.nestjs.com/techniques/database)
