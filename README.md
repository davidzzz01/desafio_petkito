# ToDo Pro - Frontend

Aplicação web Vue.js para gerenciamento de tarefas, usuários e logs de atividades.

## Stack
- **Vue 3**
- **Vue Router**
- **Axios**
- **Tailwind CSS** (via CDN)

## Funcionalidades
- Login e autenticação via JWT
- CRUD de tarefas (apenas admin pode criar)
- CRUD de usuários (apenas admin)
- Marcar tarefas como concluídas
- Filtros, busca e paginação
- Exportação de tarefas e logs em PDF
- Logs de atividades (ações dos usuários)
- Layout responsivo, tema claro, visual profissional

## Instalação e uso

1. Instale as dependências:
   ```sh
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```sh
   npm run serve
   ```
3. Acesse [http://localhost:8080](http://localhost:8080)

## Integração com a API (Backend Laravel)
- O frontend espera que a API Laravel esteja rodando em `http://127.0.0.1:8000/api`.
- **Importante:** Após rodar as migrations no backend, execute também os seeders para criar usuários e tarefas de exemplo:
  ```sh
  php artisan db:seed
  ```
- O login gera um token JWT salvo no localStorage.
- Para acessar rotas de admin, crie um usuário com `is_admin = true`.
- O botão de exportar PDF funciona mesmo autenticado (usa blob).

## Rotas principais (API)
- `POST   /login` — Login do usuário
- `POST   /logout` — Logout
- `GET    /tasks` — Listar tarefas do usuário logado
- `POST   /tasks` — Criar tarefa (apenas admin)
- `PUT    /tasks/{id}` — Editar tarefa
- `DELETE /tasks/{id}` — Excluir tarefa
- `PUT    /tasks/{id}/complete` — Marcar como concluída
- `GET    /task/pdf` — Exportar tarefas em PDF
- `GET    /users` — Listar usuários (apenas admin)
- `POST   /user` — Criar usuário (apenas admin)
- `PUT    /users/{id}` — Editar usuário
- `DELETE /users/{id}` — Excluir usuário
- `GET    /logs` — Listar logs de atividades (apenas admin)
- `GET    /logs/pdf` — Exportar logs em PDF

---

Feito com ♥ por [Seu Nome]. 