# FitTrack Pro — API REST v1

## Base URL
```
https://api.fittrackpro.app/v1
```

## Autenticación
```
Authorization: Bearer <access_token>
```

---

## Auth

### POST /auth/register
```json
// Request
{
  "name": "Alex García",
  "email": "alex@example.com",
  "password": "SecurePass123!",
  "goal": "MUSCLE_GAIN",
  "experienceLevel": "INTERMEDIATE"
}

// Response 201
{
  "user": { "id": "clx...", "name": "Alex García", "email": "..." },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

### POST /auth/login
```json
// Request
{ "email": "alex@example.com", "password": "SecurePass123!" }

// Response 200
{
  "user": { ... },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

### POST /auth/refresh
```json
// Request
{ "refreshToken": "eyJ..." }

// Response 200
{ "accessToken": "eyJ...", "refreshToken": "eyJ..." }
```

### POST /auth/logout
```json
// Response 200
{ "message": "Logged out successfully" }
```

---

## Users

### GET /users/me
```json
// Response 200
{
  "id": "clx...",
  "name": "Alex García",
  "email": "alex@example.com",
  "level": 12,
  "xp": 2400,
  "xpNextLevel": 3000,
  "isPremium": false,
  "stats": {
    "totalWorkouts": 87,
    "totalVolume": 124500,
    "totalDuration": 4350,
    "streak": 4,
    "longestStreak": 21
  }
}
```

### PATCH /users/me
```json
// Request (partial update)
{
  "weightKg": 80.5,
  "goal": "STRENGTH",
  "name": "Alex G."
}
```

### GET /users/me/stats?period=month
```json
// Response 200
{
  "period": "month",
  "totalWorkouts": 18,
  "totalVolume": 48200,
  "avgDuration": 68,
  "volumeByMuscle": {
    "CHEST": 12400,
    "BACK": 15800,
    "LEGS": 20000
  },
  "weeklyBreakdown": [
    { "week": "2024-W22", "volume": 11200, "workouts": 4 }
  ]
}
```

---

## Exercises

### GET /exercises
```
Query params:
  muscleGroup: CHEST|BACK|...
  equipment: BARBELL|...
  difficulty: BEGINNER|...
  q: string (search)
  page: number
  limit: number (default 20)
```
```json
// Response 200
{
  "data": [
    {
      "id": "bench-press",
      "name": "Bench Press",
      "nameEs": "Press de Banca",
      "muscleGroup": "CHEST",
      "equipment": "BARBELL",
      "difficulty": "INTERMEDIATE",
      "imageUrls": ["https://..."],
      "gifUrl": "https://..."
    }
  ],
  "pagination": { "page": 1, "total": 1000, "totalPages": 50 }
}
```

### GET /exercises/:id
```json
// Response 200
{
  "id": "bench-press",
  "name": "Bench Press",
  "nameEs": "Press de Banca",
  "muscleGroup": "CHEST",
  "secondaryMuscles": ["SHOULDERS", "TRICEPS"],
  "equipment": "BARBELL",
  "difficulty": "INTERMEDIATE",
  "description": "...",
  "instructions": ["Step 1...", "Step 2..."],
  "tips": ["Tip 1..."],
  "commonMistakes": ["Mistake 1..."],
  "imageUrls": [],
  "gifUrl": "https://...",
  "videoUrl": "https://..."
}
```

### GET /exercises/:id/history
```json
// Returns user's history for this exercise
{
  "data": [
    {
      "date": "2024-06-03",
      "workoutId": "clx...",
      "sets": [{ "reps": 6, "weightKg": 100, "rpe": 9 }],
      "maxWeight": 100,
      "totalVolume": 600
    }
  ]
}
```

---

## Workouts

### GET /workouts
```
Query: page, limit, from, to (date range)
```

### POST /workouts
```json
// Request
{
  "name": "Push Day A",
  "routineId": "clx...",
  "startedAt": "2024-06-05T08:00:00Z",
  "endedAt": "2024-06-05T09:10:00Z",
  "notes": "Felt great today",
  "exercises": [
    {
      "exerciseId": "bench-press",
      "orderIndex": 0,
      "restTimeSec": 180,
      "sets": [
        { "setNumber": 1, "reps": 6, "weightKg": 100, "rpe": 9, "completed": true }
      ]
    }
  ]
}
```

### GET /workouts/:id
### PATCH /workouts/:id
### DELETE /workouts/:id

---

## Routines

### GET /routines
### POST /routines
```json
{
  "name": "Push Day A",
  "category": "PUSH_PULL_LEGS",
  "difficulty": "INTERMEDIATE",
  "isPublic": false,
  "exercises": [
    {
      "exerciseId": "bench-press",
      "orderIndex": 0,
      "sets": 4,
      "repsMin": 6,
      "repsMax": 8,
      "restTimeSec": 180
    }
  ]
}
```

### GET /routines/:id
### PUT /routines/:id
### DELETE /routines/:id
### POST /routines/:id/duplicate

---

## Statistics

### GET /stats/volume?period=8w
```json
{
  "data": [
    { "week": "2024-W18", "volumeKg": 18200, "workouts": 4 },
    { "week": "2024-W19", "volumeKg": 20400, "workouts": 4 }
  ]
}
```

### GET /stats/prs
```json
{
  "data": [
    {
      "exerciseId": "bench-press",
      "exerciseName": "Press de Banca",
      "weightKg": 100,
      "reps": 6,
      "oneRepMax": 117,
      "recordedAt": "2024-06-03"
    }
  ]
}
```

### GET /stats/muscle-frequency?period=4w
```json
{
  "data": {
    "CHEST": { "sets": 48, "frequency": 3.2 },
    "BACK": { "sets": 56, "frequency": 3.8 }
  }
}
```

---

## Nutrition

### GET /nutrition/:date
### POST /nutrition/:date/meals
### POST /nutrition/:date/meals/:mealId/foods
### GET /nutrition/goals

---

## AI Insights

### GET /ai/insights
```json
{
  "data": [
    {
      "id": "ins_123",
      "type": "progress",
      "title": "Progreso Excelente en Press de Banca",
      "message": "Has progresado un 11% en 6 semanas...",
      "exerciseId": "bench-press",
      "createdAt": "2024-06-04T00:00:00Z"
    }
  ]
}
```

### POST /ai/generate-plan
```json
// Request
{
  "goal": "MUSCLE_GAIN",
  "daysPerWeek": 4,
  "sessionDuration": 60,
  "equipment": ["BARBELL", "DUMBBELL", "CABLE"]
}

// Response
{
  "plan": {
    "name": "Hipertrofia 4 días",
    "weeks": 8,
    "routines": [...]
  }
}
```

---

## Community

### GET /community/feed?page=1
### POST /community/posts
### POST /community/posts/:id/like
### GET /community/leaderboard?period=week
### POST /users/:id/follow
### DELETE /users/:id/follow

---

## Códigos de Error
```json
// Error estándar
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El peso debe ser un número positivo",
    "field": "weightKg",
    "statusCode": 400
  }
}
```

| Código | HTTP | Descripción |
|--------|------|-------------|
| VALIDATION_ERROR | 400 | Datos de entrada inválidos |
| UNAUTHORIZED | 401 | Token inválido o expirado |
| FORBIDDEN | 403 | Sin permisos suficientes |
| NOT_FOUND | 404 | Recurso no encontrado |
| CONFLICT | 409 | Recurso ya existe |
| RATE_LIMIT | 429 | Demasiadas peticiones |
| INTERNAL_ERROR | 500 | Error interno del servidor |

## Rate Limiting
- Auth: 10 req/min por IP
- API general: 300 req/min por usuario
- AI insights: 20 req/hora (free), 200 req/hora (premium)
