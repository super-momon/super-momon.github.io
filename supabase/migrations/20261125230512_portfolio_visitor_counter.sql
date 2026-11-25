create table if not exists public.admin_keys (
  key_name varchar not null,
  key_value varchar not null
);

alter table public.admin_keys enable row level security;

revoke all on table public.admin_keys from anon, authenticated;

insert into public.admin_keys (key_name, key_value)
select
  'portfolio_visitor',
  '{"current_count":0,"last_visitor_date":null}'
where not exists (
  select 1
  from public.admin_keys
  where key_name = 'portfolio_visitor'
);

create or replace function public.get_portfolio_visitor_count()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  visitor_value jsonb;
  current_count bigint;
  last_visitor_date text;
begin
  select key_value::jsonb
  into strict visitor_value
  from public.admin_keys
  where key_name = 'portfolio_visitor';

  if jsonb_typeof(visitor_value) <> 'object'
    or not (visitor_value ? 'current_count')
    or not (visitor_value ? 'last_visitor_date') then
    raise exception 'portfolio_visitor has an invalid value shape';
  end if;

  current_count := (visitor_value ->> 'current_count')::bigint;
  last_visitor_date := visitor_value ->> 'last_visitor_date';

  if current_count < 0 then
    raise exception 'portfolio_visitor current_count cannot be negative';
  end if;

  if last_visitor_date is not null then
    perform last_visitor_date::timestamptz;
  end if;

  return pg_catalog.jsonb_build_object(
    'current_count', current_count,
    'last_visitor_date', last_visitor_date
  );
end;
$$;

create or replace function public.increment_portfolio_visitor_count()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  visitor_value jsonb;
  updated_value jsonb;
  current_count bigint;
begin
  select key_value::jsonb
  into strict visitor_value
  from public.admin_keys
  where key_name = 'portfolio_visitor'
  for update;

  if jsonb_typeof(visitor_value) <> 'object'
    or not (visitor_value ? 'current_count')
    or not (visitor_value ? 'last_visitor_date') then
    raise exception 'portfolio_visitor has an invalid value shape';
  end if;

  current_count := (visitor_value ->> 'current_count')::bigint;

  if current_count < 0 then
    raise exception 'portfolio_visitor current_count cannot be negative';
  end if;

  update public.admin_keys
  set key_value = pg_catalog.jsonb_build_object(
    'current_count', current_count + 1,
    'last_visitor_date', pg_catalog.to_char(
      pg_catalog.clock_timestamp() at time zone 'UTC',
      'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
    )
  )::varchar
  where key_name = 'portfolio_visitor'
  returning key_value::jsonb into strict updated_value;

  return pg_catalog.jsonb_build_object(
    'current_count', (updated_value ->> 'current_count')::bigint,
    'last_visitor_date', updated_value ->> 'last_visitor_date'
  );
end;
$$;

revoke all on function public.get_portfolio_visitor_count() from public, anon, authenticated;
revoke all on function public.increment_portfolio_visitor_count() from public, anon, authenticated;

grant execute on function public.get_portfolio_visitor_count() to anon, authenticated;
grant execute on function public.increment_portfolio_visitor_count() to anon, authenticated;

comment on function public.get_portfolio_visitor_count() is
  'Returns only the public portfolio visitor count and latest visitor timestamp.';
comment on function public.increment_portfolio_visitor_count() is
  'Atomically increments the portfolio visitor count and updates its UTC timestamp.';