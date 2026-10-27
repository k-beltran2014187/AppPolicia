# DESIGN.md — PoliGT

Sistema visual de PoliGT, inspirado en el análisis independiente de Wise (VoltAgent/awesome-design-md). No usa logos, textos ni la fuente propietaria de Wise. Debe sentirse **claro, de confianza y fácil de leer bajo estrés**, en un teléfono, con una mano.

## 1. Visual Theme & Atmosphere
Amigable y directo. Acento único verde lima sobre neutros grisáceos con tinte verde. Tipografía display muy gruesa para titulares cortos; texto de lectura en peso regular. Tarjetas blancas grandes y muy redondeadas. La profundidad viene del contraste de superficies, no de sombras. Sin emojis: solo íconos de línea (Lucide).

## 2. Color Palette & Roles
| Token | Claro | Oscuro | Rol |
|---|---|---|---|
| `--accent` | #9fe870 | #9fe870 | Único acento: CTA principal, estado activo, burbuja del usuario |
| `--accent-ink` | #163300 | #163300 | Texto/ícono sobre el acento |
| `--accent-soft` | #e2f6d5 | #223319 | Fondo suave de íconos y estados "bien" |
| `--bg` | #e8ebe6 | #0e0f0c | Fondo de página (gris con tinte verde) |
| `--card` | #ffffff | #181a16 | Tarjetas y paneles |
| `--fg` | #0e0f0c | #f1f3ee | Texto principal |
| `--muted` | #5d625a | #a3a99d | Texto secundario |
| `--line` | #d3d8cf | #2b2e27 | Bordes de 1px |
| `--link` | #163300 | #9fe870 | Enlaces y chips |
| `--good` | #2f7d1f | #8fdc5f | Positivo |
| `--warn` | #8a5a00 | #f2bf4f | Advertencia, "pendiente de validación" |
| `--bad` | #b3261e | #ff8f87 | Error, "evita", acciones destructivas |
| `--bad-soft` | #fbe4e1 | #3a1c19 | Fondo suave de "evita" |
El verde lima se reserva para la acción principal y el estado activo. No se introduce un segundo acento de marca.

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
Don't: emojis como íconos; barras de color al borde de tarjetas; segundo color de marca; sombras pesadas; texto lima sobre blanco (ilegible).

## 8. Responsive Behavior
Diseño móvil primero (≥ 360px). Sobre 640px el contenido se centra con ancho máximo. Respeta `safe-area-inset-*`. Respeta `prefers-reduced-motion` y `prefers-color-scheme`.

## 9. Agent Prompt Guide
Colores rápidos: lima #9fe870, tinta verde #163300, fondo #e8ebe6, texto #0e0f0c. Prompt: "Pantalla móvil de PoliGT en estilo Wise: fondo gris verdoso, tarjetas blancas de 24px, un único CTA lima con texto verde oscuro, titulares Inter 900, íconos Lucide, sin emojis."
