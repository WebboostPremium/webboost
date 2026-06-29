# WebBoost — Contexto completo del proyecto (para IA / agentes)

> **Lee este archivo primero** antes de tocar código. Contiene qué es el proyecto, objetivos, estructura, deploy, git, variables y pendientes.

---

## 1. Qué es WebBoost

**WebBoost (WebBooost)** es una agencia/plataforma digital en español (Costa Rica / LATAM) que ofrece:

- Sitios web y landing pages
- Plataformas completas con dashboards
- Apps SaaS en subdominios `*.wboost.app`
- CRM, catálogos, reservas, automatización
- Programa de **afiliados** con comisiones
- **Demo personalizada** por **$5 USD** (wizard 10 pasos + pago Wompi)
- Paneles: **Cliente**, **Afiliado**, **Administrador**

**Marca:** WebBooost  
**Dominio objetivo:** `webbooost.com`  
**Dominio apps SaaS:** `wboost.app`  
**Email:** webboostpremiun@gmail.com  
**WhatsApp:** https://wa.me/50378227317  
**Firebase project:** `webbooost`

---

## 2. Repositorio y rutas locales

| Item | Valor |
|------|--------|
| **GitHub** | https://github.com/WebboostPremium/webboost.git |
| **Organización** | `WebboostPremium` |
| **Rama principal** | `main` |
| **Carpeta local (repo)** | `C:\Users\river\Downloads\Nuevo webboost\webbooost\` |
| **Cuenta Git con PUSH** | `WebboostPremium` (NO usar `Mlevin2123` — solo lectura) |
| **Deploy Vercel** | Proyecto conectado a este repo |

### Estructura del monorepo

```
webboost/                          ← raíz del repo Git
├── AGENTS.md                      ← ESTE ARCHIVO (contexto IA)
├── src/                           ← Sitio Vite/React LEGACY (ya NO se despliega en Vercel)
├── public/                        ← Assets del sitio Vite
├── package.json                   ← Vite 6 — NO tiene Next.js
├── .env.example                   ← Variables Vite (VITE_*)
├── firestore.rules                ← Reglas Firestore (Vite, parcial)
│
└── platform/                      ← ★ APP PRINCIPAL — Next.js 16 (LO QUE SE DESPLIEGA)
    ├── app/                       ← App Router (rutas)
    ├── components/
    ├── lib/                       ← Firebase, expansion, payments, blog, wompi, email
    ├── config/                    ← site.ts, navigation.ts, sales-materials.ts
    ├── types/
    ├── docs/                      ← ARCHITECTURE.md, EXPANSION.md
    ├── firestore.rules            ← Reglas Firestore (plataforma, más completas)
    ├── package.json               ← next 16.2.9
    ├── vercel.json                ← Config Vercel de la plataforma
    └── .env.example               ← Variables Next.js
