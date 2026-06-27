# Módulo de Ampliación WebBooost

Extensión aditiva sobre la plataforma existente. **No modifica** páginas públicas ni el diseño base.

## Nuevas rutas

### Afiliado (`/afiliado/dashboard`)
- Resumen con estadísticas
- **Mis Prospectos** — CRM completo + bitácora
- **Comisiones** — pendientes / pagadas
- **Recordatorios** — con notificaciones

### Cliente (`/dashboard`)
- **Mi proyecto** — progreso + línea de tiempo
- **Mis archivos** — descargas
- **Solicitudes** — tickets de soporte
- **Notificaciones** — centro de avisos

### Admin (`/admin`)
- KPIs ampliados
- **Prospectos** — ver todos + conversión automática
- **Comisiones** — aprobar / pagar
- **Auditoría** — historial del sistema

### Demo premium (`/demo`)
- Wizard 10 pasos con autosave (localStorage)
- Guardado en `demoWizardSessions`

## Colecciones Firestore nuevas

`prospects`, `prospectHistory`, `commissions`, `reminders`, `auditLogs`, `projectTimeline`, `clientTickets`, `demoWizardSessions`

## API

`POST /api/expansion/prospects/[id]/convert` — Admin convierte prospecto → cliente + proyecto + comisión

## Automatizaciones

- Nuevo prospecto → notificación admin + audit log
- Venta cerrada → cliente, proyecto, comisión, notificación afiliado
- Ticket creado → notificación admin
- Comisión pagada → notificación afiliado

## UX añadida

- Toast notifications
- Skeleton loaders
- Empty states
- Progress bars
- Animaciones Framer Motion en demo wizard

## Índices Firestore recomendados

```
prospects: affiliateId ASC, createdAt DESC
prospectHistory: prospectId ASC, createdAt DESC
commissions: affiliateId ASC, createdAt DESC
reminders: userId ASC, dueAt ASC
notifications: userId ASC, createdAt DESC
projectTimeline: projectId ASC, createdAt ASC
clientTickets: clientId ASC, createdAt DESC
```
