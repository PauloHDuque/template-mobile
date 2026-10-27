# Estrutura de Pastas - Template Mobile (Expo SDK 58)

## Visão Geral

```text
template-mobile/
├── app/                     # Rotas e telas baseadas em Expo Router (file-system routing)
│   ├── (auth)/              # Grupo de rotas não autenticadas
│   │   ├── _layout.tsx      # Layout e Stack navigator da autenticação
│   │   └── login.tsx        # Tela genérica de Login
│   ├── (app)/               # Grupo de rotas autenticadas (protegidas)
│   │   ├── _layout.tsx      # Layout e navegação da área autenticada
│   │   └── index.tsx        # Tela inicial protegida (Dashboard / Perfil)
│   └── _layout.tsx          # Root Layout com AuthProvider, SafeArea e Route Guards
├── src/
│   ├── components/          # Componentes reutilizáveis (Button, Input, etc.)
│   ├── contexts/            # Contextos React (AuthContext)
│   ├── services/            # Serviços de API e comunicação externa
│   │   ├── api.ts           # Cliente Axios configurado com interceptors e suporte a cookies/bearer
│   │   └── auth.service.ts  # Métodos de autenticação (login, profile, logout)
│   ├── storage/             # Armazenamento seguro de tokens e credenciais
│   │   └── token.storage.ts # Wrapper do Expo SecureStore com fallback e chaves válidas
│   └── types/               # Tipagens TypeScript (Auth, User, etc.)
├── test/
│   ├── unit/                # Testes unitários (Storage, API, Context)
│   ├── integration/         # Testes de integração (Fluxo de login e sessão)
│   └── e2e/                 # Especificações de testes E2E e fluxo Maestro
├── .husky/                  # Git hooks (commit-msg, pre-commit, pre-push)
├── commitlint.config.cjs    # Regras do Commitlint (Conventional Commits)
├── eslint.config.mjs        # Configuração do ESLint (flat config)
├── .prettierrc              # Configuração do Prettier
├── tsconfig.json            # Configuração do TypeScript com path aliases (@/* e @app/*)
├── app.json                 # Configuração do Expo SDK 58
└── package.json             # Dependências e scripts do projeto
```

## Arquitetura Expo Router (app/)

O template mobile adota estritamente o **Expo Router (File-based Routing)** na pasta `app/`, eliminando a necessidade da pasta legada `screens`.

- `_layout.tsx`: O layout raiz encapsula toda a aplicação com `SafeAreaProvider` e `AuthProvider`. Ele monitora o estado de autenticação através do hook `useAuth()` e dos `segments` de rota do Expo Router, redirecionando automaticamente usuários não autenticados para `/(auth)/login` e usuários autenticados para `/(app)`.
- `(auth)/`: Grupo de rotas públicas/não autenticadas.
- `(app)/`: Grupo de rotas privadas protegidas pelo guard do layout raiz.

## Camada de Serviços e Comunicação (src/services/)

- `api.ts`: Centraliza a instância do Axios com baseURL dinâmica (tratando diferenças de host para emulador Android `10.0.2.2`, iOS Simulator `localhost` e Web), injetando o token nos headers de `Authorization` (Bearer) e no header `Cookie: access_token=...` para total compatibilidade com backends baseados em cookie como o `template-backend-nest`.
- `auth.service.ts`: Isola as chamadas HTTP de login e sessão, extraindo tokens tanto do corpo JSON quanto dos cabeçalhos `Set-Cookie`.

## Armazenamento Seguro (src/storage/)

Utiliza o `expo-secure-store` para persistir dados sensíveis e credenciais no iOS Keychain e Android Keystore de forma cifrada por hardware. As chaves respeitam as restrições de formato do SecureStore (`^[a-zA-Z0-9_.-]+$`).
