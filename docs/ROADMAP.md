# FitTrack Pro — Roadmap de Desarrollo

## Resumen Ejecutivo
FitTrack Pro es una aplicación de fitness de nivel enterprise diseñada para competir
con Strong, Hevy y Fitbod. La estrategia es lanzar un MVP sólido, validar PMF,
luego escalar con IA, comunidad y monetización premium.

---

## FASE 1 — MVP (Semanas 1-8)
**Objetivo:** Aplicación funcional lista para beta testers

### Sprint 1-2: Fundaciones (Sem 1-2)
- [x] Setup repositorio, CI/CD (GitHub Actions → Vercel)
- [x] Design System completo (colores, tipografía, componentes base)
- [x] Autenticación (email/password + JWT)
- [x] Perfiles de usuario (datos básicos + objetivo)

### Sprint 3-4: Core Workout (Sem 3-4)
- [x] Biblioteca de ejercicios (500+ ejercicios, búsqueda, filtros)
- [x] Registro de entrenamiento (sets, reps, peso, RPE)
- [x] Temporizador de descanso con notificaciones
- [x] Historial de entrenamientos

### Sprint 5-6: Rutinas y Stats (Sem 5-6)
- [x] Constructor de rutinas (drag & drop, duplicar)
- [x] Estadísticas básicas (volumen semanal, duración)
- [x] Récords personales (cálculo automático)
- [x] Gráfico de progresión por ejercicio

### Sprint 7-8: Polish y Beta (Sem 7-8)
- [ ] Animaciones y micro-interacciones (Framer Motion)
- [ ] Dark Mode / Light Mode
- [ ] Onboarding flow
- [ ] Beta testing con 100 usuarios
- [ ] Bug fixing y optimizaciones

**Entregables MVP:**
- Web app funcional (React + Vite)
- Backend API (Node.js + PostgreSQL)
- 500+ ejercicios en base de datos
- 100 beta testers activos

---

## FASE 2 — Crecimiento (Semanas 9-20)
**Objetivo:** App Store + Play Store + 1.000 usuarios activos

### Sprint 9-12: Mobile (Sem 9-14)
- [ ] Migración a React Native + Expo
- [ ] iOS app (App Store Connect)
- [ ] Android app (Google Play Console)
- [ ] Push notifications (Expo + FCM/APNs)
- [ ] Modo offline (SQLite local + sync)

### Sprint 13-16: Comunidad (Sem 15-18)
- [ ] Feed de actividad social
- [ ] Seguir/dejar de seguir usuarios
- [ ] Compartir entrenamientos y PRs
- [ ] Ranking semanal por volumen
- [ ] Sistema de insignias y logros (20+ badges)

### Sprint 17-20: Nutrición (Sem 19-22)
- [ ] Registro de macros (proteína, carbos, grasa, calorías)
- [ ] Base de alimentos (USDA FoodData + custom)
- [ ] Escáner de código de barras (expo-barcode-scanner)
- [ ] Objetivos diarios personalizados
- [ ] Integración con Apple Health / Google Fit

---

## FASE 3 — Monetización IA (Semanas 21-36)
**Objetivo:** 10.000 usuarios, MRR $5.000

### Sprint 21-24: IA Básica (Sem 21-26)
- [ ] Módulo de análisis de progresión
- [ ] Detección automática de PRs
- [ ] Insights semanales personalizados
- [ ] Sugerencias de progresión de carga
- [ ] Alertas de fatiga acumulada

### Sprint 25-28: Premium y Pagos (Sem 27-30)
- [ ] Integración RevenueCat (iOS + Android)
- [ ] Plan Gratuito: Entrenamientos, rutinas básicas (3 máx), estadísticas 30 días
- [ ] Plan Premium ($9.99/mes o $59.99/año):
  - IA avanzada y planes personalizados
  - Estadísticas históricas ilimitadas
  - Rutinas ilimitadas
  - Exportación CSV/PDF
  - Sin publicidad
