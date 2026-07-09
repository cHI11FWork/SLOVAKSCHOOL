-- VipStudy landing + CMS admin — full schema, RLS policies and seed data.
-- Safe to re-run: uses "if not exists" / "on conflict do nothing" throughout.

create extension if not exists pgcrypto;

-- =========================================================
-- TABLES
-- =========================================================

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  source text not null default 'hero_form' check (source in ('hero_form', 'consultation_form', 'feedback_form')),
  status text not null default 'new' check (status in ('new', 'in_progress', 'done')),
  created_at timestamptz not null default now()
);

create table if not exists public.site_sections (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  content jsonb not null default '{}'::jsonb,
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.benefits (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  position int not null default 0,
  visible boolean not null default true
);

create table if not exists public.steps (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  image_url text,
  position int not null default 0,
  visible boolean not null default true
);

create table if not exists public.cost_items (
  id uuid primary key default gen_random_uuid(),
  amount text not null,
  label text not null,
  position int not null default 0,
  visible boolean not null default true
);

create table if not exists public.top_reasons (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  position int not null default 0,
  visible boolean not null default true
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  quote text not null,
  position int not null default 0,
  visible boolean not null default true
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null default '#',
  position int not null default 0,
  visible boolean not null default true
);

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================
-- Public (anon) can read all content tables and insert leads only.
-- All admin mutations go through server code using the service_role key,
-- which bypasses RLS entirely, so no authenticated-role policies are needed.

alter table public.leads enable row level security;
alter table public.site_sections enable row level security;
alter table public.benefits enable row level security;
alter table public.steps enable row level security;
alter table public.cost_items enable row level security;
alter table public.top_reasons enable row level security;
alter table public.testimonials enable row level security;
alter table public.social_links enable row level security;

drop policy if exists "public can insert leads" on public.leads;
create policy "public can insert leads" on public.leads
  for insert to anon, authenticated with check (true);

-- Admin (authenticated) can read leads client-side, so the admin dashboard
-- can subscribe to new-lead notifications over Supabase Realtime.
drop policy if exists "authenticated can read leads" on public.leads;
create policy "authenticated can read leads" on public.leads
  for select to authenticated using (true);

-- Enable Realtime change events for leads (idempotent — errors if run twice otherwise).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'leads'
  ) then
    alter publication supabase_realtime add table public.leads;
  end if;
end $$;

drop policy if exists "public can read site_sections" on public.site_sections;
create policy "public can read site_sections" on public.site_sections
  for select to anon, authenticated using (true);

drop policy if exists "public can read benefits" on public.benefits;
create policy "public can read benefits" on public.benefits
  for select to anon, authenticated using (true);

drop policy if exists "public can read steps" on public.steps;
create policy "public can read steps" on public.steps
  for select to anon, authenticated using (true);

drop policy if exists "public can read cost_items" on public.cost_items;
create policy "public can read cost_items" on public.cost_items
  for select to anon, authenticated using (true);

drop policy if exists "public can read top_reasons" on public.top_reasons;
create policy "public can read top_reasons" on public.top_reasons
  for select to anon, authenticated using (true);

drop policy if exists "public can read testimonials" on public.testimonials;
create policy "public can read testimonials" on public.testimonials
  for select to anon, authenticated using (true);

drop policy if exists "public can read social_links" on public.social_links;
create policy "public can read social_links" on public.social_links
  for select to anon, authenticated using (true);

-- =========================================================
-- STORAGE (bucket for admin-uploaded images)
-- =========================================================

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

drop policy if exists "public can read site-media" on storage.objects;
create policy "public can read site-media" on storage.objects
  for select to anon, authenticated using (bucket_id = 'site-media');

drop policy if exists "authenticated can manage site-media" on storage.objects;
create policy "authenticated can manage site-media" on storage.objects
  for all to authenticated
  using (bucket_id = 'site-media')
  with check (bucket_id = 'site-media');

-- =========================================================
-- SEED DATA (exact copy from the Figma design; freely editable via /admin)
-- =========================================================

