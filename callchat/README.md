# CallChat - Mini Discord

Um sistema de chat em tempo real inspirado no Discord, construído com Go, Vue 3 e WebSockets.

## Stack Tecnológica

**Backend:**
- Go 1.25
- Gin (HTTP framework)
- PostgreSQL 16 (database)
- JWT (autenticação)
- gorilla/websocket (real-time)
- golang-migrate (migrations)

**Frontend:** (Em desenvolvimento)
- Vue 3 + TypeScript
- Vuetify 3
- Pinia (state management)
- WebSocket API

**Infraestrutura:**
- Docker & docker-compose
- PostgreSQL

---

## Estado Atual - FASE 1 COMPLETA ✅

### O que foi implementado:

#### Backend
- ✅ Sistema de autenticação completo com JWT
- ✅ Registro de usuários com validação
- ✅ Login com geração de tokens (access + refresh)
- ✅ Middleware de autenticação para proteger rotas
- ✅ Hash de senhas com bcrypt (cost 12)
- ✅ Migrations automáticas do banco de dados
- ✅ CORS configurado para desenvolvimento

#### Database
- ✅ Schema PostgreSQL completo:
  - users (id, username, email, password_hash, timestamps)
  - friendships (relação many-to-many com status)
  - messages (chat messages com timestamps)
  - refresh_tokens (para renovação de JWT)
- ✅ Indexes otimizados
- ✅ Sistema de migrations com rollback

#### API Endpoints Implementados

**Públicos:**
- `POST /v1/auth/register` - Registrar novo usuário
- `POST /v1/auth/login` - Login e receber tokens JWT
- `GET /v1/health` - Health check

**Protegidos (requer JWT):**
- `GET /v1/users/me` - Obter perfil do usuário atual
- `GET /v1/users/search?q=username` - Buscar usuários

---

## Como Rodar

### Pré-requisitos
- Docker Desktop instalado e rodando
- Go 1.25+ (para desenvolvimento local)
- PostgreSQL 16 (se não usar Docker)

### Opção 1: Docker (Recomendado)

```bash
# Iniciar todos os serviços
docker-compose up --build

# Apenas o banco de dados
docker-compose up -d postgres

# Parar todos os serviços
docker-compose down

# Parar e remover volumes (limpa o banco)
docker-compose down -v
```

A API estará disponível em: `http://localhost:8080`

### Opção 2: Desenvolvimento Local

```bash
# 1. Iniciar PostgreSQL
docker-compose up -d postgres

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env se necessário

# 3. Rodar o backend
cd backend
export $(cat ../.env | xargs)  # Linux/Mac
# ou configure manualmente as variáveis no Windows

go run ./cmd/api
```

---

## Testando a API

### 1. Registrar um usuário

```bash
curl -X POST http://localhost:8080/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "senha123"
  }'
```

Resposta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:8080/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "senha123"
  }'
```

### 3. Acessar rota protegida

```bash
# Use o access_token recebido no registro/login
curl -X GET http://localhost:8080/v1/users/me \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_AQUI"
```

### 4. Buscar usuários

```bash
curl -X GET "http://localhost:8080/v1/users/search?q=test" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_AQUI"
```

---

## Variáveis de Ambiente

```env
# Database
DATABASE_URL=postgres://callchat:callchat_password@localhost:5432/callchat?sslmode=disable

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_ACCESS_EXPIRY=15m      # Access token expira em 15 minutos
JWT_REFRESH_EXPIRY=168h    # Refresh token expira em 7 dias

# Server
GIN_MODE=debug             # use "release" em produção
PORT=8080
```

---

## Estrutura do Projeto

```
callchat/
├── backend/
│   ├── cmd/api/
│   │   └── main.go                 # Entry point
│   ├── internal/
│   │   ├── auth/
│   │   │   ├── jwt.go              # Geração/validação JWT
│   │   │   ├── middleware.go       # Middleware de auth
│   │   │   └── password.go         # Hash bcrypt
│   │   ├── database/
│   │   │   ├── connection.go       # Pool PostgreSQL
│   │   │   └── migrations.go       # Runner de migrations
│   │   ├── users/
│   │   │   ├── models.go           # User model
│   │   │   ├── repository.go       # DB operations
│   │   │   ├── service.go          # Business logic
│   │   │   ├── handler.go          # HTTP handlers
│   │   │   └── dto.go              # Request/Response DTOs
│   │   └── http/
│   │       └── router.go           # Configuração de rotas
│   ├── migrations/
│   │   ├── 000001_create_users_table.up.sql
│   │   ├── 000002_create_friendships_table.up.sql
│   │   ├── 000003_create_messages_table.up.sql
│   │   └── 000004_create_refresh_tokens_table.up.sql
│   ├── Dockerfile
│   ├── go.mod
│   └── go.sum
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## Próximas Fases

### FASE 2: Sistema de Amizades
- Enviar/aceitar/rejeitar friend requests
- Listar amigos
- Bloquear usuários

### FASE 3: Chat em Tempo Real (WebSocket)
- Implementar WebSocket Hub
- Enviar/receber mensagens em tempo real
- Persistência de mensagens
- Histórico de conversas

### FASE 4-5: Frontend Vue
- Interface de Login/Registro
- Tela de Chat
- Gerenciamento de Amigos
- Integração WebSocket

### FASE 6-7: Docker & Polish
- Dockerfile do frontend
- Nginx para servir o frontend
- Segurança e otimizações

---

## Segurança

- ✅ Senhas hasheadas com bcrypt (cost 12)
- ✅ JWT com expiração (15min access, 7d refresh)
- ✅ Proteção contra SQL injection (pgx prepared statements)
- ✅ CORS configurado
- ✅ Validação de input em todos os endpoints

**Pendente:**
- Rate limiting
- Refresh token rotation
- HTTPS em produção

---

## Troubleshooting

### Docker não inicia
```bash
# Verifique se o Docker Desktop está rodando
docker ps

# Se não estiver, inicie o Docker Desktop manualmente
```

### Migrations falham
```bash
# Limpe o banco e recrie
docker-compose down -v
docker-compose up -d postgres

# Aguarde alguns segundos e tente novamente
```

### Erro de conexão com o banco
```bash
# Verifique se o PostgreSQL está rodando
docker-compose ps

# Verifique a variável DATABASE_URL
echo $DATABASE_URL
```

---

## Contribuindo

Este é um projeto educacional. Sinta-se à vontade para:
- Reportar bugs
- Sugerir melhorias
- Fazer fork e experimentar

---

## Licença

MIT
