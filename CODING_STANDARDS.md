# Padrões de Código - Template Mobile

## Nomenclatura

- Variáveis e funções devem usar `camelCase`.
- Componentes e Telas devem usar `PascalCase`.
- Arquivos de utilitários e serviços devem usar `kebab-case` ou `camelCase` (ex: `api.ts`, `auth.service.ts`, `token.storage.ts`).
- Pastas devem usar `kebab-case` ou convenção do Expo Router (ex: `(auth)`, `(app)`).

## Branches

Os nomes das branches devem começar com um dos prefixos abaixo, sempre seguido por uma barra:

- `feature/`
- `bugfix/`
- `release/`
- `hotfix/`
- `support/`

Exemplo: `feature/adiciona-autenticacao-mobile`.

## Commits

As mensagens de commit devem seguir o formato Conventional Commits:

```text
<type>: <description>
```

### Tipos Permitidos

- `feat` - Adiciona uma nova funcionalidade.
- `fix` - Corrige um defeito.
- `docs` - Altera a documentação.
- `perf` - Melhora o desempenho.
- `style` - Altera formatação ou espaços sem modificar o comportamento.
- `refactor` - Altera o código sem corrigir defeitos ou adicionar funcionalidades.
- `test` - Adiciona ou modifica testes.
- `chore` - Altera tarefas de build, configurações ou dependências.

### Descrição

A descrição deve ser clara, concisa e escrita na terceira pessoa do presente do indicativo.

Exemplos:

- `feat: adiciona fluxo de login com secure store`
- `fix: corrige validacao de chaves no secure store`
- `test: adiciona testes unitarios de autenticacao`

O commitlint valida o padrão por meio do hook `commit-msg` do Husky. O hook `pre-commit` executa o lint-staged, enquanto o hook `pre-push` executa lint e testes.
