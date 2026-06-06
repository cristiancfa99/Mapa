# FitTrack Pro — Esquema de Base de Datos

## Diagrama Entidad-Relación (simplificado)

```
users ──< workouts ──< workout_exercises ──< workout_sets
  │             
  ├──< routines ──< routine_exercises
  │
  ├──< personal_records
  │
  ├──< body_weights
  │
  ├──< nutrition_logs ──< meals ──< food_items
  │
  ├──< follows (self-referential)
  │
  └──< badges (via user_badges)

exercises ──< workout_exercises
           └─< routine_exercises

food_database ──< food_items
```

## Schema Prisma

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── USERS ────────────────────────────────────────────────

model User {
  id              String    @id @default(cuid())
  email           String    @unique
  passwordHash    String
  name            String
  avatarUrl       String?
  age             Int?
  gender          Gender?
  weightKg        Float?
  heightCm        Float?
  experienceLevel Level     @default(BEGINNER)
  goal            Goal      @default(GENERAL_FITNESS)
  isPremium       Boolean   @default(false)
  premiumUntil    DateTime?
  level           Int       @default(1)
  xp              Int       @default(0)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  workouts        Workout[]
  routines        Routine[]
  prs             PersonalRecord[]
  bodyWeights     BodyWeight[]
  nutritionLogs   NutritionLog[]
  followers       Follow[]  @relation("following")
  following       Follow[]  @relation("followers")
  userBadges      UserBadge[]
  posts           CommunityPost[]
  
  @@map("users")
}

model Follow {
  followerId  String
  followingId String
  createdAt   DateTime @default(now())
  
  follower    User @relation("followers", fields: [followerId], references: [id])
  following   User @relation("following", fields: [followingId], references: [id])
  
  @@id([followerId, followingId])
  @@map("follows")
}

// ─── EXERCISES ────────────────────────────────────────────

model Exercise {
  id              String      @id @default(cuid())
  name            String
  nameEs          String
  muscleGroup     MuscleGroup
  secondaryMuscles MuscleGroup[]
  equipment       Equipment
  difficulty      Level
  description     String
  instructions    String[]
  tips            String[]
  commonMistakes  String[]
  imageUrls       String[]
  videoUrl        String?
  gifUrl          String?
  isOfficial      Boolean     @default(true)
  createdBy       String?
  
  workoutExercises WorkoutExercise[]
  routineExercises RoutineExercise[]
  personalRecords  PersonalRecord[]
  
  @@map("exercises")
}

// ─── WORKOUTS ─────────────────────────────────────────────

model Workout {
  id          String    @id @default(cuid())
  userId      String
  name        String
  notes       String?
  startedAt   DateTime
  endedAt     DateTime?
  durationMin Int?
  volumeKg    Float     @default(0)
  totalSets   Int       @default(0)
  totalReps   Int       @default(0)
  routineId   String?
  
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  routine     Routine?  @relation(fields: [routineId], references: [id])
  exercises   WorkoutExercise[]
  
  createdAt   DateTime  @default(now())
  
  @@index([userId, startedAt])
  @@map("workouts")
}

model WorkoutExercise {
  id          String      @id @default(cuid())
  workoutId   String
  exerciseId  String
  orderIndex  Int
  notes       String?
  restTimeSec Int         @default(90)
  
  workout     Workout     @relation(fields: [workoutId], references: [id], onDelete: Cascade)
  exercise    Exercise    @relation(fields: [exerciseId], references: [id])
  sets        WorkoutSet[]
  
  @@map("workout_exercises")
}

model WorkoutSet {
  id                  String          @id @default(cuid())
  workoutExerciseId   String
  setNumber           Int
  reps                Int?
  weightKg            Float?
  durationSec         Int?
  distanceM           Float?
  rpe                 Int?            // 1-10
  completed           Boolean         @default(false)
  notes               String?
  
  workoutExercise     WorkoutExercise @relation(fields: [workoutExerciseId], references: [id], onDelete: Cascade)
  
  @@map("workout_sets")
}

// ─── ROUTINES ─────────────────────────────────────────────

model Routine {
  id                  String          @id @default(cuid())
  userId              String
  name                String
  description         String?
  category            RoutineCategory @default(CUSTOM)
  difficulty          Level           @default(INTERMEDIATE)
  estimatedDurationMin Int?
  color               String?
  isPublic            Boolean         @default(false)
  
  user                User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  exercises           RoutineExercise[]
  workouts            Workout[]
  
  createdAt           DateTime        @default(now())
  updatedAt           DateTime        @updatedAt
  
  @@map("routines")
}

model RoutineExercise {
  id          String  @id @default(cuid())
  routineId   String
  exerciseId  String
  orderIndex  Int
  sets        Int     @default(3)
  repsMin     Int     @default(8)
  repsMax     Int     @default(12)
  restTimeSec Int     @default(90)
  notes       String?
  
  routine     Routine  @relation(fields: [routineId], references: [id], onDelete: Cascade)
  exercise    Exercise @relation(fields: [exerciseId], references: [id])
  
  @@map("routine_exercises")
}

// ─── PERSONAL RECORDS ─────────────────────────────────────

