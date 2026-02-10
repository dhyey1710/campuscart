# CampusCart — Full-Stack Upgrade 🎓

PostgreSQL + Prisma ORM | Socket.io Real-Time Chat | Framer Motion UI

---

## Setup

### 1. Install dependencies

```bash
# Frontend (project root)
npm install

# Backend
cd backend && npm install
```

### 2. Configure backend

```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL URL
```

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/campuscart"
JWT_SECRET="any-long-random-string"
CLIENT_URL="http://localhost:3000"
PORT=5000
```

### 3. Run Prisma migrations

```bash
cd backend
npx prisma generate          # generates Prisma client
npx prisma migrate dev --name init  # creates all tables
npx prisma studio            # (optional) visual DB editor
```

### 4. Start both servers

```bash
# Terminal 1 — backend
cd backend && npm run dev   # http://localhost:5000

# Terminal 2 — frontend
npm run dev                 # http://localhost:3000
```

---

## What was added / changed

| Area | Change |
|------|--------|
| **Schema** | 4-table PostgreSQL schema: users, items, messages, wishlist with FK relationships |
| **Prisma** | Full ORM setup, singleton client, migrations |
| **Socket.io** | Real-time buyer↔seller chat with rooms, typing indicators, read receipts |
| **Auth** | Register/login with bcrypt + JWT, .edu email validation |
| **Framer Motion** | Spring modal animations, staggered card reveals, whileHover lifts |
| **Loading skeletons** | 8-card animated pulse grid while fetching |
| **Page overlap** | Fixed — layout uses pt-16 to match fixed h-16 navbar |
| **Typography** | Syne font (geometric, modern) |
| **Chat UI** | Full-screen mobile-friendly chat modal with typing dots, avatars, timestamps |
