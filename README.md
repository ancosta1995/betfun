# Casino Application

Esta é uma aplicação de cassino completa com backend e frontend.

## Estrutura do Projeto

- `backend/` - API Node.js/Express com MongoDB
- `frontend/` - Aplicação React

## Scripts Disponíveis

### Desenvolvimento

Para iniciar ambos os servidores de desenvolvimento (backend e frontend) simultaneamente:

```bash
npm run dev
```

Para iniciar apenas o servidor backend:

```bash
npm run dev:backend
```

Para iniciar apenas o servidor frontend:

```bash
npm run dev:frontend
```

### Build

Para construir o frontend para produção:

```bash
npm run build
```

### Deploy

Para construir e iniciar a aplicação para produção:

```bash
npm run deploy
```

## Configuração

### Backend

O backend roda na porta `2053` por padrão.

### Frontend

O frontend roda na porta `3000` durante o desenvolvimento e se conecta ao backend na porta `2053`.

Durante a produção, o frontend é servido pelo próprio backend na porta `2053`.