model PersonalRecord {
  id          String   @id @default(cuid())
  userId      String
  exerciseId  String
  weightKg    Float
  reps        Int
  oneRepMax   Float
  recordedAt  DateTime @default(now())
  workoutId   String?
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  exercise    Exercise @relation(fields: [exerciseId], references: [id])
  
  @@unique([userId, exerciseId])  // Keep only the latest
  @@index([userId])
  @@map("personal_records")
}

// ─── BODY WEIGHT ──────────────────────────────────────────

model BodyWeight {
  id          String   @id @default(cuid())
  userId      String
  weightKg    Float
  recordedAt  DateTime @default(now())
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId, recordedAt])
  @@map("body_weights")
}

// ─── NUTRITION ────────────────────────────────────────────

model NutritionLog {
  id          String   @id @default(cuid())
  userId      String
  date        DateTime @db.Date
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  meals       Meal[]
  
  @@unique([userId, date])
  @@map("nutrition_logs")
}

model Meal {
  id              String        @id @default(cuid())
  nutritionLogId  String
  type            MealType
  name            String
  time            String
  
  nutritionLog    NutritionLog  @relation(fields: [nutritionLogId], references: [id], onDelete: Cascade)
  foodItems       FoodItem[]
  
  @@map("meals")
}

model FoodItem {
  id          String  @id @default(cuid())
  mealId      String
  foodDbId    String?
  name        String
  servingG    Float
  calories    Float
  proteinG    Float
  carbsG      Float
  fatG        Float
  
  meal        Meal    @relation(fields: [mealId], references: [id], onDelete: Cascade)
  
  @@map("food_items")
}

model FoodDatabase {
  id          String  @id @default(cuid())
  name        String
  barcode     String? @unique
  caloriesPer100g  Float
  proteinPer100g   Float
  carbsPer100g     Float
  fatPer100g       Float
  brand       String?
  
  @@index([name])
  @@map("food_database")
}

// ─── COMMUNITY ────────────────────────────────────────────

model CommunityPost {
  id          String    @id @default(cuid())
  userId      String
  content     String
  type        PostType  @default(WORKOUT)
  workoutId   String?
  prId        String?
  likesCount  Int       @default(0)
  
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  likes       PostLike[]
  comments    PostComment[]
  
  createdAt   DateTime  @default(now())
  
  @@index([createdAt])
  @@map("community_posts")
}

model PostLike {
  userId  String
  postId  String
  
  user    User          @relation(fields: [userId], references: [id])
  post    CommunityPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  @@id([userId, postId])
  @@map("post_likes")
}

model PostComment {
  id        String        @id @default(cuid())
  postId    String
  userId    String
  content   String
  createdAt DateTime      @default(now())
  
  post      CommunityPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  @@map("post_comments")
}

// ─── GAMIFICATION ─────────────────────────────────────────

model Badge {
  id          String      @id
  name        String
  description String
  icon        String
  category    BadgeCategory
  condition   Json
  
  userBadges  UserBadge[]
  
  @@map("badges")
}

model UserBadge {
  userId    String
  badgeId   String
  earnedAt  DateTime @default(now())
  
  user      User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  badge     Badge  @relation(fields: [badgeId], references: [id])
  
  @@id([userId, badgeId])
  @@map("user_badges")
}

// ─── ENUMS ────────────────────────────────────────────────

enum Gender { MALE FEMALE OTHER }
enum Level  { BEGINNER INTERMEDIATE ADVANCED }
enum Goal   { MUSCLE_GAIN FAT_LOSS RECOMPOSITION STRENGTH ENDURANCE GENERAL_FITNESS }
enum MuscleGroup { CHEST BACK SHOULDERS BICEPS TRICEPS LEGS GLUTES CORE CARDIO FULL_BODY }
enum Equipment   { BARBELL DUMBBELL CABLE MACHINE BODYWEIGHT KETTLEBELL BANDS OTHER }
enum RoutineCategory { PUSH_PULL_LEGS UPPER_LOWER FULL_BODY TORSO_LEGS CUSTOM }
enum MealType  { BREAKFAST LUNCH DINNER SNACK }
enum PostType  { WORKOUT PR MILESTONE }
enum BadgeCategory { MILESTONE STREAK STRENGTH CONSISTENCY SPECIAL }
```

## Índices Críticos para Rendimiento

```sql
-- Historial de entrenamientos por usuario (más usada)
CREATE INDEX idx_workouts_user_date ON workouts(user_id, started_at DESC);

-- Búsqueda de ejercicios
CREATE INDEX idx_exercises_muscle ON exercises(muscle_group);
CREATE INDEX idx_exercises_name ON exercises USING gin(to_tsvector('spanish', name_es));

-- Feed de comunidad
CREATE INDEX idx_posts_created ON community_posts(created_at DESC);
CREATE INDEX idx_posts_user ON community_posts(user_id, created_at DESC);

-- Récords personales
CREATE UNIQUE INDEX idx_pr_user_exercise ON personal_records(user_id, exercise_id);

-- Estadísticas semanales (pre-calculadas en Redis)
-- Key: stats:weekly:{userId}:{isoWeek}
```
