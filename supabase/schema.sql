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
  grade text check (grade in ('8', '9', '10', '11', 'college')),
  source text not null default 'hero_form' check (source in ('hero_form', 'consultation_form', 'feedback_form', 'webinar_form')),
  status text not null default 'new' check (status in ('new', 'in_progress', 'done')),
  notes text,
  created_at timestamptz not null default now()
);

alter table public.leads add column if not exists notes text;
alter table public.leads add column if not exists lead_number bigserial unique;
alter table public.leads add column if not exists grade text;

create table if not exists public.site_sections (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  content jsonb not null default '{}'::jsonb,
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.benefits (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  title_en text,
  title_sk text,
  text text not null,
  text_en text,
  text_sk text,
  position int not null default 0,
  visible boolean not null default true
);

create table if not exists public.steps (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_en text,
  title_sk text,
  description text not null,
  description_en text,
  description_sk text,
  image_url text,
  position int not null default 0,
  visible boolean not null default true
);

create table if not exists public.cost_items (
  id uuid primary key default gen_random_uuid(),
  amount text not null,
  label text not null,
  label_en text,
  label_sk text,
  position int not null default 0,
  visible boolean not null default true
);

create table if not exists public.top_reasons (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  title_en text,
  title_sk text,
  text text not null,
  text_en text,
  text_sk text,
  position int not null default 0,
  visible boolean not null default true
);

alter table public.top_reasons add column if not exists title text not null default '';
alter table public.top_reasons add column if not exists title_en text;
alter table public.top_reasons add column if not exists title_sk text;

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_en text,
  name_sk text,
  quote text not null,
  quote_en text,
  quote_sk text,
  meta text,
  meta_en text,
  meta_sk text,
  photo text,
  position int not null default 0,
  visible boolean not null default true
);

alter table public.testimonials add column if not exists photo text;

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
-- SEED DATA (exact copy from the approved v3 design, in UA/EN/SK;
-- freely editable via /admin). For an EXISTING already-seeded database,
-- run supabase/migration_v3_redesign.sql instead — it adds the columns
-- above and replaces old placeholder content; this block only fires on
-- a fresh install where these tables are still empty.
-- =========================================================

