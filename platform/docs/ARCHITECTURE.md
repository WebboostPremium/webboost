# WebBooost Platform — Arquitectura

## Visión general

Plataforma SaaS multi-tenant para WebBooost (`webbooost.com`) con:

1. **Sitio comercial** — marketing multipágina
2. **Dashboard cliente** — propuestas, proyectos, pagos, archivos, tickets
3. **Dashboard admin** — demos, leads, CRM, propuestas, apps, subdominios
4. **Apps SaaS** — catálogo online en subdominios (`*.wboost.app`)
5. **Afiliados** — referidos y comisiones

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 16 App Router, TypeScript, Tailwind v4, Framer Motion |
| Auth cliente | Firebase Authentication |
| Base de datos | Cloud Firestore |
| Auth servidor | Firebase Admin SDK + cookies httpOnly (jose) |
| Pagos | Wompi (Fase 2) |
| Email | Resend (Fase 2) |
| Media | Cloudinary (Fase 3+) |
| Deploy | Vercel |

## Estructura de carpetas

```
webbooost-platform/
├── app/
│   ├── (public)/          # Sitio comercial (mismo diseño actual)
│   ├── (auth)/            # Login / registro
│   ├── dashboard/         # Panel cliente (Fase 3)
│   ├── admin/             # Panel admin (Fase 4)
│   ├── afiliado/          # Panel afiliado (Fase 4)
│   ├── demo/              # Demo $5 (Fase 2)
│   ├── api/               # Route handlers (servidor)
│   └── tenant/            # Apps multi-tenant por subdominio (Fase 5)
├── components/            # UI reutilizable
├── config/                # Site config, planes, apps catalog
├── lib/                   # Firebase, session, Wompi, Resend, Cloudinary
├── types/                 # Modelos TypeScript / Firestore
├── middleware.ts          # Auth + detección subdominio
└── docs/
```

## Rutas

### Públicas
| Ruta | Descripción |
|------|-------------|
| `/` | Landing |
| `/servicios` | Servicios personalizados |
| `/apps` | Apps listas para usar |
| `/precios` | Planes mensuales |
| `/portafolio` | Proyectos |
| `/nosotros` | About |
| `/afiliados` | Programa afiliados |
| `/contacto` | Contacto |
| `/demo` | Demo $5 (Fase 2) |
| `/demo/gracias` | Post-pago demo |
| `/registro` | Registro |
| `/iniciar-sesion` | Login |

### Cliente (`role: client`)
| Ruta | Módulo |
|------|--------|
| `/dashboard` | Resumen |
| `/dashboard/propuesta` | Propuesta privada |
| `/dashboard/proyecto` | Seguimiento |
| `/dashboard/apps` | Apps contratadas |
| `/dashboard/pagos` | Historial Wompi |
| `/dashboard/archivos` | Cloudinary uploads |
| `/dashboard/solicitudes` | Tickets |
| `/dashboard/soporte` | WhatsApp + bot |

### Admin (`role: admin`)
| Ruta | Módulo |
|------|--------|
| `/admin` | Resumen |
| `/admin/demos` | Demo requests |
| `/admin/leads` | Leads |
| `/admin/clientes` | Usuarios client |
| `/admin/propuestas` | Proposals CRUD |
| `/admin/proyectos` | Projects pipeline |
| `/admin/apps` | SaaS apps |
| `/admin/subdominios` | `*.wboost.app` |
| `/admin/pagos` | Transacciones Wompi |
| `/admin/solicitudes` | Tickets |
| `/admin/afiliados` | Affiliates |

### Afiliado (`role: affiliate`)
| Ruta | Descripción |
|------|-------------|
| `/afiliado/dashboard` | Código, referidos, comisiones |

### Multi-tenant (Fase 5)
| Host | Ejemplo |
|------|---------|
| `{slug}.wboost.app` | Catálogo Sabor Latino |

## Flujo de datos — Demo $5 (Fase 2)

```
Visitante → /demo → demoRequests (pending_payment)
         → API Wompi create link → redirect pago
         → Webhook Wompi → demoRequests (paid) + leads + email Resend
         → Admin crea proposal → client ve en /dashboard/propuesta
         → Cliente paga → projects activo
```

## Seguridad

- `NEXT_PUBLIC_*` solo en cliente
- Secretos solo en Route Handlers / Server Actions
- Session cookie: `httpOnly`, `secure`, `sameSite=lax`
- Firestore rules por rol y `businessId`
- Webhooks Wompi: validar firma en servidor

## Fases de entrega

| Fase | Entregable |
|------|------------|
| **1** ✅ | Next.js, diseño, landing, auth, modelos, middleware |
| **2** | Demo $5, Wompi, webhook, Resend |
| **3** | Dashboard cliente completo |
| **4** | Dashboard admin completo |
| **5** | SaaS catálogo + subdominios |

## Deploy Vercel

- Dominio principal: `webbooost.com`
- Wildcard: `*.wboost.app` → mismo proyecto Next.js
- Variables en Project Settings (ver `.env.example`)
