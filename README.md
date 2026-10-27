# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Chat con IA (agente)
La pestaña **Chat** llama a `api/chat.js` (función de Vercel), que guarda la llave y le entrega al modelo la biblioteca de artículos como único conocimiento legal. Sin conexión o si falla, el chat busca en la biblioteca local.

1. Importa el repo en Vercel (detecta Vite solo).
2. Agrega la variable `ANTHROPIC_API_KEY`.
3. Despliega. Para probar local: `npx vercel dev`.

`npm run knowledge` regenera `api/knowledge.js` desde `src/data/laws.ts` (también corre en `npm run build`). Límites básicos: 12 mensajes/minuto por IP, 700 tokens por respuesta; para producción conviene un límite persistente.
