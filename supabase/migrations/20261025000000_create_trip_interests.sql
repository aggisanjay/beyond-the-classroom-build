create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.trip_interests (
  id uuid primary key default gen_random_uuid(),
  teacher_name text not null check (char_length(btrim(teacher_name)) between 2 and 120),
  school_name text not null check (char_length(btrim(school_name)) between 2 and 160),
  email text not null check (char_length(email) between 5 and 254 and email ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+),
  phone text not null check (phone ~ '^[+0-9(). -]{7,24}$'),
  trip_slug text not null check (trip_slug in ('singapore-stem', 'jaipur-heritage', 'london-universities')),
  student_count integer not null check (student_count between 1 and 1000),
  created_at timestamptz not null default now()
);

create index trip_interests_created_at_idx on public.trip_interests (created_at desc);
create index trip_interests_trip_created_idx on public.trip_interests (trip_slug, created_at desc);
create index trip_interests_email_lower_idx on public.trip_interests (lower(email));

alter table public.trip_interests enable row level security;
revoke all on table public.trip_interests from public, anon, authenticated;
grant insert on table public.trip_interests to anon;
grant select, insert, update, delete on table public.trip_interests to service_role;

create policy trip_interests_anon_insert
  on public.trip_interests
  for insert
  to anon
  with check (
    char_length(btrim(teacher_name)) between 2 and 120
    and char_length(btrim(school_name)) between 2 and 160
    and char_length(email) between 5 and 254
    and email ~* '^[^[:space:]@]+@[^[:space:]@]+\\.[^[:space:]@]+$'
    and phone ~ '^[+0-9(). -]{7,24}$'
    and trip_slug in ('singapore-stem', 'jaipur-heritage', 'london-universities')
    and student_count between 1 and 1000
  );

create table private.trip_interest_rate_limits (
  fingerprint text primary key check (fingerprint ~ '^[0-9a-f]{64}$'),
  window_started_at timestamptz not null,
  attempt_count integer not null check (attempt_count >= 1)
);
alter table private.trip_interest_rate_limits enable row level security;
revoke all on table private.trip_interest_rate_limits from public, anon, authenticated, service_role;

create or replace function public.consume_trip_interest_rate_limit(
  p_fingerprint text,
  p_max_attempts integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_attempt_count integer;
begin
  if p_fingerprint is null
     or p_fingerprint !~ '^[0-9a-f]{64}$'
     or p_max_attempts < 1
     or p_window_seconds < 1 then
    return false;
  end if;

  insert into private.trip_interest_rate_limits as current_limit (fingerprint, window_started_at, attempt_count)
  values (p_fingerprint, now(), 1)
  on conflict (fingerprint) do update
  set window_started_at = case
        when current_limit.window_started_at <= now() - make_interval(secs => p_window_seconds) then now()
        else current_limit.window_started_at
      end,
      attempt_count = case
        when current_limit.window_started_at <= now() - make_interval(secs => p_window_seconds) then 1
        else current_limit.attempt_count + 1
      end
  returning attempt_count into v_attempt_count;

  return v_attempt_count <= p_max_attempts;
end;
$$;
revoke all on function public.consume_trip_interest_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_trip_interest_rate_limit(text, integer, integer) to service_role;

create or replace function public.get_trip_interest_analytics()
returns table (trip_slug text, enquiry_count bigint, student_total bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  select interests.trip_slug, count(*)::bigint, coalesce(sum(interests.student_count), 0)::bigint
  from public.trip_interests as interests
  group by interests.trip_slug;
$$;
revoke all on function public.get_trip_interest_analytics() from public, anon, authenticated;
grant execute on function public.get_trip_interest_analytics() to service_role;
),
  phone text not null check (phone ~ '^[+0-9(). -]{7,24}$'),
  trip_slug text not null check (trip_slug in ('singapore-stem', 'jaipur-heritage', 'london-universities')),
  student_count integer not null check (student_count between 1 and 1000),
  created_at timestamptz not null default now()
);

create index trip_interests_created_at_idx on public.trip_interests (created_at desc);
create index trip_interests_trip_created_idx on public.trip_interests (trip_slug, created_at desc);
create index trip_interests_email_lower_idx on public.trip_interests (lower(email));

alter table public.trip_interests enable row level security;
revoke all on table public.trip_interests from public, anon, authenticated;
grant insert on table public.trip_interests to anon;
grant select, insert, update, delete on table public.trip_interests to service_role;

