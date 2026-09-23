-- =============================================================================
-- Vayeko V1 — Migration 006 : Supabase Storage (buckets + règles d'accès)
-- =============================================================================
-- Buckets attendus : avatars | business-assets | product-images
-- Règles : lecture publique ; écriture uniquement dans SON propre dossier
-- (chemin = "<uid>/fichier"), limité aux images ≤ 5 Mo.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('business-assets', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('product-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Lecture publique des trois buckets.
drop policy if exists vayeko_public_read on storage.objects;
create policy vayeko_public_read on storage.objects
  for select
  using (bucket_id in ('avatars', 'business-assets', 'product-images'));

-- Écriture : uniquement dans son dossier <uid>/..., fichiers images.
drop policy if exists vayeko_write_own_folder on storage.objects;
create policy vayeko_write_own_folder on storage.objects
  for insert
  with check (
    bucket_id in ('avatars', 'business-assets', 'product-images')
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
    and lower(name) ~ '\.(jpe?g|png|webp|avif)$'
  );

-- Mise à jour / suppression : uniquement ses propres fichiers.
drop policy if exists vayeko_update_own_folder on storage.objects;
create policy vayeko_update_own_folder on storage.objects
  for update
  using (
    bucket_id in ('avatars', 'business-assets', 'product-images')
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists vayeko_delete_own_folder on storage.objects;
create policy vayeko_delete_own_folder on storage.objects
  for delete
  using (
    bucket_id in ('avatars', 'business-assets', 'product-images')
    and auth.role() = 'authenticated'
    and auth.uid() = owner
  );