insert into public.site_sections (key, content) values
('header', '{"cta": {"uk": "Залишити заявку", "en": "Get in touch", "sk": "Nechať žiadosť"}}'::jsonb),
('hero', '{
  "eyebrow": {"uk": "Вища освіта в Європі · для українців", "en": "Higher education in Europe · for Ukrainians", "sk": "Vysokoškolské vzdelanie v Európe · pre Ukrajincov"},
  "title_main": {"uk": "Стань студентом", "en": "Become a student at a", "sk": "Staň sa študentom"},
  "title_emphasis": {"uk": "словацького", "en": "Slovak", "sk": "slovenskej"},
  "title_suffix": {"uk": "університету", "en": "university", "sk": "univerzity"},
  "paragraph": {"uk": "Безкоштовне навчання, гуртожиток поруч із корпусом і ВНЖ на весь період. Результати НМТ не враховуються — ми супроводжуємо вступ від консультації до зарахування.", "en": "Free tuition, a dormitory right next to campus, and a residence permit for your whole studies. NMT results don''t matter — we guide you from consultation to enrollment.", "sk": "Bezplatné štúdium, internát priamo pri kampuse a povolenie na pobyt na celé štúdium. Výsledky NMT sa neberú do úvahy — sprevádzame ťa od konzultácie až po zápis."},
  "cta_primary": {"uk": "Отримати консультацію", "en": "Get a consultation", "sk": "Získať konzultáciu"},
  "cta_secondary": {"uk": "Як це працює", "en": "How it works", "sk": "Ako to funguje"},
  "bullets": [
    {"uk": "Безкоштовна освіта", "en": "Free education", "sk": "Bezplatné vzdelanie"},
    {"uk": "Без результатів НМТ", "en": "No NMT required", "sk": "Bez výsledkov NMT"},
    {"uk": "Гуртожиток поруч", "en": "Dormitory nearby", "sk": "Internát nablízku"}
  ],
  "image": "/images/hero.webp",
  "stat1_value": "150+",
  "stat1_label": {"uk": "абітурієнтів цього року", "en": "applicants this year", "sk": "uchádzačov tento rok"},
  "stat2_badge": "100%",
  "stat2_text": {"uk": "гарантія вступу при вчасній подачі документів", "en": "guarantee of admission with documents submitted on time", "sk": "záruka prijatia pri včasnom podaní dokumentov"}
}'::jsonb),
('why_us', '{
  "title_main": {"uk": "Безкоштовна вища освіта в", "en": "Free higher education in", "sk": "Bezplatné vysokoškolské vzdelanie v"},
  "title_emphasis": {"uk": "Європі", "en": "Europe", "sk": "Európe"},
  "paragraph": {"uk": "З професійним супроводом вступ не складніший, ніж в Україні. А переваг — суттєво більше.", "en": "With professional guidance, admission is no harder than in Ukraine. And the benefits are significantly greater.", "sk": "S odborným sprevádzaním nie je prijatie náročnejšie ako na Ukrajine. A výhod je oveľa viac."},
  "image": "/images/why-us-v2.webp"
}'::jsonb),
('steps_intro', '{
  "title": {"uk": "Шість кроків до зарахування", "en": "Six steps to enrollment", "sk": "Šesť krokov k zápisu"},
  "paragraph": {"uk": "Працюємо офіційно, за договором. Ви завжди знаєте, що відбувається і що далі.", "en": "We work officially, under contract. You always know what''s happening and what''s next.", "sk": "Pracujeme oficiálne, na základe zmluvy. Vždy vieš, čo sa deje a čo bude ďalej."}
}'::jsonb),
('cost', '{
  "title": {"uk": "Скільки коштує студентське життя у Словаччині?", "en": "How much does student life cost in Slovakia?", "sk": "Koľko stojí študentský život na Slovensku?"},
  "paragraph": {"uk": "Навчання у державних університетах словацькою мовою — безкоштовне. Основні щомісячні витрати студента становлять лише:", "en": "Tuition at state universities in the Slovak language is free. A student''s main monthly expenses are just:", "sk": "Štúdium na štátnych univerzitách v slovenskom jazyku je bezplatné. Hlavné mesačné výdavky študenta sú len:"},
  "note": {"uk": "💶 У середньому студенту достатньо 200–250 € на місяць для комфортного життя в Словаччині (без урахування особистих покупок та подорожей).", "en": "💶 On average, 200–250 € a month is enough for a student to live comfortably in Slovakia (not including personal purchases and travel).", "sk": "💶 Študentovi v priemere stačí 200–250 € mesačne na pohodlný život na Slovensku (bez osobných nákupov a ciest)."}
}'::jsonb),
('top_reasons_intro', '{
  "title_main": {"uk": "Чому обирають", "en": "Why they choose", "sk": "Prečo si vyberajú"},
  "title_emphasis": {"uk": "VipStudy", "en": "VipStudy", "sk": "VipStudy"},
  "image": "/images/top-reasons.webp"
}'::jsonb),
('testimonials_intro', '{"title": {"uk": "Відгуки студентів", "en": "Student reviews", "sk": "Recenzie študentov"}}'::jsonb),
('feedback_form', '{
  "title_main": {"uk": "Залиште контакти —", "en": "Leave your contact —", "sk": "Zanechaj kontakt —"},
  "title_emphasis": {"uk": "передзвонимо", "en": "we''ll call you back", "sk": "zavoláme ti späť"},
  "paragraph": {"uk": "Фахівець безкоштовно відповість на всі питання про навчання у Словаччині.", "en": "A specialist will answer all your questions about studying in Slovakia for free.", "sk": "Špecialista bezplatne odpovie na všetky otázky o štúdiu na Slovensku."},
  "submit_label": {"uk": "Надіслати", "en": "Send", "sk": "Odoslať"},
  "footnote": {"uk": "Працюємо офіційно · договір у двох примірниках · відповідаємо протягом дня", "en": "We work officially · contract in two copies · we respond within a day", "sk": "Pracujeme oficiálne · zmluva v dvoch vyhotoveniach · odpovedáme do jedného dňa"}
}'::jsonb),
('thank_you', '{"message": {"uk": "Дякуємо! Зв''яжемося з вами найближчим часом.", "en": "Thank you! We''ll contact you shortly.", "sk": "Ďakujeme! Čoskoro sa vám ozveme."}}'::jsonb),
('footer', '{"copyright": {"uk": "© 2026 VipStudy · Навчання у Словаччині", "en": "© 2026 VipStudy · Study in Slovakia", "sk": "© 2026 VipStudy · Štúdium na Slovensku"}}'::jsonb),
('webinar', '{"date": "2026-07-28T15:00:00.000Z"}'::jsonb)
on conflict (key) do nothing;

