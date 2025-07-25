# ToDo Pro - Backend (Laravel)

API RESTful para gerenciamento de tarefas, usuários e logs de atividades.

## Stack
- **Laravel**
- **MySQL**
- **Sanctum** (autenticação JWT)

## Instalação

1. Clone o repositório e acesse a pasta do backend
2. Instale as dependências:
   ```sh
   composer install
   ```
3. Copie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente (banco, mail, etc)
4. Gere a key:
   ```sh
   php artisan key:generate
   ```
5. Rode as migrations:
   ```sh
   php artisan migrate
   ```
6. Popule o banco com seeders:
   ```sh
   php artisan db:seed
   ```
7. Inicie o servidor:
   ```sh
   php artisan serve
   ```

## Integração com o frontend
- O frontend Vue espera que a API esteja rodando em `http://127.0.0.1:8000/api`.
- O login retorna um token JWT para ser usado nas requisições autenticadas.

## Rotas principais

```php
// Health check
GET    /health

// Auth
POST   /login
POST   /user
POST   /logout (auth:sanctum)

// Usuários (auth:sanctum, prefix: users)
GET    /users
GET    /users/{id}
PUT    /users/{id}
DELETE /users/{id}

// Tarefas (auth:sanctum)
GET    /tasks
POST   /tasks
GET    /tasks/{id}
PUT    /tasks/{id}
DELETE /tasks/{id}
PUT    /tasks/{id}/complete
GET    /tasks/status
GET    /tasks/search
GET    /task/pdf

// Logs de atividades (auth:sanctum)
GET    /logs
GET    /logs/pdf

// Usuário autenticado
GET    /user (auth:sanctum)
```

## Dicas
- Para acessar rotas de admin, crie um usuário com `is_admin = true`.
- Os seeders criam usuários e tarefas de exemplo.
- O sistema de logs registra ações importantes dos usuários.

---

Feito com ♥ por [Seu Nome]. 