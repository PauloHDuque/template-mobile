# Template Mobile - React Native + Expo SDK 58 📱

Boilerplate corporativo de alta performance e robustez construído com **React Native**, **Expo SDK 58** e **Expo Router**. Projetado para seguir rigorosamente os mesmos padrões arquiteturais, de governança de código e testes estabelecidos nos templates de Backend (`template-backend-nest`) e Frontend (`template-frontend`).

---

## 🛠 Tecnologias & Ferramentas

- **Core**: React Native 0.88, React 19.3, TypeScript 5.8+
- **Framework**: [Expo SDK 58](https://expo.dev) com Nova Arquitetura ativada (`newArchEnabled: true`)
- **Roteamento**: [Expo Router v5](https://docs.expo.dev/router/introduction/) (File-system routing baseado na pasta `app/`, **sem** pasta legada `screens/`)
- **Comunicação HTTP**: [Axios](https://axios-http.com/) com interceptors para tokens Bearer e suporte a Cookies HttpOnly do backend Nest
- **Armazenamento Seguro**: [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/) com fallback seguro para Web e testes
- **Qualidade & Linters**: ESLint 9/10 (Flat Config com TypeScript ESLint), Prettier
- **Governança Git**: Husky 9 (hooks `commit-msg`, `pre-commit`, `pre-push`) e Commitlint (Conventional Commits)
- **Testes**: Jest + `@testing-library/react-native` (Testes Unitários, de Integração e E2E com Maestro)

---

## 📁 Arquitetura de Pastas

```text
template-mobile/
├── app/                         # Rotas e navegação via Expo Router
│   ├── (auth)/                  # Grupo de rotas não autenticadas
│   │   ├── _layout.tsx          # Stack Navigator de Autenticação
│   │   └── login.tsx            # Tela genérica de Login
│   ├── (app)/                   # Grupo de rotas autenticadas (protegidas)
│   │   ├── _layout.tsx          # Stack Navigator da Área Protegida
│   │   └── index.tsx            # Tela Inicial / Perfil pós-login
│   ├── _layout.tsx              # Root Layout: AuthProvider + Route Guards
│   └── index.tsx                # Redirecionamento condicional de rota
├── src/
│   ├── components/              # Componentes visuais reutilizáveis (Button, Input)
│   ├── contexts/                # React Contexts (AuthContext, Session Provider)
│   ├── services/                # Camada de serviços e integração de rede
│   │   ├── api.ts               # Cliente Axios configurado com interceptors
│   │   └── auth.service.ts      # Serviços de Login, Logout e Perfil
│   ├── storage/                 # Armazenamento seguro de credenciais
│   │   └── token.storage.ts     # Wrapper do Expo SecureStore
│   └── types/                   # Tipagens globais do TypeScript
├── test/
│   ├── unit/                    # Testes Unitários (serviços e storage)
│   ├── integration/             # Testes de Integração (fluxo de autenticação)
│   ├── e2e/                     # Testes Ponta a Ponta (telas e Maestro flow)
│   └── jest.setup.ts            # Mocks e setup global do Jest
├── .husky/                      # Git hooks automatizados
├── app.config.ts                # Configuração dinâmica do Expo SDK 58
├── commitlint.config.cjs        # Padrões de mensagens de commit
├── eslint.config.mjs            # ESLint Flat Config
├── .prettierrc                  # Formatação de código
├── tsconfig.json                # Configuração TypeScript e Path Aliases (@/*)
└── package.json                 # Dependências e scripts npm
```

---

## 🔐 Autenticação & Armazenamento Seguro

1. **Expo SecureStore (`src/storage/token.storage.ts`)**:
   - Os tokens JWT e dados de sessão são gravados de forma criptografada no Keychain (iOS) e Keystore/EncryptedSharedPreferences (Android).
   - Chaves formatadas estritamente de acordo com os requisitos nativos (`template_auth_token`), evitando falhas de regex nativo.
   - Possui fallback seguro para ambiente Web e testes automatizados.

2. **Compatibilidade com o Backend NestJS (`src/services/api.ts`)**:
   - O template suporta autenticação mútua:
     - Header `Authorization: Bearer <token>`
     - Header `Cookie: access_token=<token>` (com `withCredentials: true`), mantendo compatibilidade direta com a estratégia de cookies do `template-backend-nest`.
   - Chaveamento dinâmico de host para o backend:
     - **iOS / Web**: `http://localhost:3000`
     - **Emulador Android**: `http://10.0.2.2:3000` (mapeia o localhost da máquina hospedeira)

3. **Guarda de Rotas (Route Guards)**:
   - Gerenciado no `app/_layout.tsx`: usuários não autenticados que tentarem acessar rotas de `/(app)` são redirecionados automaticamente para `/(auth)/login`.
   - Usuários logados são automaticamente encaminhados para `/(app)`.

---

## 🚀 Como Iniciar

### 1. Instalar as dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Copie o arquivo de exemplo:
```bash
cp .env.example .env
```
Defina `EXPO_PUBLIC_API_URL` apontando para a sua instância do `template-backend-nest`.

### 3. Executar o projeto
```bash
# Iniciar o Metro Bundler
npm run start

# Executar no Android (emulador ou dispositivo físico)
npm run android

# Executar no iOS (macOS / simulador)
npm run ios

# Executar versão Web
npm run web
```

---

## 🧪 Suíte de Testes

O template possui testes unitários, de integração e E2E configurados:

```bash
# Rodar todos os testes
npm test

# Rodar apenas testes unitários
npm run test:unit

# Rodar testes de integração
npm run test:integration

# Rodar testes E2E
npm run test:e2e

# Rodar com cobertura de código
npm run test:cov
```

---

## 📐 Padrões de Commit & Branches

Consulte os arquivos [CODING_STANDARDS.md](./CODING_STANDARDS.md) e [ESTRUTURA_DE_PASTAS.md](./ESTRUTURA_DE_PASTAS.md) para detalhes completos sobre convenções de código, branches (`feature/`, `bugfix/`, `release/`, etc.) e mensagens de commit validadas pelo Commitlint e Husky.
