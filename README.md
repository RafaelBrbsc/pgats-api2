# API de Transferências

Esta API permite login, registro de usuários, consulta de usuários e transferência de valores, com regras básicas para aprendizado de testes e automação de APIs.

## Instalação

1. Clone o repositório ou copie os arquivos para seu ambiente.
2. Instale as dependências:
   ```
   npm install express swagger-ui-express
   ```

## Como executar {.tabset}

### Rest
- Para iniciar o servidor Rest:
  ```
  npm run startRest
  ```
- A API Rest estará disponível em `http://localhost:3000`.
- A documentação Swagger estará disponível em `http://localhost:3000/api-docs`.

### GraphQL
- Para iniciar o servidor GraphQL:
  ```
  npm run startGraphQL
  ```
- A API GraphQL estará disponível em `http://localhost:4000/graphql`
- GraphiQL habilitado no mesmo endereço.

## Endpoints {.tabset}

### Rest

#### Registro de usuário
- `POST /register`
  - Body: `{ "username": "string", "password": "string", "favorecido": true|false }`
  - Não permite usuários duplicados.

#### Login
- `POST /login`
  - Body: `{ "username": "string", "password": "string" }`
  - Login e senha obrigatórios.

#### Consulta de usuários
- `GET /users`
  - Retorna todos os usuários cadastrados.

#### Transferência de valores
- `POST /transfer`
  - Body: `{ "from": "string", "to": "string", "amount": number }`
  - Só permite transferências acima de R$ 5.000,00 para usuários favorecidos.

#### Consulta de transferências
- `GET /transfers`
  - Retorna todas as transferências realizadas.

### GraphQL

#### Registro de usuário
- `Mutation register`
  - Args: `( username: string, password: string, favorecido: boolean )`
  - Não permite usuários duplicados.

#### Login
- `Mutation login`
  - Args: `( username: string, password: string )`
  - Login e senha obrigatórios.

#### Consulta de usuários
- `Query users`
  - Retorna todos os usuários cadastrados.

#### Transferência de valores
- `Mutation transfer`
  - Body: `( from: string, to: string, amount: number )`
  - Só permite transferências acima de R$ 5.000,00 para usuários favorecidos.

#### Consulta de transferências
- `Query transfers`
  - Retorna todas as transferências realizadas.

## Observações
- O banco de dados é em memória, os dados são perdidos ao reiniciar o servidor.
