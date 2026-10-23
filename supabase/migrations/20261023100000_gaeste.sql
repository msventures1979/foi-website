-- Etappe 2: Gäste, Events, Einladungen, Mailversand, Admin-Zugang
-- Grundsatz wie überall: RLS an, keine Policies, Zugriff nur serverseitig mit dem Service-Key.

create extension if not exists citext with schema extensions;

-- ---------------------------------------------------------------------------
-- Kontakte: jede Person genau einmal, über alle Events hinweg
-- ---------------------------------------------------------------------------
create table if not exists public.contacts (
  id          uuid primary key default extensions.gen_random_uuid(),
  salutation  text not null default '' check (salutation in ('Herr', 'Frau', '')),
  title       text not null default '',
  first_name  text not null,
  last_name   text not null,
  email       extensions.citext unique,
  email_alt   text not null default '',
  company     text not null default '',
  position    text not null default '',
  phone       text not null default '',
  linkedin    text not null default '',
  notes       text not null default '',
  -- Wer hat diese Person empfohlen (frei, z. B. Name eines Gastes)
  referred_by text not null default '',
  -- Person möchte keine Einladungen mehr (Widerspruch)
  opted_out_at timestamptz,
  source      text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists contacts_name_idx on public.contacts (lower(last_name), lower(first_name));

-- ---------------------------------------------------------------------------
-- Events: Dinner-Editionen und andere Formate
-- ---------------------------------------------------------------------------
create table if not exists public.events (
  id                 uuid primary key default extensions.gen_random_uuid(),
  slug               text not null unique,
  name               text not null,
  edition            int,
  starts_at          timestamptz,
  venue              text not null default '',
  address            text not null default '',
  -- kurze Hinweise für die Mails (Ablauf, Anfahrt, Dresscode)
  details            text not null default '',
  rsvp_deadline      date,
  capacity           int check (capacity is null or capacity > 0),
  registration_open  boolean not null default false,
  closed_message     text not null default 'Die Anmeldung ist geschlossen.',
  status             text not null default 'entwurf' check (status in ('entwurf', 'aktiv', 'abgeschlossen')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Einladungen: Person × Event, mit persönlichem Code
-- ---------------------------------------------------------------------------
create table if not exists public.invitations (
  id            uuid primary key default extensions.gen_random_uuid(),
  event_id      uuid not null references public.events (id) on delete cascade,
  contact_id    uuid not null references public.contacts (id) on delete cascade,
  code          text not null unique,
  manage_token  text not null unique default encode(extensions.gen_random_bytes(18), 'hex'),
  status        text not null default 'eingeladen' check (
    status in ('vorgemerkt', 'eingeladen', 'zugesagt', 'abgesagt', 'keine_rueckmeldung', 'teilgenommen', 'nicht_erschienen')
  ),
  category      text not null default '' check (category in ('', 'gruender', 'fuehrung', 'politik', 'wildcard', 'partner', 'presse', 'team')),
  -- Angaben bei der Zusage
  diet          text not null default '',
  -- Gesundheitsdaten: nur mit Einwilligung, nach dem Event löschen
  allergies     text not null default '',
  allergies_consent_at timestamptz,
  phone         text not null default '',
  table_no      text not null default '',
  note          text not null default '',
  invited_at    timestamptz,
  responded_at  timestamptz,
  checked_in_at timestamptz,
  source        text not null default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (event_id, contact_id)
);

create index if not exists invitations_event_status_idx on public.invitations (event_id, status);
create index if not exists invitations_contact_idx on public.invitations (contact_id);

-- ---------------------------------------------------------------------------
-- Mails: Warteschlange und Protokoll
-- ---------------------------------------------------------------------------
create table if not exists public.email_queue (
  id             bigint generated always as identity primary key,
  invitation_id  uuid references public.invitations (id) on delete cascade,
  to_email       extensions.citext not null,
  type           text not null,
  priority       int not null default 5, -- 1 = sofort (Bestätigung), 5 = Massenversand
  scheduled_for  timestamptz not null default now(),
  sent_at        timestamptz,
  attempts       int not null default 0,
  locked_at      timestamptz,
  last_error     text,
  created_at     timestamptz not null default now()
);

create index if not exists email_queue_pending_idx on public.email_queue (priority, scheduled_for) where sent_at is null;

create table if not exists public.email_log (
  id             bigint generated always as identity primary key,
  invitation_id  uuid references public.invitations (id) on delete set null,
  to_email       extensions.citext not null,
  type           text not null,
  subject        text not null default '',
  resend_id      text,
  status         text not null default 'gesendet',
  error          text,
  created_at     timestamptz not null default now()
);

create index if not exists email_log_invitation_type_idx on public.email_log (invitation_id, type);
create index if not exists email_log_created_idx on public.email_log (created_at desc);

-- ---------------------------------------------------------------------------
-- Protokoll: wer hat wann was geändert
-- ---------------------------------------------------------------------------
create table if not exists public.activity_log (
  id          bigint generated always as identity primary key,
  actor       text not null default 'system',
  action      text not null,
  entity      text not null default '',
  entity_id   text not null default '',
  payload     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists activity_log_created_idx on public.activity_log (created_at desc);

-- ---------------------------------------------------------------------------
-- Admin-Zugang per Mail-Link (ohne Passwörter)
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  email       extensions.citext primary key,
  name        text not null default '',
  role        text not null default 'admin' check (role in ('admin', 'assistenz')),
  created_at  timestamptz not null default now()
);

create table if not exists public.login_tokens (
  token_hash  text primary key,
  email       extensions.citext not null references public.admin_users (email) on delete cascade,
  expires_at  timestamptz not null,
  used_at     timestamptz,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Hilfsfunktionen
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists contacts_touch on public.contacts;
create trigger contacts_touch before update on public.contacts for each row execute function public.touch_updated_at();
drop trigger if exists events_touch on public.events;
create trigger events_touch before update on public.events for each row execute function public.touch_updated_at();
drop trigger if exists invitations_touch on public.invitations;
create trigger invitations_touch before update on public.invitations for each row execute function public.touch_updated_at();
drop trigger if exists inquiries_touch on public.inquiries;
create trigger inquiries_touch before update on public.inquiries for each row execute function public.touch_updated_at();

-- Mails zum Versand reservieren: sperrt Zeilen, damit parallel laufende Versandläufe nichts doppelt schicken.
create or replace function public.claim_emails(p_limit int)
returns setof public.email_queue
language sql security definer set search_path = public, extensions as $$
  update public.email_queue q
     set locked_at = now(), attempts = q.attempts + 1
   where q.id in (
     select id from public.email_queue
      where sent_at is null
        and scheduled_for <= now()
        and attempts < 5
        and (locked_at is null or locked_at < now() - interval '10 minutes')
      order by priority, scheduled_for, id
      limit greatest(p_limit, 0)
      for update skip locked
   )
  returning q.*;
$$;

-- ---------------------------------------------------------------------------
-- Rechte
-- ---------------------------------------------------------------------------
alter table public.contacts enable row level security;
alter table public.events enable row level security;
alter table public.invitations enable row level security;
alter table public.email_queue enable row level security;
alter table public.email_log enable row level security;
alter table public.activity_log enable row level security;
alter table public.admin_users enable row level security;
alter table public.login_tokens enable row level security;

revoke all on public.contacts, public.events, public.invitations, public.email_queue, public.email_log,
  public.activity_log, public.admin_users, public.login_tokens from anon, authenticated;
revoke all on function public.claim_emails(int) from public, anon, authenticated;

grant usage on schema public to service_role;
grant select, insert, update, delete on public.contacts, public.events, public.invitations, public.email_queue,
  public.email_log, public.activity_log, public.admin_users, public.login_tokens to service_role;
grant usage, select on all sequences in schema public to service_role;
grant execute on function public.claim_emails(int) to service_role;

-- Zugang: das gemeinsame Postfach info@ und die Assistenz
insert into public.admin_users (email, name, role) values
  ('info@frontlineofinnovation.de', 'Frontline of Innovation', 'admin'),
  ('hulbe@four-asset-management.de', 'Antje Hulbe', 'assistenz')
on conflict (email) do nothing;