- [ ] Paywall con free trial 14 días

### Sprint 29-36: IA Avanzada (Sem 31-40)
- [ ] GPT-4 para generación de planes de entrenamiento
- [ ] Análisis de video para corrección de forma (futuro)
- [ ] Periodización automática (lineal, ondulante, DUP)
- [ ] Predictor de 1RM con IA
- [ ] Coach virtual con chat

---

## FASE 4 — Escala (Meses 10-18)
**Objetivo:** 100.000 usuarios, Series A

### Producto
- [ ] Wearables: Apple Watch app, Wear OS
- [ ] Integración Garmin / Polar / Wahoo
- [ ] Planes de entrenamiento para equipos (coaches)
- [ ] White-label para gimnasios

### Tecnología
- [ ] Kubernetes + horizontal pod autoscaling
- [ ] Global CDN (AWS CloudFront + R2)
- [ ] Sharding PostgreSQL por región
- [ ] ML pipeline propio (modelos de IA custom)
- [ ] Real-time features (workout en vivo, chat)

### Negocio
- [ ] Plan Gym ($299/mes por gimnasio ilimitado)
- [ ] Marketplace de rutinas de entrenadores certificados
- [ ] API pública para partners
- [ ] Expansión: PT (inglés), PT-BR (portugués), DE (alemán), FR (francés)

---

## KPIs por Fase

| KPI | Fase 1 | Fase 2 | Fase 3 | Fase 4 |
|-----|--------|--------|--------|--------|
| Usuarios registrados | 100 | 1.000 | 10.000 | 100.000 |
| DAU/MAU ratio | — | 20% | 30% | 40% |
| Entrenamientos/semana | — | 1.500 | 20.000 | 300.000 |
| MRR | $0 | $0 | $5.000 | $80.000 |
| Conversion free→premium | — | — | 5% | 8% |
| Churn mensual | — | — | 8% | 4% |
| NPS | — | 40 | 55 | 65 |

---

## Estructura del Equipo

### Fase 1-2 (Bootstrap, 3 personas)
- 1 Full-Stack Engineer (React Native + Node.js)
- 1 Backend Engineer (Node.js + PostgreSQL)
- 1 Founder/Product Manager

### Fase 3 (Seed, 6 personas)
- +1 Frontend Engineer (React Native specialist)
- +1 ML/AI Engineer
- +1 Growth/Marketing

### Fase 4 (Serie A, 15+ personas)
- CTO, Engineering Team × 6
- Product × 2, Design × 2
- Marketing × 3, Customer Success × 2

---

## Stack de Decisiones Clave

### ¿Por qué React Native sobre Flutter?
- Ecosistema JavaScript/TypeScript unificado con el web
- Mejor acceso a APIs nativas de iOS/Android
- Pool de developers más grande
- Expo simplifica el setup y el OTA updates

### ¿Por qué PostgreSQL sobre MongoDB?
- Datos relacionales (usuarios → workouts → sets)
- Transacciones ACID para cálculo de estadísticas
- Excellent performance con índices bien diseñados
- Prisma ORM con TypeScript full-type-safety

### ¿Por qué Node.js sobre Go/Rust?
- Equipo pequeño: priorizar velocidad de desarrollo
- Ecosistema NPM para integraciones
- Performance más que suficiente para Fase 1-3
- Migración a Go/Rust posible en Fase 4 si necesario

---

## Dependencias y Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| App Store rejection | Media | Alto | Guías Apple/Google, TestFlight beta |
| Escala PostgreSQL | Baja | Alto | Read replicas + Redis desde Fase 1 |
| Copia de competidores | Alta | Medio | Velocidad, UX superior, comunidad |
| Costos AWS descontrolados | Media | Medio | Budget alerts, rightsizing |
| Key person dependency | Alta | Alto | Documentación, pair programming |
