-- Website frontlineofinnovation.de – Etappe 1: Anfragen aus den Formularen
-- Zugriff ausschließlich serverseitig mit dem Service-Key. RLS ist an, es gibt bewusst keine Policies:
-- anon/authenticated sehen nichts.

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.inquiries (
  id          uuid primary key default extensions.gen_random_uuid(),
  kind        text not null check (kind in ('kontakt', 'sponsoring', 'tickets')),
  topic       text,
  first_name  text not null,
  last_name   text not null,
  email       text not null,
  company     text,
  position    text,
  phone       text,
  message     text,
  details     jsonb not null default '{}'::jsonb,
  source_url  text,
  consent_at  timestamptz not null,
  status      text not null default 'neu' check (status in ('neu', 'in_bearbeitung', 'erledigt', 'abgelehnt')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists inquiries_email_created_idx on public.inquiries (email, created_at desc);
create index if not exists inquiries_kind_created_idx on public.inquiries (kind, created_at desc);

alter table public.inquiries enable row level security;

revoke all on public.inquiries from anon, authenticated;
grant usage on schema public to service_role;
grant select, insert, update, delete on public.inquiries to service_role;

comment on table public.inquiries is 'Anfragen aus Kontakt-, Sponsoring- und Ticketformular der Website. Löschfrist: 12 Monate nach Abschluss (siehe Datenschutzerklärung).';
