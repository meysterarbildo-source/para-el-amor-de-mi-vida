-- Ejecutar una sola vez en Supabase > SQL Editor.
-- Este script crea la tabla de medios, el bucket y políticas RLS.

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  media_type text not null check (media_type in ('image', 'video')),
  title text,
  description text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.media enable row level security;

drop policy if exists "Public can view published media" on public.media;
create policy "Public can view published media"
  on public.media for select
  using (is_published = true);

drop policy if exists "Authenticated users can manage media" on public.media;
create policy "Authenticated users can manage media"
  on public.media for all to authenticated
  using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- Solo usuarios autenticados pueden subir, actualizar o eliminar objetos.
drop policy if exists "Authenticated users can upload media" on storage.objects;
create policy "Authenticated users can upload media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media');

drop policy if exists "Authenticated users can update media" on storage.objects;
create policy "Authenticated users can update media"
  on storage.objects for update to authenticated
  using (bucket_id = 'media') with check (bucket_id = 'media');

drop policy if exists "Authenticated users can delete media" on storage.objects;
create policy "Authenticated users can delete media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media');

create index if not exists media_published_created_idx
  on public.media (is_published, created_at desc);
