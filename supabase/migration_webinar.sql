-- Adds the "webinar_form" lead source (registrations from the vebinar.*
-- subdomain squeeze page) and seeds the site_sections row that stores the
-- webinar's start date/time, editable at /admin/content/webinar.
--
-- Run this ONCE in the Supabase SQL Editor. Safe to re-run.

do $$
begin
  if exists (select 1 from pg_constraint where conname = 'leads_source_check') then
    alter table public.leads drop constraint leads_source_check;
  end if;
  alter table public.leads
    add constraint leads_source_check
    check (source in ('hero_form', 'consultation_form', 'feedback_form', 'webinar_form'));
end $$;

insert into public.site_sections (key, content) values
('webinar', '{"date": "2026-07-28T15:00:00.000Z"}'::jsonb)
on conflict (key) do nothing;
