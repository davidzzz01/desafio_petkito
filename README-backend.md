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
- `POST   /api/login` — Login do usuário
- `POST   /api/logout` — Logout
- `GET    /api/tasks` — Listar tarefas do usuário logado
- `POST   /api/tasks` — Criar tarefa (apenas admin)
- `PUT    /api/tasks/{id}` — Editar tarefa
- `DELETE /api/tasks/{id}` — Excluir tarefa
- `PUT    /api/tasks/{id}/complete` — Marcar como concluída
- `GET    /api/task/pdf` — Exportar tarefas em PDF
- `GET    /api/users` — Listar usuários (apenas admin)
- `POST   /api/user` — Criar usuário (apenas admin)
- `PUT    /api/users/{id}` — Editar usuário
- `DELETE /api/users/{id}` — Excluir usuário
- `GET    /api/logs` — Listar logs de atividades (apenas admin)
- `GET    /api/logs/pdf` — Exportar logs em PDF

## Dicas
- Para acessar rotas de admin, crie um usuário com `is_admin = true`.
- Os seeders criam usuários e tarefas de exemplo.
- O sistema de logs registra ações importantes dos usuários.

---

Feito com ♥ por [Seu Nome]. 