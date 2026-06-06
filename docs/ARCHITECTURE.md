# FitTrack Pro — Arquitectura Técnica

## Stack Tecnológico

### Frontend (MVP Web)
| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | React | 18.3 |
| Lenguaje | TypeScript | 5.5 |
| Build | Vite | 5.4 |
| Routing | React Router | 6.26 |
| Charts | Recharts | 2.12 |
| Icons | Lucide React | 0.441 |
| Deploy | GitHub Pages / Vercel | — |

### Frontend (Producción Mobile)
| Capa | Tecnología |
|------|-----------|
| Framework | React Native + Expo |
| UI | React Native + Custom Design System |
| Estado | Zustand / Redux Toolkit |
| Navegación | React Navigation v6 |
| Animaciones | Reanimated 3 |
| Charts | Victory Native XL |

### Backend (API)
| Capa | Tecnología |
|------|-----------|
| Runtime | Node.js 20 LTS |
| Framework | Express 5 / Fastify |
| ORM | Prisma |
| Base de datos | PostgreSQL 16 |
| Caché | Redis 7 |
| Auth | JWT + Refresh Tokens |
| Storage | AWS S3 / Cloudflare R2 |
| Queue | BullMQ |

### Infraestructura
```
┌─────────────────────────────────────────────────────────┐
│                     CloudFront CDN                       │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│                    Load Balancer (ALB)                   │
└───────┬─────────────────────────────────────┬───────────┘
        │                                     │
┌───────▼──────────┐                ┌─────────▼──────────┐
│   API Gateway    │                │   WebSocket Server  │
│  (Node.js x3)   │                │   (real-time chat)  │
└───────┬──────────┘                └────────────────────┘
        │
┌───────▼──────────────────────────────────────────────────┐
│                  Service Layer                           │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────────┐  │
│  │  Auth Svc   │ │  Workout Svc │ │    AI Svc (RAG)  │  │
│  └─────────────┘ └──────────────┘ └──────────────────┘  │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────────┐  │
│  │ Exercise Svc│ │ Nutrition Svc│ │  Community Svc   │  │
│  └─────────────┘ └──────────────┘ └──────────────────┘  │
└───────┬──────────────────────────────────────────────────┘
        │
┌───────▼──────────────────────────────────────────────────┐
│                   Data Layer                             │
│  ┌───────────────────┐  ┌─────────────────────────────┐ │
│  │   PostgreSQL 16    │  │      Redis 7 (cache)        │ │
│  │  (Primary + 2 RR) │  │  (sessions, rate-limit,     │ │
│  └───────────────────┘  │   queue, pub/sub)            │ │
│                         └─────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

## Estructura de Carpetas

### Frontend (React Native / React)
```
src/
├── app/                        # Navigation & App root
│   ├── _layout.tsx
│   └── (tabs)/
│       ├── home.tsx
│       ├── exercises.tsx
│       ├── workout.tsx
│       ├── stats.tsx
│       └── profile.tsx
├── components/
│   ├── common/                 # Reutilizables
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Input/
│   │   ├── Badge/
│   │   ├── Modal/
│   │   └── Charts/
│   ├── workout/                # Componentes de entrenamiento
│   │   ├── SetRow/
│   │   ├── ExerciseCard/
│   │   ├── RestTimer/
│   │   └── WorkoutSummary/
│   └── nutrition/
│       ├── MacroRing/
│       └── FoodCard/
├── screens/                    # Pantallas completas
│   ├── Auth/
│   ├── Home/
│   ├── Exercises/
│   ├── Workout/
│   ├── Statistics/
│   ├── Nutrition/
│   ├── Community/
│   ├── Profile/
│   └── Settings/
├── contexts/                   # React Context / Store
│   ├── ThemeContext.tsx
│   ├── AuthContext.tsx
│   └── WorkoutContext.tsx
├── hooks/                      # Custom hooks
│   ├── useTimer.ts
│   ├── useWorkoutHistory.ts
│   └── useAI.ts
├── services/                   # API calls
│   ├── api.ts                  # Axios instance
│   ├── authService.ts
│   ├── workoutService.ts
│   └── exerciseService.ts
├── store/                      # Zustand store (producción)
│   ├── authStore.ts
│   ├── workoutStore.ts
│   └── settingsStore.ts
├── types/                      # TypeScript interfaces
│   └── index.ts
├── data/                       # Static data
│   └── exercises.ts            # 1000+ exercises
├── utils/                      # Helpers
│   ├── oneRepMax.ts
│   ├── format.ts
│   └── analytics.ts
└── theme/
    ├── colors.ts
    ├── typography.ts
    └── spacing.ts
```

### Backend (Node.js)
```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── env.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── rateLimit.ts
│   │   └── validation.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.routes.ts
│   │   ├── workouts/
│   │   ├── exercises/
│   │   ├── users/
│   │   ├── nutrition/
│   │   ├── community/
│   │   └── ai/
│   ├── shared/
│   │   ├── errors/
│   │   └── utils/
│   └── main.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/
│   ├── unit/
│   └── integration/
└── docker-compose.yml
```

## Patrones de Arquitectura

### 1. Feature-Sliced Design (FSD)
Cada módulo es autocontenido con su propia lógica, UI, servicios y tipos.

### 2. Optimistic Updates
Las actualizaciones de UI se aplican inmediatamente antes de confirmar con el servidor, luego se revierte en caso de error.

### 3. Offline-First (PWA / Mobile)
- SQLite local (expo-sqlite) para persistencia offline
- Sincronización en background cuando hay conexión
- Resolución de conflictos por timestamp + merge-wins

### 4. Event Sourcing para workouts
Cada acción del entrenamiento es un evento inmutable que se guarda y puede reproducirse.

## Seguridad
- JWT con rotación automática de tokens (refresh token 30 días)
- Bcrypt para contraseñas (cost factor 12)
- Rate limiting por IP y usuario
- HTTPS obligatorio + HSTS
- CORS estricto
- Inputs sanitizados con Zod
- SQL injection imposible via Prisma (prepared statements)
