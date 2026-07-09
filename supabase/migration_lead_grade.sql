-- Adds a "grade" (class / year of study) field to leads, selected via a
-- dropdown on the public lead form: 8, 9, 10, 11 or college. There is
-- intentionally no option for grade 6 and below, so younger students
-- cannot submit the form at all.
--
-- Run this ONCE in the Supabase SQL Editor. Safe to re-run.

alter table public.leads add column if not exists grade text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'leads_grade_check'
  ) then
    alter table public.leads
      add constraint leads_grade_check check (grade in ('8', '9', '10', '11', 'college'));
  end if;
end $$;
