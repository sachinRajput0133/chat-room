# RealTimeChat

---

## Tech Stack & Decisions

### Monorepo — Turborepo + pnpm Workspaces

**Why:** Managing two apps (frontend + backend) in a single repository keeps shared configuration, scripts, and deployment pipelines unified. Turborepo provides incremental build caching so only changed packages rebuild. pnpm workspaces offer fast, disk-efficient dependency hoisting.

---

### Backend — NestJS (Node.js)

**Why NestJS over plain Express:**
NestJS provides a structured, opinionated architecture with built-in dependency injection, decorators, and modules. This makes the codebase maintainable as it grows. The module system enforces clear separation of concerns (auth, rooms, messages, gateway each in their own module), which aligns with how engineering teams scale code ownership.

**Key backend libraries:**

| Library | Purpose | Why chosen |
|---|---|---|
| `@nestjs/mongoose` | MongoDB ODM | Mongoose schemas integrate cleanly with NestJS DI; schema-level validation via decorators |
| `@nestjs/passport` + `passport-jwt` | JWT authentication strategy | Industry-standard approach; plugs into NestJS Guards with zero boilerplate |
| `@nestjs/jwt` | Token signing/verification | Official NestJS JWT module, pairs seamlessly with passport-jwt strategy |
| `@nestjs/websockets` + `socket.io` | Real-time WebSocket gateway | `@WebSocketGateway` decorator keeps real-time logic co-located with business logic; Socket.IO handles reconnection, fallbacks, and rooms natively |
| `class-validator` + `class-transformer` | DTO validation | Declarative validation via decorators on DTOs; NestJS `ValidationPipe` auto-rejects malformed requests |
| `nest-winston` | Structured logging | Winston is the Node.js logging standard; nest-winston integrates it as NestJS's built-in logger |
| `bcrypt` | Password hashing | Industry-standard adaptive hashing algorithm; resistant to brute-force |

---

### Database — MongoDB (Atlas-compatible)

**Why MongoDB:**
Chat applications have schema-flexible message payloads and participant arrays that grow over time. MongoDB's document model fits this naturally. Mongoose schemas still enforce structure at the application level while allowing flexibility at the storage level.

**Why `$lookup` aggregation over Mongoose `.populate()`:**
Mongoose `populate()` issues multiple sequential queries. The `$lookup` aggregation pipeline resolves joins in a single database round-trip, which is more performant. It also works correctly regardless of whether referenced documents were created before or after schema changes.

---

### Frontend — Next.js 14 (App Router)

**Why Next.js 14 App Router:**
The App Router enables React Server Components for pages that don't need interactivity (layouts, static shell), reducing client-side JavaScript. Route groups `(auth)` and `(main)` allow different layouts per section without affecting URL structure. File-based routing eliminates boilerplate.

**Key frontend libraries:**

| Library | Purpose | Why chosen |
|---|---|---|
| Redux Toolkit | Global state management | Industry standard for complex client state; DevTools for debugging; predictable reducer pattern |
| RTK Query | Server state + caching | Built into Redux Toolkit; eliminates manual loading/error state boilerplate; cache invalidation and optimistic updates built-in |
| Socket.IO client | Real-time messaging | Matches the Socket.IO server; handles reconnection and event namespacing automatically |
| `next/font` | Font loading | Zero-CLS font loading with automatic font subsetting; no external font flash |

**State architecture:**
- **RTK Query** handles all REST data (rooms list, message history) with automatic caching
- **Redux slices** handle socket-pushed data (incoming messages, unread counts, active room)
- **Socket.IO singleton** (`lib/socket.ts`) is shared across the app via a custom hook, preventing multiple connections

---

### Authentication

JWT-based stateless authentication:
- Tokens issued on login/signup, stored in Redux + `localStorage` for persistence across refreshes
- HTTP requests: `Authorization: Bearer <token>` header via RTK Query `prepareHeaders`
- WebSocket connections: token passed in `auth` handshake option; validated by `JwtWsGuard` before any event is processed
- Route protection: Next.js `middleware.ts` checks token presence and redirects unauthenticated users

---

### Real-Time Architecture

```
Client A          Server              Client B
   |                 |                    |
   |-- send_message →|                    |
   |                 |-- new_message ----→|
   |                 |-- new_message ----→| (all room members)
   |                 |                    |
   |-- create room  →|                    |
   |                 |-- room_created ---→| (all connected clients)
```

- Messages are saved to MongoDB **and** broadcast via Socket.IO simultaneously
- On room join, the client fetches message history via REST (RTK Query), then listens for new socket events
- Unread counts are tracked client-side in Redux; cleared when the user opens a room

---

### UI & Styling

**Why custom CSS over a component library (Tailwind/MUI):**
The design follows a specific Figma specification. Custom CSS gives pixel-perfect control over every spacing, color, and animation detail without fighting a framework's defaults or overriding utility classes.

**Design system:**
- Fonts: **Manrope** (UI/forms) + **Plus Jakarta Sans** (headings) via `next/font/google`
- Icons: **Material Symbols Outlined** (Google's variable icon font — single font file, adjustable weight/fill)
- Primary color: `#a93200` (burnt orange)
- Surface: `#f8f9fa`
- Text: `#191c1d`

---

## Project Structure

```
realtimechat/
├── apps/
│   ├── web/          # Next.js 14 frontend
│   │   └── src/
│   │       ├── app/          # App Router pages
│   │       ├── components/   # React components
│   │       ├── store/        # Redux + RTK Query
│   │       ├── hooks/        # Custom hooks (socket, auth)
│   │       ├── styles/       # Global CSS
│   │       └── types/        # TypeScript types
│   └── server/       # NestJS backend
│       └── src/
│           ├── modules/      # auth, users, rooms, messages
│           ├── gateway/      # Socket.IO WebSocket gateway
│           ├── common/       # guards, filters, decorators
│           └── types/        # TypeScript types
└── packages/
    └── config/       # Shared ESLint + TypeScript config
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm 8+
- MongoDB (local or Atlas URI)

### Install

```bash
pnpm install
```

### Environment Variables

**`apps/server/.env`**
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/realtimechat
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

**`apps/web/.env.local`**
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

### Run

```bash
pnpm dev
```

Runs both apps in parallel via Turborepo:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

### Build

```bash
pnpm build
```

---

## API Reference

### Auth
```
POST /api/auth/signup   { firstName, lastName, email, password }
POST /api/auth/login    { email, password }
```

### Rooms
```
GET  /api/rooms                # list all rooms
POST /api/rooms                # create room (auth)
POST /api/rooms/:id/join       # join room (auth)
GET  /api/rooms/:id/messages   # message history (auth)
```

### Socket Events
```
Client → Server:   join_room, leave_room, send_message
Server → Client:   new_message, user_joined, user_left, room_created, error
```

---

## Key Features

- Real-time messaging via Socket.IO with JWT-authenticated connections
- Room creation and instant discovery (new rooms appear in sidebar without reload)
- Message history loaded via REST on room entry, then continued via WebSocket
- Unread message badges per room, cleared on room open
- Participant list and creator info in chat header
- Split-screen auth UI (login + signup) with professional design
- Persistent authentication across page refreshes
- Responsive design for mobile and desktop
# chat-room
# chat-room
