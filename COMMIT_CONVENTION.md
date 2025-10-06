# Commit Message Guidelines

## Formato

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Types

- **feat**: Nova funcionalidade para o usuário
- **fix**: Correção de bug
- **docs**: Mudanças na documentação
- **style**: Formatação, falta de ponto e vírgula, etc (sem mudança de código)
- **refactor**: Refatoração de código (sem adicionar funcionalidade ou corrigir bugs)
- **perf**: Mudanças que melhoram a performance
- **test**: Adição ou correção de testes
- **build**: Mudanças no sistema de build ou dependências externas
- **ci**: Mudanças em arquivos de configuração de CI
- **chore**: Outras mudanças que não modificam src ou arquivos de teste
- **revert**: Reverte um commit anterior

## Scopes (Opcional)

Exemplos de escopos para este projeto:

- **auth**: Sistema de autenticação
- **user**: Funcionalidades de usuário
- **workout**: Funcionalidades de treino
- **exercise**: Funcionalidades de exercícios
- **plan**: Funcionalidades de planos
- **prisma**: Schema do Prisma e migrações
- **config**: Configurações do projeto
- **middleware**: Middlewares
- **types**: Types

## Exemplos

### Exemplos Bons ✅

```
feat(auth): add JWT authentication middleware
fix(user): resolve password hashing bug on update
docs: update README with installation instructions
refactor(repository): extract user queries to repository layer
perf(workout): optimize exercise loading with eager loading
test(auth): add unit tests for JWT validation
build: upgrade Prisma to v6.16.3
chore: configure ESLint and Prettier
```

### Exemplos Ruins ❌

```
Update stuff
Fixed bug
WIP
changes
asdfgh
Updated user controller
```

## Descrição

- Use o imperativo, tempo presente: "add" não "added" nem "adds"
- Não capitalize a primeira letra
- Sem ponto final (.)
- Máximo de 72 caracteres na primeira linha
- Se necessário, adicione um corpo explicativo após uma linha em branco

## Body (Opcional)

Use o body para explicar **o que** e **por que** versus **como**.

```
feat(auth): add JWT authentication middleware

Implements RS256 JWT validation using Passport.js strategy.
Extracts user ID and role from token payload and attaches
to req.token_user for downstream controllers.

This replaces the manual token validation and improves
security by leveraging battle-tested Passport.js ecosystem.
```

## Footer (Opcional)

Use o footer para referenciar issues, breaking changes, etc.

```
feat(user): migrate to repository pattern

BREAKING CHANGE: UserController now depends on UserRepository
instead of direct Prisma access. Update imports accordingly.

Closes #42
```

## Validação Automática

Este projeto usa **commitlint** para validar mensagens de commit automaticamente.

Para fazer um commit:

```bash
# Usando git commit normal
git commit -m "feat(auth): add JWT middleware"

# Se a mensagem estiver incorreta, o commit será rejeitado
```