```

**Regla de oro:** Todo desarrollo nuevo va en **`platform/`**. El sitio Vite en `src/` es legacy; no desplegarlo salvo que el usuario lo pida explícitamente.

---

## 3. Objetivos del producto (roadmap)

### Objetivo principal
Una sola plataforma WebBoost con:

```
WebBoost
├── Landing Page          → /
├── Servicios             → /servicios
├── Portafolio            → /portafolio
├── Precios               → /precios
├── Blog                  → /blog, /blog/[slug]
├── Demo Personalizada ($5) → /demo
├── Login                 → /iniciar-sesion
│
├── Dashboard Cliente     → /dashboard/*
│   ├── Mi proyecto
│   ├── Estado
│   ├── Archivos
│   ├── Tickets
│   ├── Facturas
│   └── Notificaciones
│
├── Dashboard Afiliado    → /afiliado/dashboard/*
│   ├── CRM, Prospectos, Seguimientos, Recordatorios
│   ├── Clientes, Comisiones, Material de ventas, Estadísticas
│
└── Dashboard Admin       → /admin/*
    ├── Clientes, Prospectos, Proyectos, Blog, Demo Personalizada
    ├── Afiliados, Comisiones, Facturación, Auditoría
    └── Configuración, Analíticas
```

**Fuente de verdad de menús:** `platform/config/navigation.ts`

### Objetivos técnicos
1. Deploy automático en **Vercel** al hacer push a `main`
2. Auth con **Firebase** + sesión JWT en cookie (`SESSION_SECRET`)
3. Datos en **Firestore**
4. Pagos demo con **Wompi** + webhook
5. Emails con **Resend**
6. Uploads con **Cloudinary** (pendiente integrar en wizard)
7. Multi-tenant preparado: `*.wboost.app` → `/tenant/[slug]`

---

## 4. Stack tecnológico

### Plataforma (producción) — `platform/`
- **Next.js 16.2.9** (App Router, TypeScript)
- **React 19**, **Tailwind CSS 4**
- **Framer Motion**, **Lucide React**
- **Firebase 12** (client + admin SDK)
- **jose** (JWT sesiones)
- **Resend** (emails)
- **Zod** (validación)

### Legacy — raíz `src/`
- **Vite 6** + React Router 7
- Mismo Firebase, blog CMS más antiguo
- **No desplegar** — referencia para portar features a Next.js

---

## 5. Deploy en Vercel (CRÍTICO)

### Configuración obligatoria en Vercel Dashboard

**Settings → Build and Deployment → Root Directory:**

```
platform
```

| Campo | Valor |
|-------|--------|
| Root Directory | `platform` |
| Framework Preset | Next.js |
| Build Command | `next build` (default) |
| Install Command | `npm install` (default) |
| Output Directory | *(vacío / default)* |

### Errores conocidos
- **"No Next.js version detected"** → Root Directory NO está en `platform`. Vercel lee el `package.json` de la raíz (Vite) que no tiene `next`.
- **NO** crear `vercel.json` en la raíz del repo con `"framework": "nextjs"` — rompe el build.
- El único `vercel.json` válido está en **`platform/vercel.json`**.

### Redeploy
Tras push a `main`, Vercel redeploya solo. Si falla: Deployments → Redeploy (sin caché).

---

## 6. Git — flujo para la IA

### Siempre hacer commit + push cuando el usuario pida implementar cambios o "reflejar en Vercel"

```powershell
cd "C:\Users\river\Downloads\Nuevo webboost\webbooost"
git status
git add <archivos relevantes>
git commit -m "Mensaje claro en inglés o español."
git push origin main
```

### Reglas
- **Repo:** `WebboostPremium/webboost` — rama `main`
- **NO** commitear `.env`, tokens, claves privadas
- **NO** hacer push con cuenta sin permisos
- Commits recientes importantes:
  - `cf60f0d` — Fix Vercel (Root Directory = platform)
  - `002d090` — Módulos: pagos, demo admin, blog CMS, config
  - `b858d07` — Estructura navegación producto
  - `08ba2da` — Plataforma Next.js expansion
  - `244f0ab` — Multi-user Vite (legacy)

### Build local antes de push (recomendado)

```powershell
cd platform
npm install
npm run build
```

---

## 7. Variables de entorno

### Dónde van
- **Local:** `platform/.env` (copiar de `platform/.env.example`)
- **Vercel:** Project → Settings → Environment Variables (Production + Preview + Development)
- **Raíz `.env`:** solo para Vite legacy — no afecta deploy Next.js

### Firebase (público — cliente Next.js)

Prefijo en platform: `NEXT_PUBLIC_FIREBASE_*`

| Variable | Valor (proyecto webbooost) |
|----------|----------------------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyCm18GN_BZwj_MV--SVR2hBEM6jekhW95o` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `webbooost.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `webbooost` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `webbooost.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `316060641108` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:316060641108:web:9518ac83782446d0e6cac1` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-DYFHM17087` (opcional) |

En Vite legacy usan el mismo proyecto con prefijo `VITE_FIREBASE_*`.

### Admin

```
NEXT_PUBLIC_ADMIN_EMAILS=webboostpremiun@gmail.com
```

Emails en esta lista reciben rol `admin` al registrarse.

### App URL

```
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

(o `https://webbooost.com` en producción)

### Firebase Admin (solo servidor — NO commitear)

```
FIREBASE_CLIENT_EMAIL=...@webbooost.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Obtener en: Firebase Console → Project Settings → Service Accounts → Generate new private key.

### Sesión

```
SESSION_SECRET=<string aleatorio largo, mínimo 32 chars>
SESSION_COOKIE_DOMAIN=   (opcional en local)
```

### Wompi (pagos demo $5)

```
WOMPI_API_URL=
WOMPI_AUTH_URL=
WOMPI_CLIENT_ID=
WOMPI_CLIENT_SECRET=
```

**Webhook URL en Wompi:**
```
https://TU-DOMINIO.vercel.app/api/wompi/webhook
```

Si Wompi no está configurado, el flujo demo muestra botón WhatsApp como fallback.

### Resend (emails)

```
RESEND_API_KEY=
EMAIL_FROM=webboostpremiun@gmail.com
EMAIL_FROM_NAME=WebBooost
```

### Cloudinary (pendiente integración completa)

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_UPLOAD_PRESET=
```

### Telegram (solo sitio Vite legacy — formulario contacto)

```
VITE_TELEGRAM_BOT_TOKEN=
VITE_TELEGRAM_CHAT_ID=
```

---

## 8. Autenticación y roles

| Rol | Redirect tras login | Rutas |
|-----|---------------------|-------|
| `client` | `/dashboard` | Panel cliente |
| `affiliate` | `/afiliado/dashboard/crm` | Panel afiliado |
| `admin` | `/admin/analiticas` | Panel admin |

- Auth: Firebase Auth (email/password)
- Perfil: Firestore `users/{uid}`
- Sesión servidor: cookie HTTP-only vía `/api/auth/session`
- Middleware: `platform/middleware.ts` (protege `/dashboard`, `/admin`, `/afiliado`)
- Admin se resuelve por email en `NEXT_PUBLIC_ADMIN_EMAILS`

---

## 9. Firestore — colecciones

Definidas en `platform/lib/constants/collections.ts`:

| Colección | Uso |
|-----------|-----|
| `users` | Perfiles, roles |
| `projects` | Proyectos de clientes |
| `projectTimeline` | Etapas del proyecto |
| `payments` | Pagos / facturas |
| `demoWizardSessions` | Solicitudes demo $5 |
| `prospects` | CRM afiliados |
| `prospectHistory` | Seguimientos |
| `commissions` | Comisiones afiliados |
| `reminders` | Recordatorios afiliados |
| `clientTickets` | Tickets soporte cliente |
| `assets` | Archivos del cliente |
| `notifications` | Notificaciones in-app |
| `auditLogs` | Auditoría admin |
| `blogPosts` | Blog público + admin |
| `platformSettings` | Config editable admin |
| `businesses`, `products`, `orders` | SaaS multi-tenant (futuro) |

**Reglas:** desplegar `platform/firestore.rules` en Firebase Console.

**Índices:** crear en Firebase Console según errores de query (prospects, commissions, payments, blogPosts).

---

## 10. API routes (Next.js)

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/auth/session` | POST | Crear sesión JWT |
| `/api/auth/logout` | POST | Cerrar sesión |
| `/api/demo/[id]/checkout` | POST | Crear pago + link Wompi |
| `/api/wompi/webhook` | POST | Webhook confirmación pago |
| `/api/admin/payments/[id]/confirm` | POST | Confirmar pago manual (admin) |
| `/api/admin/demos/[id]` | PATCH | Actualizar estado demo |
| `/api/settings` | GET/PATCH | Config plataforma |
| `/api/expansion/prospects/[id]/convert` | POST | Convertir prospecto → cliente + proyecto + comisión |

---

## 11. Módulos — estado actual

### ✅ Funcional
- Landing, servicios, portafolio, precios, nosotros, apps, contacto, afiliados (público)
- Auth registro/login
- Dashboard cliente: proyecto, estado, archivos, tickets, notificaciones
- Dashboard afiliado: CRM, prospectos, seguimientos, recordatorios, clientes, comisiones, estadísticas, material
- Dashboard admin: clientes, prospectos, proyectos, comisiones, auditoría, analíticas, demos (lista), facturación (lista + confirmar), blog (listado + editor), configuración
- Demo wizard 10 pasos + página gracias + checkout API
- Blog público + admin CMS
- Emails Resend (si API key configurada)

### 🟡 Parcial / placeholder
- `/dashboard/facturas` — lista pagos; falta PDF descargable
- `/admin/facturacion` — falta integración Wompi completa en UI
- `/admin/demos` — gestión estados; falta entrega demo
- `/afiliado/dashboard/material` — URLs estáticas en `config/sales-materials.ts` (subir PDFs reales)
- Cloudinary upload en DemoWizard (logo usa blob local)
- Multi-tenant `*.wboost.app` — middleware listo, falta contenido
- Rutas legacy redirect: `/dashboard/solicitudes` → `/dashboard/tickets`, `/dashboard/pagos` → `/dashboard/facturas`

### ❌ Pendiente (prioridad sugerida)
1. **Vercel:** confirmar Root Directory = `platform` + todas las env vars
2. **Firebase:** desplegar reglas + índices compuestos
3. **Wompi:** credenciales reales + webhook en producción
4. **Cloudinary:** upload logo en demo wizard
5. **PDF facturas** descargables
6. **Material ventas:** subir PDFs reales a hosting/CDN
7. **Recuperar contraseña** (`/recuperar-contrasena` — middleware whitelist, sin page Next)
8. **Propuesta, apps, soporte** cliente — placeholders en `/dashboard/propuesta`, `/dashboard/apps`, `/dashboard/soporte`

---

## 12. Archivos clave para la IA

| Archivo | Para qué |
|---------|----------|
| `platform/config/navigation.ts` | Menús oficiales del producto |
| `platform/config/site.ts` | Marca, precios, redes, demo $5 |
| `platform/middleware.ts` | Auth, rutas públicas, multi-tenant |
| `platform/components/expansion/DemoWizard.tsx` | Wizard demo 10 pasos |
| `platform/lib/expansion/*.ts` | prospects, commissions, tickets, payments, projects |
| `platform/lib/wompi.ts` | Integración Wompi |
| `platform/lib/email.ts` | Resend |
| `platform/lib/blog.ts` | Blog Firestore |
| `platform/lib/settings.ts` | Config plataforma |
| `platform/components/dashboard/DashboardShell.tsx` | Layout paneles |
| `platform/docs/ARCHITECTURE.md` | Arquitectura detallada |
| `platform/docs/EXPANSION.md` | Módulo expansión/afiliados |

---

## 13. Convenciones de código

- **Idioma UI:** español (es_CR)
- **Commits:** mensajes claros; push a `main` tras cambios que el usuario quiera en Vercel
- **Scope mínimo:** no refactorizar legacy Vite salvo que se pida
- **Nuevas rutas:** seguir App Router en `platform/app/`
- **Nav:** actualizar `platform/config/navigation.ts` si cambia IA del producto
- **Firestore:** usar `COLLECTIONS` constant, no strings sueltos
- **Tipos:** `platform/types/index.ts` y `platform/types/expansion.ts`

---

## 14. Comandos útiles

```powershell
# Desarrollo local (plataforma)
cd "C:\Users\river\Downloads\Nuevo webboost\webbooost\platform"
npm install
npm run dev
# → http://localhost:3000

# Build producción
npm run build

# Git
cd "C:\Users\river\Downloads\Nuevo webboost\webbooost"
git status
git add platform/
git commit -m "Descripción del cambio."
git push origin main

# Legacy Vite (solo si se necesita)
cd "C:\Users\river\Downloads\Nuevo webboost\webbooost"
npm run dev
# → http://localhost:5173
```

---

## 15. Instrucciones para la IA que continúe

1. **Leer este archivo** — no re-analizar desde cero.
2. **Trabajar en `platform/`** — es lo que se despliega.
3. **Tras implementar cambios** que el usuario quiera en producción → `git commit` + `git push origin main` (cuenta `WebboostPremium`).
4. **Verificar build:** `npm run build` en `platform/` antes de push.
5. **Vercel:** Root Directory debe ser `platform`. Si build falla por Next.js, revisar eso primero.
6. **No commitear** `.env`, claves privadas, tokens Telegram.
7. **Seguir la estructura de producto** en sección 3 y `navigation.ts`.
8. **Priorizar pendientes** de sección 11 según lo que pida el usuario.
9. **Firebase rules:** si añades colecciones, actualizar `platform/firestore.rules` y avisar al usuario que las despliegue.
10. **Responder en español** al usuario.

---

## 16. Contacto / marca (referencia)

- Facebook: https://www.facebook.com/share/1DmSqbHrGc/
- Instagram: https://www.instagram.com/webbooost
- WhatsApp: +503 7822 7317
- Demo price: **$5 USD** (`SITE.demoPrice` en `platform/config/site.ts`)
- Comisión afiliado default: ver `DEFAULT_COMMISSION_PERCENT` en `platform/lib/constants/expansion.ts`

---

*Última actualización de contexto: junio 2026 — commit base `cf60f0d`*