insert into public.benefits (title, title_en, title_sk, text, text_en, text_sk, position) values
('Безкоштовне навчання', 'Free education', 'Bezplatné vzdelanie', 'Навчайтеся у державних університетах без оплати за навчання.', 'Study at public universities free of tuition fees.', 'Študuj na štátnych univerzitách bez poplatkov za štúdium.', 1),
('Вступ без НМТ', 'Admission without NMT', 'Prijatie bez NMT', 'Для більшості спеціальностей достатньо атестата.', 'A school certificate is enough for most majors.', 'Pre väčšinu odborov stačí vysvedčenie.', 2),
('Легка адаптація', 'Easy adaptation', 'Ľahká adaptácia', 'Словацька мова близька до української, тому звикнути набагато простіше.', 'Slovak is close to Ukrainian, so settling in is much easier.', 'Slovenčina je blízka ukrajinčine, takže zvyknúť si je oveľa jednoduchšie.', 3),
('ВНЖ на весь період навчання', 'Residence permit for the whole studies', 'Povolenie na pobyt na celé štúdium', 'Офіційне проживання в Словаччині протягом усього навчання.', 'Official residence in Slovakia for the entire duration of your studies.', 'Oficiálny pobyt na Slovensku počas celého štúdia.', 4),
('Безпечне середовище', 'Safe environment', 'Bezpečné prostredie', 'Комфортне студентське життя та високий рівень безпеки.', 'Comfortable student life and a high level of safety.', 'Pohodlný študentský život a vysoká úroveň bezpečnosti.', 5)
on conflict do nothing;

insert into public.steps (title, title_en, title_sk, description, description_en, description_sk, position) values
('Знайомство та консультація', 'Introduction and consultation', 'Zoznámenie a konzultácia', 'Обговорюємо ваші цілі, відповідаємо на всі запитання та будуємо індивідуальний план вступу.', 'We discuss your goals, answer all your questions, and build a personal admission plan.', 'Prediskutujeme tvoje ciele, odpovieme na všetky otázky a zostavíme individuálny plán prijatia.', 1),
('Офіційне оформлення', 'Official paperwork', 'Oficiálne vybavenie', 'Укладаємо договір і розпочинаємо повний супровід до моменту зарахування.', 'We sign a contract and begin full support all the way to enrollment.', 'Uzavrieme zmluvu a začneme kompletné sprevádzanie až po zápis.', 2),
('Вибір університету', 'Choosing a university', 'Výber univerzity', 'Підбираємо спеціальність і університети відповідно до ваших побажань та шансів на вступ.', 'We select a major and universities based on your preferences and chances of admission.', 'Vyberieme odbor a univerzity podľa tvojich preferencií a šancí na prijatie.', 3),
('Підготовка документів', 'Document preparation', 'Príprava dokumentov', 'Допомагаємо з оформленням усіх документів, нострифікацією та поданням заяв.', 'We help prepare all documents, handle nostrification, and submit applications.', 'Pomôžeme s vybavením všetkých dokumentov, nostrifikáciou a podaním prihlášok.', 4),
('Вступ і зарахування', 'Admission and enrollment', 'Prijatie a zápis', 'Контролюємо всі етапи вступу та супроводжуємо до отримання наказу про зарахування.', 'We oversee every stage of admission and support you until you receive the enrollment order.', 'Kontrolujeme všetky fázy prijímacieho konania a sprevádzame ťa až po získanie rozhodnutia o prijatí.', 5),
('Переїзд до Словаччини', 'Moving to Slovakia', 'Presťahovanie na Slovensko', 'Допомагаємо з гуртожитком, оформленням ВНЖ та підтримуємо вас навіть після початку навчання.', 'We help with the dormitory, residence permit paperwork, and support you even after your studies begin.', 'Pomôžeme s internátom, vybavením povolenia na pobyt a podporujeme ťa aj po začiatku štúdia.', 6)
on conflict do nothing;