insert into public.site_sections (key, content) values
('header', '{
  "nav": [
    {"label": "Чому Словаччина?", "href": "#why-us"},
    {"label": "Співпраця", "href": "#steps"},
    {"label": "Вартість", "href": "#cost"},
    {"label": "Відгуки", "href": "#testimonials"}
  ]
}'::jsonb),
('hero', '{
  "headline": "СТАНЬ СТУДЕНТОМ СЛОВАЦЬКОГО УНІВЕРСИТЕТУ",
  "bullets": ["Безкоштовна освіта", "Результати ЗНО до уваги не беруться", "Сучасні методи навчання", "Гуртожитки поруч з навчальним корпусом"],
  "image": "/images/hero.webp",
  "form_title": "Залиште свої контакти",
  "form_subtitle": "Наші співробітники зв''яжуться з вами і дадуть відповідь на всі питання",
  "form_button": "Надіслати"
}'::jsonb),
('why_us', '{
  "title": "Чому варто поступати у Словаччину?",
  "tag": "НАСКІЛЬКИ СКЛАДНО ОТРИМАТИ ВИЩУ ОСВІТУ В СЛОВАЧЧИНІ ДЛЯ УКРАЇНЦІВ?",
  "paragraph": "Якщо підходити до питання вступу професійно, то ніяких особливих труднощів не виникає. Навпаки, навчання в Словаччині, організована за допомогою фахівців нашої компанії «West Study», є цілком доступною і має важливі переваги, серед яких:",
  "image": "/images/why-us.webp"
}'::jsonb),
('benefits_band', '{
  "title": "5 причин обрати Словаччину для навчання",
  "form_title": "Отримайте онлайн консультацію",
  "form_subtitle": "Наш фахівець безкоштовно відповість на всі ваші питання про навчання у Словаччині. Залишайте заявку і отримайте у подарунок «ЩОСЬ»",
  "form_button": "Зв''язатись"
}'::jsonb),
('steps_intro', '{ "title": "Етапи співпраці" }'::jsonb),
('cost', '{
  "title": "Вартість навчання у Словаччині",
  "paragraph_1": "Сьогодні навчання в Словаччині для українців, вартість якого цілком прийнятна в порівнянні з іншими європейськими країнами, є доступним і вигідним варіантом отримання вищої освіти високого рівня!",
  "paragraph_2": "Отримати безкоштовну вищу освіту в Словаччині можна в різних ВУЗах, на факультетах медицини, економіки, інформаційних технологій. Також популярними є військові, поліцейські, духовні академії."
}'::jsonb),
('top_reasons_intro', '{ "title": "ТОП 5 причин чому обирають VipStudy" }'::jsonb),
('testimonials_intro', '{ "title": "Відгуки" }'::jsonb),
('feedback_form', '{
  "form_title": "Форма зворотного зв''язку",
  "form_subtitle": "Наш фахівець безкоштовно відповість на всі ваші питання про навчання у Словаччині. Залишайте заявку і отримайте у подарунок «ЩОСЬ»",
  "form_button": "Зв''язатись"
}'::jsonb),
('thank_you', '{
  "title": "Дякуємо!",
  "message": "Наш менеджер зв''яжеться з Вами протягом 20 хвилин.",
  "button": "На головну"
}'::jsonb),
('footer', '{
  "nav": [
    {"label": "Чому Словаччина?", "href": "#why-us"},
    {"label": "Співпраця", "href": "#steps"},
    {"label": "Вартість", "href": "#cost"},
    {"label": "Відгуки", "href": "#testimonials"}
  ]
}'::jsonb)
on conflict (key) do nothing;

insert into public.benefits (text, position) values
('Безкоштовне навчання', 1),
('Успішна і безпечна країна', 2),
('Мовний бар''єр мінімальний', 3),
('100% гарантія надходження', 4),
('Отримання ВНЖ на весь період навчання', 5)
on conflict do nothing;

insert into public.steps (title, description, image_url, position) values
('КОНСУЛЬТАЦІЯ', 'Консультація в телефонному режимі, де ми розповімо вам про переваги навчання в Словаччині та ознайомимо вас з етапами вступу.', '/images/step-1.webp', 1),
('ДОГОВІР', 'Підписання угоди. Ми працюємо офіційно як ФОП і всі умови співпраці прописуємо в договорі та відправляємо його вам поштою в 2х примірниках з нашим підписом та печаткою.', '/images/step-2.webp', 2),
('ПІДГОТОВКА', 'Підбір університета та спеціальності. Ми допомагаємо вам зробити вибір, врахувавши ваші побажання. Для гарантії вступу зазвичай обираємо 2 університета, до яких будемо подавати заявки.', '/images/step-3.webp', 3),
('Текст', 'Додаємо вас до нашого ТГ каналу, де інформуємо про документи, які ви маєте нам подати та в які терміни.', '/images/step-4.webp', 4),
('Текст', 'Повідомляємо вас про вступні іспити, якщо вони будуть та форму їх проведення.', '/images/step-5.webp', 5),
('Текст', 'Після умовного зарахування робимо та подаємо до вуза нострифіковані документи.', '/images/step-6.webp', 6),
('Текст', 'Потім ви отримуєте від вуза оригінал приказа про остаточне зарахування.', '/images/step-6.webp', 7),
('Текст', 'При потребі бронюємо вам гуртожиток та оформляємо документи і робимо запис в міграційну поліцію для отримання виду на проживання.', '/images/step-8.webp', 8),
('Текст', 'Надаємо інформаційну підтримку не тільки під час вступу, але й під час навчання.', '/images/step-9.webp', 9)
on conflict do nothing;

insert into public.cost_items (amount, label, position) values
('60-70 €', 'обійдеться житло в гуртожитку', 1),
('10 €', 'коштує проїзний квиток', 2),
('100-130 €', 'знадобиться на харчування (Комплексний обід в їдальні 1,5-2 €)', 3),
('8 €', 'мобільний зв''язок', 4)
on conflict do nothing;

insert into public.top_reasons (text, position) values
('наші люди навчаються в Словаччині та самостійно! пройшли усі етапи вступу', 1),
('агенство VipStudy пропонує свої послуги зі вступу як під ключ, так і окремо на кожному етапі вступу, що дає вам можливість заощадити кошти', 2),
('ми даємо 💯 гарантію вступу за умови вчасного подання усіх документів', 3),
('гнучка цінова політика', 4),
('понад 150 успішних абітурієнтів, які вже скористались нашою допомогою цього року', 5)
on conflict do nothing;

insert into public.testimonials (name, quote, position) values
('Анна Андріївна', 'Сьогодні навчання в Словаччині для українців, вартість якого цілком прийнятна в порівнянні з іншими європейськими країнами, є доступним і вигідним варіантом отримання вищої освіти високого рівня!', 1),
('Анна Андріївна', 'Сьогодні навчання в Словаччині для українців, вартість якого цілком прийнятна в порівнянні з іншими європейськими країнами, є доступним і вигідним варіантом отримання вищої освіти високого рівня!', 2)
on conflict do nothing;

insert into public.social_links (platform, url, position) values
('instagram', '#', 1),
('telegram', '#', 2),
('linkedin', '#', 3)
on conflict do nothing;
