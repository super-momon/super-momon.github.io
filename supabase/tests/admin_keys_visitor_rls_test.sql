begin;
select plan(17);

select set_config(
  'test.visitor_before_count',
  (public.get_portfolio_visitor_count() ->> 'current_count')::text,
  true
);

select ok(
  (select relrowsecurity from pg_class where oid = 'public.admin_keys'::regclass),
  'admin_keys has row level security enabled'
);

select ok(not has_table_privilege('anon', 'public.admin_keys', 'select'), 'anon cannot select admin_keys');
select ok(not has_table_privilege('anon', 'public.admin_keys', 'insert'), 'anon cannot insert admin_keys');
select ok(not has_table_privilege('anon', 'public.admin_keys', 'update'), 'anon cannot update admin_keys');
select ok(not has_table_privilege('anon', 'public.admin_keys', 'delete'), 'anon cannot delete admin_keys');

select ok(not has_table_privilege('authenticated', 'public.admin_keys', 'select'), 'authenticated cannot select admin_keys');
select ok(not has_table_privilege('authenticated', 'public.admin_keys', 'insert'), 'authenticated cannot insert admin_keys');
select ok(not has_table_privilege('authenticated', 'public.admin_keys', 'update'), 'authenticated cannot update admin_keys');
select ok(not has_table_privilege('authenticated', 'public.admin_keys', 'delete'), 'authenticated cannot delete admin_keys');

select ok(
  has_function_privilege('anon', 'public.get_portfolio_visitor_count()', 'execute'),
  'anon can read the public visitor count'
);
select ok(
  has_function_privilege('anon', 'public.increment_portfolio_visitor_count()', 'execute'),
  'anon can increment the visitor count'
);
select ok(
  has_function_privilege('authenticated', 'public.get_portfolio_visitor_count()', 'execute'),
  'authenticated can read the public visitor count'
);
select ok(
  has_function_privilege('authenticated', 'public.increment_portfolio_visitor_count()', 'execute'),
  'authenticated can increment the visitor count'
);

set local role anon;

select ok(
  (public.get_portfolio_visitor_count() ->> 'current_count')::bigint
    = current_setting('test.visitor_before_count')::bigint,
  'anon receives the current visitor count without table access'
);

select ok(
  (public.increment_portfolio_visitor_count() ->> 'current_count')::bigint
    = current_setting('test.visitor_before_count')::bigint + 1,
  'anon atomically increments the visitor count'
);

set local role authenticated;

select ok(
  (public.get_portfolio_visitor_count() ->> 'current_count')::bigint
    = current_setting('test.visitor_before_count')::bigint + 1,
  'authenticated sees the incremented count'
);

select ok(
  (public.increment_portfolio_visitor_count() ->> 'last_visitor_date') is not null,
  'increment returns a server-generated visitor timestamp'
);

select * from finish();
rollback;
