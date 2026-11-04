# PoliGT

PWA móvil para que personas en Guatemala conozcan sus derechos y deberes en una parada, retén o detención de la PNC, EMETRA o PMT. Incluye guías por situación, biblioteca de artículos, **Mike** (asesor virtual con IA), grabación de audio/video, informe del incidente en PDF y ayuda de emergencia. Funciona sin conexión.

> PoliGT es informativa y **no sustituye a un abogado**. Los artículos están pendientes de revisión por un profesional del derecho.

## Desarrollo

Requiere Node ≥ 22.18.

```bash
npm install
npm run dev        # genera api/knowledge.js y abre Vite
npm run lint
npm test           # vitest: biblioteca legal, búsqueda local, validación de la API
npm run build      # genera conocimiento, tsc y vite build
```

El chat necesita la función de Vercel: para probarlo en local usa `npx vercel dev`.

## Chat con IA (Mike)

`api/chat.js` es una función de Vercel que guarda la llave y le entrega al modelo la biblioteca de artículos como único conocimiento legal. Responde en *streaming* y valida que los `[[ids]]` citados existan.

1. Importa el repo en Vercel (detecta Vite solo).
2. Variables de entorno (ver `.env.example`): `ANTHROPIC_API_KEY` (obligatoria). Recomendadas: `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` para un límite de uso persistente (12 mensajes/minuto por IP). Sin ellas el límite es solo en memoria y **no es fiable en producción**.
3. Define un tope de gasto mensual en la consola de Anthropic.

Protecciones del endpoint: solo acepta peticiones del propio dominio (`ALLOWED_ORIGINS` para añadir otros), tamaño máximo de cuerpo, historial recortado y normalizado (los turnos previos se tratan como no confiables), tiempo máximo hacia el proveedor y *prompt caching* de la biblioteca.

`api/knowledge.js` se **genera** con `npm run knowledge` a partir de `src/data/laws.ts` y no está en git.

## Privacidad

- Todo se guarda solo en el teléfono: informe, contacto de confianza y grabaciones (IndexedDB). El chat vive en `sessionStorage` y desaparece al cerrar la pestaña.
- **Ayuda → Privacidad:** borrar todos los datos en un toque y PIN opcional de 4 dígitos (se vuelve a pedir al volver a la app). El PIN evita miradas casuales; no es cifrado fuerte.
- Botón de **salida rápida** en el encabezado.
- Las preguntas al chat se envían a Anthropic; la app lo avisa antes de usarla.

## Grabación

Los fragmentos se guardan mientras se graba: si se cierra la app o se acaba la batería, la grabación se recupera al volver a abrirla. Se elige automáticamente el formato que soporta el navegador (mp4 en iOS, webm en Android) y se mantiene la pantalla encendida si el navegador lo permite.

## Seguridad y despliegue

`vercel.json` define CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` y HSTS. El service worker nunca cachea `/api/*`. CI en `.github/workflows/ci.yml` (lint, pruebas y build).

## Pendientes de contenido

- Revisión de los artículos por un abogado guatemalteco y fecha de última verificación por artículo.
- Verificar los teléfonos de `src/views/Help.tsx` (PNC 110, PDH 1555, MP).

El diseño está descrito en `DESIGN.md`.
