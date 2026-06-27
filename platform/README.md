# WebBooost Platform (Next.js)

Plataforma SaaS completa de WebBooost. **No modifica** el sitio Vite existente (`../webbooost`); es el nuevo backend + frontend unificado.

## Fase 1 (actual)

- Next.js 16 + TypeScript + Tailwind v4
- Mismo diseño visual (azul #1A6BFF, Plus Jakarta, mascota)
- Landing completa + rutas públicas
- Auth Firebase + sesión segura con cookies
- Estructura dashboard cliente / admin (stubs)
- Middleware multi-tenant preparado (`*.wboost.app`)
- Modelos de datos y reglas Firestore

## Desarrollo

```bash
cp .env.example .env.local
npm install
npm run dev
```

Abre http://localhost:3000

## Deploy Vercel

1. Importa la carpeta `webbooost-platform`
2. Configura variables de `.env.example`
3. Dominio: `webbooost.com`
4. Wildcard: `*.wboost.app`

## Documentación

Ver [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## Fases siguientes

| Fase | Contenido |
|------|-----------|
| 2 | Demo $5 + Wompi + Resend |
| 3 | Dashboard cliente completo |
| 4 | Dashboard admin completo |
| 5 | Catálogo SaaS + subdominios |
