# Activar cuentas (registro, login, rostro/huella)

La app ya trae todo el código. Sin estos pasos sigue funcionando como antes, sin cuentas.
Son unos 15 minutos y no necesitas programar.

## 1. Crear el proyecto en Supabase
1. Entra a https://supabase.com e inicia sesión (o crea tu cuenta gratis).
2. **New project**. Nombre: `sosgt`. Región: la más cercana a Guatemala (por ejemplo *East US*).
3. Inventa una **Database password** larga y guárdala en un gestor de contraseñas. No se la pases a nadie.

## 2. Crear las tablas
1. En el menú izquierdo: **SQL Editor** > **New query**.
2. Abre el archivo `supabase/schema.sql` de este repositorio, copia **todo** su contenido, pégalo y pulsa **Run**.
3. Debe decir *Success*. Si lo ejecutas dos veces no pasa nada.

## 3. Configurar el acceso
1. **Authentication** > **Providers** > **Email**: activado.
2. **Authentication** > **Sign In / Providers** (o *Policies*): longitud mínima de contraseña **8**.
3. **Confirm email** (confirmar correo):
   - **Activado (recomendado para publicar):** la persona confirma su correo antes de entrar.
   - **Desactivado:** entra de inmediato. Más fácil para probar, pero cualquiera puede registrarse con un correo ajeno.
4. **Authentication** > **URL Configuration**:
   - **Site URL:** la dirección final de la app (por ahora, la de Vercel de producción).
   - **Redirect URLs:** agrega `https://app-policia-git-*-kb-9c3a.vercel.app/**` (para las versiones de prueba) y la dirección de producción con `/**`.

## 4. Copiar las claves
**Project Settings** > **API**. Necesitas tres datos:

| Dato | Dónde | ¿Es secreto? |
|------|-------|--------------|
| Project URL | `https://xxxx.supabase.co` | No |
| `anon` `public` key | clave larga que empieza con `eyJ...` | No (va dentro de la app) |
| `service_role` key | otra clave larga | **SÍ, muy secreta** |

La `service_role` salta todas las reglas de seguridad. Nunca la pegues en el código, en un chat ni en un correo.

## 5. Ponerlas en Vercel
Vercel > tu proyecto **app-policia** > **Settings** > **Environment Variables**. Agrega estas tres, marcando **Production** y **Preview**:

| Nombre | Valor |
|--------|-------|
| `VITE_SUPABASE_URL` | Project URL |
| `VITE_SUPABASE_ANON_KEY` | clave `anon` |
| `SUPABASE_SERVICE_ROLE_KEY` | clave `service_role` (márcala como **Sensitive**) |

Opcional: `VITE_CONTACT_EMAIL` = el correo que aparecerá en la Política de privacidad.

Luego **Deployments** > el último > **Redeploy** (las variables solo se aplican en un despliegue nuevo).

## 6. Probar
1. Abre la app: debe aparecer *Inicia sesión*.
2. **Crear cuenta** con tus datos reales. Si activaste confirmación, abre el correo.
3. Entra con tu correo, cierra sesión y entra con tu **celular**.
4. Cierra y abre la app: sigues dentro.
5. **Menú > Mi cuenta > Entrar con rostro o huella > Activar** (en un teléfono con Face ID o huella).

## Cosas que debes saber
- **DPI:** es un dato sensible. Está protegido (solo su dueño puede leerlo, el chat de IA nunca lo recibe), pero conviene que un abogado revise la Política de privacidad antes de publicar.
- **Rostro/huella:** lo verifica el teléfono. La app no recibe datos biométricos. Funciona en iPhone (Safari/app instalada) y Android (Chrome).
- **Borrar cuenta:** *Mi cuenta > Eliminar* borra el perfil y los ajustes. Las tiendas de apps lo exigen.
- **Correos de Supabase:** el plan gratis limita los correos por hora. Para lanzar de verdad, conecta un proveedor de correo propio en *Authentication > SMTP*.