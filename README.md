# VipStudy — лендинг + CMS-адмінка

Лендинг для агенції навчання у Словаччині, зібраний за дизайном Figma. Next.js (App Router) + Tailwind + Supabase (Postgres/Auth/Storage), задеплоєний на Vercel.

## Стек

- Next.js 16 (App Router, TypeScript, Tailwind CSS v4)
- Supabase — контент лендингу, ліди, Auth (адмінка), Storage (картинки)
- shadcn-стиль UI-примітиви на Radix, Framer Motion, @dnd-kit (drag&drop в адмінці)

## Локальний запуск

```bash
npm install
cp .env.example .env.local   # і підставити свої ключі Supabase
npm run dev
```

## Supabase

Одноразово виконати `supabase/schema.sql` у Supabase SQL Editor проєкту — створює таблиці, RLS-політики, storage bucket `site-media` і наповнює контент дефолтними текстами з дизайну.

Змінні середовища (`.env.local`, див. `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — publishable-ключ, використовується на клієнті й для читання контенту
- `SUPABASE_SERVICE_ROLE_KEY` — secret-ключ, **лише сервер**, для мутацій в адмінці

## Адмінка

`/admin/login` — вхід через Supabase Auth (email + пароль; користувача створити в Supabase Dashboard → Authentication → Users). З адмінки редагується весь контент лендингу (тексти, фото, порядок, видимість секцій) і ведеться CRM лідів (`/admin/leads`).

## Структура

- `app/page.tsx` — лендинг, серверний рендер контенту з Supabase
- `app/admin/**` — адмінка (захищена `proxy.ts`)
- `components/sections/**` — секції лендингу
- `components/admin/**` — CMS-конструктор (SectionForm, ListEditor, ImageUpload)
- `supabase/schema.sql` — повна схема БД