create policy trip_interests_anon_insert
  on public.trip_interests
  for insert
  to anon
  with check (
    char_length(btrim(teacher_name)) between 2 and 120
    and char_length(btrim(school_name)) between 2 and 160
    and char_length(email) between 5 and 254
    and email ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+
    and phone ~ '^[+0-9(). -]{7,24}$'
    and trip_slug in ('singapore-stem', 'jaipur-heritage', 'london-universities')
    and student_count between 1 and 1000
  );

create table private.trip_interest_rate_limits (
  fingerprint text primary key check (fingerprint ~ '^[0-9a-f]{64}$'),
  window_started_at timestamptz not null,
  attempt_count integer not null check (attempt_count >= 1)
);
alter table private.trip_interest_rate_limits enable row level security;
revoke all on table private.trip_interest_rate_limits from public, anon, authenticated, service_role;

create or replace function public.consume_trip_interest_rate_limit(
  p_fingerprint text,
  p_max_attempts integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_attempt_count integer;
begin
  if p_fingerprint is null
     or p_fingerprint !~ '^[0-9a-f]{64}$'
     or p_max_attempts < 1
     or p_window_seconds < 1 then
    return false;
  end if;

  insert into private.trip_interest_rate_limits as current_limit (fingerprint, window_started_at, attempt_count)
  values (p_fingerprint, now(), 1)
  on conflict (fingerprint) do update
  set window_started_at = case
        when current_limit.window_started_at <= now() - make_interval(secs => p_window_seconds) then now()
        else current_limit.window_started_at
      end,
      attempt_count = case
        when current_limit.window_started_at <= now() - make_interval(secs => p_window_seconds) then 1
        else current_limit.attempt_count + 1
      end
  returning attempt_count into v_attempt_count;

  return v_attempt_count <= p_max_attempts;
end;
$$;
revoke all on function public.consume_trip_interest_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_trip_interest_rate_limit(text, integer, integer) to service_role;

create or replace function public.get_trip_interest_analytics()
returns table (trip_slug text, enquiry_count bigint, student_total bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  select interests.trip_slug, count(*)::bigint, coalesce(sum(interests.student_count), 0)::bigint
  from public.trip_interests as interests
  group by interests.trip_slug;
$$;
revoke all on function public.get_trip_interest_analytics() from public, anon, authenticated;
grant execute on function public.get_trip_interest_analytics() to service_role;

    and phone ~ '^[+0-9(). -]{7,24}$'
    and trip_slug in ('singapore-stem', 'jaipur-heritage', 'london-universities')
    and student_count between 1 and 1000
  );

create table private.trip_interest_rate_limits (
  fingerprint text primary key check (fingerprint ~ '^[0-9a-f]{64}$'),
  window_started_at timestamptz not null,
  attempt_count integer not null check (attempt_count >= 1)
);
alter table private.trip_interest_rate_limits enable row level security;
revoke all on table private.trip_interest_rate_limits from public, anon, authenticated, service_role;

create or replace function public.consume_trip_interest_rate_limit(
  p_fingerprint text,
  p_max_attempts integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_attempt_count integer;
begin
  if p_fingerprint is null
     or p_fingerprint !~ '^[0-9a-f]{64}$'
     or p_max_attempts < 1
     or p_window_seconds < 1 then
    return false;
  end if;

  insert into private.trip_interest_rate_limits as current_limit (fingerprint, window_started_at, attempt_count)
  values (p_fingerprint, now(), 1)
  on conflict (fingerprint) do update
  set window_started_at = case
        when current_limit.window_started_at <= now() - make_interval(secs => p_window_seconds) then now()
        else current_limit.window_started_at
      end,
      attempt_count = case
        when current_limit.window_started_at <= now() - make_interval(secs => p_window_seconds) then 1
        else current_limit.attempt_count + 1
      end
  returning attempt_count into v_attempt_count;

  return v_attempt_count <= p_max_attempts;
end;
$$;
revoke all on function public.consume_trip_interest_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_trip_interest_rate_limit(text, integer, integer) to service_role;

create or replace function public.get_trip_interest_analytics()
returns table (trip_slug text, enquiry_count bigint, student_total bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  select interests.trip_slug, count(*)::bigint, coalesce(sum(interests.student_count), 0)::bigint
  from public.trip_interests as interests
  group by interests.trip_slug;
$$;
revoke all on function public.get_trip_interest_analytics() from public, anon, authenticated;
grant execute on function public.get_trip_interest_analytics() to service_role;
