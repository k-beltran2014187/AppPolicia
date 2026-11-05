-- SOSgt: esquema de base de datos para Supabase.
-- Cómo usarlo: Supabase > SQL Editor > New query > pegar TODO este archivo > Run.
-- Es seguro ejecutarlo más de una vez.

-- 1) Perfil de la persona (datos de registro). Solo el dueño puede leerlo.
create table if not exists public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  first_name     text not null check (char_length(first_name) between 1 and 40),
  second_name    text check (second_name is null or char_length(second_name) <= 40),
  first_surname  text not null check (char_length(first_surname) between 1 and 40),
  second_surname text check (second_surname is null or char_length(second_surname) <= 40),
  phone          text not null unique check (phone ~ '^[0-9]{8}$'),
  email          text not null,
  dpi            text not null check (dpi ~ '^[0-9]{13}$'),
  consent_at     timestamptz,
  created_at     timestamptz not null default now()
);
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (auth.uid() = id);
-- No hay políticas de insert/update/delete para clientes: el perfil lo crea el
-- trigger de abajo y se borra en cascada al eliminar la cuenta.

-- 2) Ajustes sincronizados (idioma, rol, contacto de confianza).
create table if not exists public.user_settings (
  user_id         uuid primary key references auth.users(id) on delete cascade,
  lang            text check (lang in ('es','en')),
  role            text check (role in ('civil','officer')),
  trusted_contact text check (trusted_contact is null or char_length(trusted_contact) <= 40),
  updated_at      timestamptz not null default now()
);
alter table public.user_settings enable row level security;

drop policy if exists "settings_select_own" on public.user_settings;
create policy "settings_select_own" on public.user_settings
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "settings_insert_own" on public.user_settings;
create policy "settings_insert_own" on public.user_settings
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "settings_update_own" on public.user_settings;
create policy "settings_update_own" on public.user_settings
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 3) Al registrarse, crear el perfil con los datos del formulario.
--    Si falta o es inválido algún dato (p. ej. DPI de 13 dígitos), el registro se rechaza.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, first_name, second_name, first_surname, second_surname, phone, email, dpi, consent_at)
  values (
    new.id,
    trim(new.raw_user_meta_data->>'first_name'),
    nullif(trim(coalesce(new.raw_user_meta_data->>'second_name', '')), ''),
    trim(new.raw_user_meta_data->>'first_surname'),
    nullif(trim(coalesce(new.raw_user_meta_data->>'second_surname', '')), ''),
    trim(new.raw_user_meta_data->>'phone'),
    new.email,
    trim(new.raw_user_meta_data->>'dpi'),
    nullif(new.raw_user_meta_data->>'consent_at', '')::timestamptz
  );
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();