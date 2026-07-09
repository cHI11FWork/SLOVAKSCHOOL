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
  source text not null default 'hero_form' check (source in ('hero_form', 'consultation_form', 'feedback_form')),
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
  text text not null,
  text_en text,
  text_sk text,
  position int not null default 0,
  visible boolean not null default true
);

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
  "title_main": {"uk": "Чому варто обрати", "en": "Why choose", "sk": "Prečo si vybrať"},
  "title_emphasis": {"uk": "Словаччину", "en": "Slovakia", "sk": "Slovensko"},
  "paragraph": {"uk": "З професійним супроводом вступ не складніший, ніж в Україні. А переваг — суттєво більше.", "en": "With professional guidance, admission is no harder than in Ukraine. And the benefits are significantly greater.", "sk": "S odborným sprevádzaním nie je prijatie náročnejšie ako na Ukrajine. A výhod je oveľa viac."},
  "image": "/images/why-us.webp"
}'::jsonb),
('steps_intro', '{
  "title": {"uk": "Шість кроків до зарахування", "en": "Six steps to enrollment", "sk": "Šesť krokov k zápisu"},
  "paragraph": {"uk": "Працюємо офіційно, за договором. Ви завжди знаєте, що відбувається і що далі.", "en": "We work officially, under contract. You always know what''s happening and what''s next.", "sk": "Pracujeme oficiálne, na základe zmluvy. Vždy vieš, čo sa deje a čo bude ďalej."}
}'::jsonb),
('cost', '{
  "title": {"uk": "Скільки коштує життя студента", "en": "How much does student life cost", "sk": "Koľko stojí život študenta"},
  "paragraph": {"uk": "Навчання в державних вишах — безкоштовне. Медицина, економіка, ІТ, військові та поліцейські академії. Платите лише за побут:", "en": "Tuition at state universities is free. Medicine, economics, IT, military and police academies. You only pay for living costs:", "sk": "Štúdium na štátnych vysokých školách je bezplatné. Medicína, ekonómia, IT, vojenské a policajné akadémie. Platíš len za bývanie a život:"}
}'::jsonb),
('top_reasons_intro', '{
  "title_main": {"uk": "Чому обирають", "en": "Why they choose", "sk": "Prečo si vyberajú"},
  "title_emphasis": {"uk": "VipStudy", "en": "VipStudy", "sk": "VipStudy"}
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
('footer', '{"copyright": {"uk": "© 2026 VipStudy · Навчання у Словаччині", "en": "© 2026 VipStudy · Study in Slovakia", "sk": "© 2026 VipStudy · Štúdium na Slovensku"}}'::jsonb)
on conflict (key) do nothing;

insert into public.benefits (title, title_en, title_sk, text, text_en, text_sk, position) values
('Безкоштовне навчання', 'Free education', 'Bezplatné vzdelanie', 'Державні університети не беруть плату зі студентів.', 'State universities charge no tuition fees.', 'Štátne univerzity si od študentov neúčtujú školné.', 1),
('Без результатів НМТ', 'No NMT required', 'Bez výsledkov NMT', 'Вступ за атестатом — бали НМТ не враховуються.', 'Admission by certificate — NMT scores don''t count.', 'Prijatie na základe vysvedčenia — výsledky NMT sa nepočítajú.', 2),
('Мінімальний мовний бар''єр', 'Minimal language barrier', 'Minimálna jazyková bariéra', 'Словацька близька до української — адаптація за семестр.', 'Slovak is close to Ukrainian — you adapt within a semester.', 'Slovenčina je blízka ukrajinčine — adaptácia za jeden semester.', 3),
('ВНЖ на весь період', 'Residence permit for the whole period', 'Povolenie na pobyt na celé štúdium', 'Легальне проживання в ЄС на час навчання.', 'Legal residence in the EU for the duration of your studies.', 'Legálny pobyt v EÚ počas celého štúdia.', 4),
('Безпечна країна', 'Safe country', 'Bezpečná krajina', 'Стабільна економіка та комфортне студентське життя.', 'Stable economy and comfortable student life.', 'Stabilná ekonomika a pohodlný študentský život.', 5)
on conflict do nothing;

insert into public.steps (title, title_en, title_sk, description, description_en, description_sk, position) values
('Консультація', 'Consultation', 'Konzultácia', 'Телефонна розмова: переваги навчання, етапи вступу, відповіді на питання.', 'A phone call: benefits of studying, admission stages, answers to your questions.', 'Telefonický rozhovor: výhody štúdia, etapy prijatia, odpovede na otázky.', 1),
('Договір', 'Contract', 'Zmluva', 'Офіційна угода у двох примірниках з підписом і печаткою — поштою вам.', 'An official agreement in two copies, signed and stamped — mailed to you.', 'Oficiálna dohoda v dvoch vyhotoveniach, podpísaná a opečiatkovaná — pošleme ti ju poštou.', 2),
('Вибір університету', 'Choosing a university', 'Výber univerzity', 'Підбираємо спеціальність і два виші для гарантії вступу.', 'We select a major and two universities to guarantee admission.', 'Vyberieme odbor a dve univerzity pre záruku prijatia.', 3),
('Документи', 'Documents', 'Dokumenty', 'Супровід у Telegram: які документи подати та в які терміни. Нострифікація — на нас.', 'Support via Telegram: which documents to submit and by when. Nostrification is on us.', 'Podpora cez Telegram: ktoré dokumenty podať a dokedy. Nostrifikáciu riešime za teba.', 4),
('Іспити та зарахування', 'Exams and enrollment', 'Skúšky a zápis', 'Інформуємо про вступні іспити, отримуєте оригінал наказу про зарахування.', 'We inform you about entrance exams and you receive the original enrollment order.', 'Informujeme ťa o prijímacích skúškach, dostaneš originál rozhodnutia o prijatí.', 5),
('Переїзд і супровід', 'Move and support', 'Presťahovanie a podpora', 'Бронюємо гуртожиток, оформлюємо ВНЖ і підтримуємо під час навчання.', 'We book a dormitory, arrange your residence permit, and support you during your studies.', 'Zarezervujeme internát, vybavíme povolenie na pobyt a podporujeme ťa počas štúdia.', 6)
on conflict do nothing;

insert into public.cost_items (amount, label, label_en, label_sk, position) values
('60–70 €', 'житло в гуртожитку на місяць', 'dormitory housing per month', 'bývanie na internáte mesačne', 1),
('100–130 €', 'харчування (обід у їдальні — 1,5–2 €)', 'food (a full meal at the canteen — €1.5–2)', 'strava (obed v jedálni — 1,5–2 €)', 2),
('10 €', 'проїзний квиток', 'transport pass', 'cestovný lístok', 3),
('8 €', 'мобільний зв''язок', 'mobile plan', 'mobilné služby', 4)
on conflict do nothing;

insert into public.top_reasons (text, text_en, text_sk, position) values
('Наші люди самі навчаються в Словаччині й особисто пройшли всі етапи вступу.', 'Our own people study in Slovakia and went through every stage of admission themselves.', 'Naši ľudia sami študujú na Slovensku a osobne prešli všetkými etapami prijatia.', 1),
('Послуги під ключ або окремо на кожному етапі — можна заощадити.', 'Full-service or step-by-step help — so you can save money.', 'Služby na kľúč alebo po jednotlivých etapách — môžeš ušetriť.', 2),
('100% гарантія вступу за умови вчасного подання документів.', '100% admission guarantee if documents are submitted on time.', '100% záruka prijatia pri včasnom podaní všetkých dokumentov.', 3),
('Гнучка цінова політика.', 'Flexible pricing.', 'Flexibilná cenová politika.', 4),
('Понад 150 успішних абітурієнтів лише цього року.', 'Over 150 successful applicants this year alone.', 'Viac ako 150 úspešných uchádzačov len tento rok.', 5)
on conflict do nothing;

insert into public.testimonials (name, name_en, name_sk, quote, quote_en, quote_sk, meta, meta_en, meta_sk, position) values
('Анна Андріївна', 'Anna Andriivna', 'Anna Andrijivna', 'Вступила без НМТ, гуртожиток за п''ять хвилин від корпусу. Хлопці супроводжували на кожному кроці — від договору до міграційної поліції.', 'I got in without NMT, and my dorm is five minutes from campus. The team supported me every step — from the contract to the migration office.', 'Dostala som sa bez NMT, internát mám päť minút od budovy. Tím ma sprevádzal na každom kroku — od zmluvy až po cudzineckú políciu.', 'Економічний університет, Братислава', 'University of Economics, Bratislava', 'Ekonomická univerzita, Bratislava', 1),
('Олексій К.', 'Oleksiy K.', 'Oleksij K.', 'Найбільше боявся документів і нострифікації — усе зробили за мене. Через два місяці вже мав наказ про зарахування.', 'I was most afraid of paperwork and nostrification — they handled it all for me. Two months later I already had my enrollment order.', 'Najviac som sa bál dokumentov a nostrifikácie — všetko za mňa vybavili. O dva mesiace som už mal rozhodnutie o prijatí.', 'Технічний університет, Кошиці', 'Technical University, Košice', 'Technická univerzita, Košice', 2)
on conflict do nothing;

insert into public.social_links (platform, url, position) values
('instagram', '#', 1),
('telegram', '#', 2),
('linkedin', '#', 3)
on conflict do nothing;
