# WebBooost — Sitio Web Premium

Agencia digital premium con React, Vite, Tailwind CSS y Framer Motion.

## Inicio rápido

```bash
cd webbooost
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

## Video del hero (mascota 3D)

Coloca el archivo de video en:

```
public/single_shot_webbooost_hero.mp4
```

Si el video existe, se mostrará automáticamente en el hero. Si no, se usa la mascota SVG animada como fallback.

## Estructura

```
src/
  components/
    Navbar.jsx       — Navegación con blur al scroll
    Hero.jsx         — Hero principal con video/mascota
    Mascot.jsx       — Robot WebBooost animado (SVG)
    Benefits.jsx     — Franja de beneficios
    Services.jsx     — Tarjetas de servicios
    BeforeAfter.jsx  — Transformación antes/después
    Pricing.jsx      — Planes de precios
    Portfolio.jsx    — Carrusel de proyectos
    Stats.jsx        — Métricas animadas
    Testimonials.jsx — Testimonios de clientes
    CTA.jsx          — Llamada a la acción final
    Footer.jsx       — Pie de página
```

## Personalización

- **Colores:** Variables en `src/index.css` (`--color-electric`, etc.)
- **WhatsApp:** Actualiza el enlace en `CTA.jsx` y `Footer.jsx`
- **Email:** `hola@webbooost.com` en `CTA.jsx` y `Footer.jsx`
- **Planes:** Edita el array `plans` en `Pricing.jsx`
- **Portafolio:** Edita el array `projects` en `Portfolio.jsx`

## Build para producción

```bash
npm run build
npm run preview
```
