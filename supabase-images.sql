-- Run this ONCE in Supabase: SQL Editor > New query > paste > Run.
-- It is safe to run again if you are not sure whether you already did.

-- 1. New columns for photos and description
alter table public.products add column if not exists images text[] not null default '{}';
alter table public.products add column if not exists description text not null default '';

-- 2. Public storage bucket for the photos
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- 3. Anyone can see photos; only logged-in admins can add, change or delete them
drop policy if exists "product images are public"      on storage.objects;
drop policy if exists "admins upload product images"   on storage.objects;
drop policy if exists "admins update product images"   on storage.objects;
drop policy if exists "admins delete product images"   on storage.objects;

create policy "product images are public"    on storage.objects for select using (bucket_id = 'product-images');
create policy "admins upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images');
create policy "admins update product images" on storage.objects for update to authenticated using (bucket_id = 'product-images');
create policy "admins delete product images" on storage.objects for delete to authenticated using (bucket_id = 'product-images');