insert into public.cost_items (amount, label, label_en, label_sk, position) values
('70–140 €', 'Проживання в гуртожитку', 'Dormitory accommodation', 'Bývanie na internáte', 1),
('150–250 €', 'Харчування (обід у студентській їдальні — 2,5–5 €)', 'Food (a meal at the student canteen — €2.5–5)', 'Strava (obed v študentskej jedálni — 2,5–5 €)', 2),
('20 €', 'Студентський проїзний', 'Student transport pass', 'Študentský cestovný lístok', 3),
('15 €', 'Мобільний зв''язок', 'Mobile plan', 'Mobilné služby', 4)
on conflict do nothing;

insert into public.top_reasons (title, title_en, title_sk, text, text_en, text_sk, position) values
('Особистий досвід:', 'Personal experience:', 'Osobná skúsenosť:', 'Наша команда сама навчалася або навчається у Словаччині та пройшла весь шлях вступу.', 'Our team members themselves studied or are studying in Slovakia and went through the entire admission process.', 'Náš tím sám študoval alebo študuje na Slovensku a prešiel celým procesom prijímania.', 1),
('Супровід, який підходить саме вам:', 'Support that fits you:', 'Podpora, ktorá sedí presne vám:', 'Обирайте повний пакет або лише ті послуги, які дійсно потрібні.', 'Choose the full package or only the services you actually need.', 'Vyberte si kompletný balík alebo len tie služby, ktoré naozaj potrebujete.', 2),
('100% вступ:', '100% admission:', '100% prijatie:', 'За умови своєчасної подачі документів, виконання вимог університету та дотримання термінів вступної кампанії.', 'Provided documents are submitted on time, university requirements are met, and admission campaign deadlines are followed.', 'Za predpokladu včasného podania dokumentov, splnenia požiadaviek univerzity a dodržania termínov prijímacej kampane.', 3),
('Підтримка від першої консультації до початку навчання.', 'Support from the first consultation to the start of your studies.', 'Podpora od prvej konzultácie až po začiatok štúdia.', 'Допомагаємо з документами, гуртожитком, ВНЖ та адаптацією у Словаччині.', 'We help with documents, the dormitory, residence permit, and adapting to life in Slovakia.', 'Pomáhame s dokumentmi, internátom, povolením na pobyt a adaptáciou na Slovensku.', 4),
('Понад 500 студентів:', 'Over 500 students:', 'Viac ako 500 študentov:', 'здійснили мрію про навчання в Словаччині разом із VipStudy.', 'made their dream of studying in Slovakia come true with VipStudy.', 'si splnilo sen o štúdiu na Slovensku spolu s VipStudy.', 5)
on conflict do nothing;

insert into public.testimonials (name, name_en, name_sk, quote, quote_en, quote_sk, meta, meta_en, meta_sk, photo, position) values
('Анна Андріївна', 'Anna Andriivna', 'Anna Andrijivna', 'Вступила без НМТ, гуртожиток за п''ять хвилин від корпусу. Хлопці супроводжували на кожному кроці — від договору до міграційної поліції.', 'I got in without NMT, and my dorm is five minutes from campus. The team supported me every step — from the contract to the migration office.', 'Dostala som sa bez NMT, internát mám päť minút od budovy. Tím ma sprevádzal na každom kroku — od zmluvy až po cudzineckú políciu.', 'Економічний університет, Братислава', 'University of Economics, Bratislava', 'Ekonomická univerzita, Bratislava', '/images/testimonial-anna.webp', 1),
('Олексій К.', 'Oleksiy K.', 'Oleksij K.', 'Найбільше боявся документів і нострифікації — усе зробили за мене. Через два місяці вже мав наказ про зарахування.', 'I was most afraid of paperwork and nostrification — they handled it all for me. Two months later I already had my enrollment order.', 'Najviac som sa bál dokumentov a nostrifikácie — všetko za mňa vybavili. O dva mesiace som už mal rozhodnutie o prijatí.', 'Технічний університет, Кошице', 'Technical University, Košice', 'Technická univerzita, Košice', '/images/testimonial-oleksiy.webp', 2)
on conflict do nothing;

insert into public.social_links (platform, url, position) values
('instagram', '#', 1),
('telegram', '#', 2),
('linkedin', '#', 3)
on conflict do nothing;
