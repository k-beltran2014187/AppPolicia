# DESIGN.md — PoliGT

Sistema visual de PoliGT, inspirado en el análisis independiente de Wise (VoltAgent/awesome-design-md). No usa logos, textos ni la fuente propietaria de Wise. Debe sentirse **claro, de confianza y fácil de leer bajo estrés**, en un teléfono, con una mano.

## 1. Visual Theme & Atmosphere
Institucional y cercano: **azul marino y azul de Guatemala** (confianza, justicia, autoridad serena) con un **dorado** discreto como detalle de "ley/verificado". Fondo gris azulado muy claro, tarjetas blancas grandes y redondeadas, titulares gruesos. Debe leerse bien bajo estrés, con una mano, en el teléfono. Sin emojis: íconos de línea (Lucide). El verde se descartó: en este contexto se sentía más "fintech" que "derechos y justicia".

Estructura inspirada en patrones de apps similares (ACLU Mobile Justice y afines, asistentes legales con IA): grabar siempre a un toque, guías cortas por situación, informe del incidente, fuentes visibles en cada respuesta, aviso claro de alcance (informa, no representa) y privacidad como requisito.

## 2. Color Palette & Roles
| Token | Claro | Oscuro | Rol |
|---|---|---|---|
| `--accent` | #1d4f91 | #7db8ee | Acción principal, estado activo, burbuja del usuario |
| `--accent-ink` | #ffffff | #08111f | Texto/ícono sobre el acento |
| `--accent-soft` | #e4edf8 | #14304f | Fondo suave de íconos y estados "bien" |
| `--gold` | #b7791f | #e0b45a | Detalle: "base legal", insignias, Mike |
| `--bg` | #f2f5fa | #08111f | Fondo de página |
| `--card` | #ffffff | #0f1d33 | Tarjetas y paneles |
| `--fg` | #0b1b33 | #eaf0fa | Texto principal |
| `--muted` | #54627a | #9aa9c2 | Texto secundario |
| `--line` | #d5ddea | #213250 | Bordes |
| `--link` | #1d4f91 | #8ec3f2 | Enlaces y chips |
| `--good` | #1e7a5c | #5fd0a3 | Verificado / positivo |
| `--warn` | #8a5a00 | #f2bf4f | Advertencia, "pendiente de validación" |
| `--bad` | #b3261e | #ff8f87 | Emergencia, "evita", grabar, destructivo |
Héroe: degradado #0b2545 → #14407a → #1d6bb8. Contraste AA en texto y botones. El rojo se reserva a emergencia y grabación.
## 3. Typography Rules
Familia: **Inter Variable** (empaquetada, funciona sin internet) con respaldo del sistema. Sustituye a Wise Sans.
| Rol | Tamaño | Peso | Notas |
|---|---|---|---|
| Display (CTA héroe) | 28–32px | 900 | interlineado 1.05, `text-wrap: balance` |
| H1 pantalla | 26px | 800 | |
| H2 sección | 17px | 700 | |
| Cuerpo | 16px | 400 | interlineado 1.5, máx. ~65 caracteres |
| Etiqueta / chip | 12–13px | 600 | |
| Pie / aviso | 13px | 400 | |

## 4. Component Stylings
- **Botón primario:** fondo `--accent`, texto `--accent-ink`, radio 24px, altura mínima 52px, peso 700. Hover/activo oscurece ligeramente. Foco: anillo 3px `--accent-ink`.
- **Botón secundario:** transparente, borde 1.5px `--fg`, radio 24px.
- **Botón peligro:** borde y texto `--bad`.
- **Tarjeta:** `--card`, radio 24px, padding 16–20px, sin sombra, sin borde (sobre el fondo gris) o borde 1px en oscuro.
- **Ícono en círculo:** 44px, fondo `--accent-soft`, ícono `--accent-ink` (`--accent` en oscuro).
- **Chip de artículo:** pastilla, borde 1px `--link`, texto `--link`, 13px.
- **Burbujas del chat:** usuario = `--accent` con texto `--accent-ink`; asistente = `--card`. Radio 20px con una esquina de 6px junto al emisor.
- **Barra de pestañas:** blanca, ícono activo dentro de una píldora `--accent`.
- **Campos:** `--card`, borde 1.5px `--line`, radio 16px, 52px de alto; foco con borde `--fg`.
- **Insignias:** pastilla completa; "texto leído" en `--good`, "pendiente" en `--warn`.
Estados: toda zona tocable ≥ 44px; foco visible siempre.

## 5. Layout Principles
Base 4px. Escala: 4, 8, 12, 16, 24, 32, 48. Contenedor máximo 640px, márgenes laterales de 16px. Una columna en móvil; rejilla de 2 columnas para tarjetas. Los grupos se separan con `gap`, no con márgenes.

## 6. Depth & Elevation
Sin sombras en tarjetas. Jerarquía por superficie: fondo gris, tarjeta blanca, acento lima. Única sombra permitida: la barra de pestañas y el aviso modal (sutil).

## 7. Do's and Don'ts
Do: un solo acento lima; radio 24px consistente; titulares gruesos y cortos; íconos de línea de 2px; contraste AA.
Don't: emojis como íconos; barras de color al borde de tarjetas; más de un acento (el dorado es solo detalle); sombras pesadas.

## 8. Responsive Behavior
Diseño móvil primero (≥ 360px). Sobre 640px el contenido se centra con ancho máximo. Respeta `safe-area-inset-*`. Respeta `prefers-reduced-motion` y `prefers-color-scheme`.

## 9. Agent Prompt Guide
Colores rápidos: azul #1d4f91, marino #0b2545, dorado #b7791f, fondo #f2f5fa, texto #0b1b33. Prompt: "Pantalla móvil de PoliGT: fondo gris azulado, tarjetas blancas de 24px, héroe en degradado marino-azul con detalle dorado, titulares Inter 800, íconos Lucide, sin emojis."
