-- Suryah Medicals: Supabase setup
-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run

create table if not exists public.products (
  id         bigint generated always as identity primary key,
  cat        text    not null,
  name       text    not null,
  pack       text    not null default '',
  price      numeric(10,2) not null check (price >= 0),
  mrp        numeric(10,2),
  shape      text    not null default 'box',
  rx         boolean not null default false,
  deal       boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Everyone (customers) can read products
drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
  on public.products for select
  using (true);

-- Only logged-in users (you, the admin) can add / edit / delete
drop policy if exists "Admin can insert products" on public.products;
create policy "Admin can insert products"
  on public.products for insert
  to authenticated
  with check (true);

drop policy if exists "Admin can update products" on public.products;
create policy "Admin can update products"
  on public.products for update
  to authenticated
  using (true) with check (true);

drop policy if exists "Admin can delete products" on public.products;
create policy "Admin can delete products"
  on public.products for delete
  to authenticated
  using (true);

-- Import the current sample products (only if the table is empty)
insert into public.products (cat, name, pack, price, mrp, shape, rx, deal)
select * from (values
  ('medicines',   'Paracetamol 500 mg tablets',   'Strip of 15',       30,   null, 'strip',  false, false),
  ('medicines',   'Cetirizine 10 mg tablets',     'Strip of 10',       25,   null, 'strip',  false, false),
  ('medicines',   'Amoxicillin 500 mg capsules',  'Strip of 10',       95,   null, 'strip',  true,  false),
  ('medicines',   'ORS electrolyte powder',       'Pack of 5 sachets', 60,   70,   'box',    false, true),
  ('mother-baby', 'Baby diaper pants, medium',    '36 pieces',         549,  599,  'box',    false, true),
  ('mother-baby', 'Baby moisturising lotion',     '200 ml',            210,  null, 'bottle', false, false),
  ('mother-baby', 'Maternal multivitamin',        '30 tablets',        320,  null, 'jar',    false, false),
  ('mother-baby', 'Baby wipes, fragrance free',   '72 wipes',          149,  null, 'box',    false, false),
  ('wellness',    'Vitamin C 500 mg chewable',    '60 tablets',        180,  210,  'jar',    false, true),
  ('wellness',    'Calcium with vitamin D3',      '30 tablets',        210,  null, 'jar',    false, false),
  ('wellness',    'Omega-3 fish oil 1000 mg',     '60 capsules',       499,  599,  'bottle', false, true),
  ('sports',      'Whey protein, unflavoured',    '1 kg',              2199, null, 'jar',    false, false),
  ('sports',      'Creatine monohydrate',         '250 g',             899,  null, 'jar',    false, false),
  ('sports',      'Electrolyte energy powder',    '500 g',             349,  399,  'jar',    false, true),
  ('herbal',      'Ashwagandha root capsules',    '60 capsules',       299,  null, 'bottle', false, false),
  ('herbal',      'Triphala churna',              '100 g',             120,  null, 'box',    false, false),
  ('herbal',      'Chyawanprash',                 '500 g',             210,  null, 'jar',    false, false),
  ('surgical',    'Digital thermometer',          '1 unit',            150,  null, 'device', false, false),
  ('surgical',    'Pulse oximeter',               '1 unit',            899,  1099, 'device', false, true),
  ('surgical',    'Automatic BP monitor',         '1 unit',            1499, null, 'device', false, false),
  ('surgical',    'Crepe bandage, 6 cm',          '1 roll',            90,   null, 'box',    false, false),
  ('foods',       'Rolled oats',                  '1 kg',              180,  null, 'box',    false, false),
  ('foods',       'Nutrition drink for adults',   '400 g',             520,  null, 'jar',    false, false),
  ('foods',       'Mixed seeds',                  '250 g',             210,  null, 'box',    false, false),
  ('personal',    'Hand sanitiser',               '500 ml',            180,  null, 'bottle', false, false),
  ('personal',    'Body moisturising lotion',     '400 ml',            360,  null, 'bottle', false, false),
  ('personal',    'Sunscreen SPF 50',             '50 g',              399,  450,  'tube',   false, true),
  ('personal',    'Anti-dandruff shampoo',        '340 ml',            290,  null, 'bottle', false, false)
) as v(cat, name, pack, price, mrp, shape, rx, deal)
where not exists (select 1 from public.products);
