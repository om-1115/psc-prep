-- ============================================================
-- Prepyq — Database Schema
-- Run this entire file in Supabase → SQL Editor → New Query
-- ============================================================

-- ── 1. Enums ─────────────────────────────────────────────────

create type difficulty_level as enum ('easy', 'medium', 'hard');
create type question_status  as enum ('pending', 'approved', 'rejected');


-- ── 2. Tables ────────────────────────────────────────────────

-- Exam bodies (UPSC Prelims, CGPSC Prelims, …)
create table exams (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  created_at timestamptz default now()
);

-- Individual year papers belonging to an exam
create table papers (
  id               uuid primary key default gen_random_uuid(),
  exam_id          uuid not null references exams(id) on delete cascade,
  year             integer not null,
  title            text not null,
  paper_code       text,
  total_questions  integer,
  total_marks      integer,
  created_at       timestamptz default now()
);

-- Top-level subject groupings (Polity, History, …)
create table subjects (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  color      text not null default '#888888',
  created_at timestamptz default now()
);

-- Sub-topics within a subject (e.g. "Executive" inside Polity)
create table topics (
  id         uuid primary key default gen_random_uuid(),
  subject_id uuid not null references subjects(id) on delete cascade,
  name       text not null,
  slug       text not null,
  created_at timestamptz default now()
);

-- Questions (correct_option_id added after options table exists)
create table questions (
  id                uuid primary key default gen_random_uuid(),
  question_text     text not null,
  paper_id          uuid references papers(id) on delete set null,
  topic_id          uuid not null references topics(id),
  correct_option_id uuid,                            -- FK added below
  explanation       text,
  difficulty        difficulty_level not null default 'medium',
  status            question_status  not null default 'pending',
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- Answer options for each question
create table options (
  id          uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id) on delete cascade,
  option_key  text not null,   -- 'A', 'B', 'C', 'D'
  option_text text not null,
  created_at  timestamptz default now()
);

-- Now that options exists, add the FK from questions → options
alter table questions
  add constraint fk_correct_option
  foreign key (correct_option_id) references options(id) on delete set null;

-- Extended user profiles (Supabase Auth handles login; this holds extra data)
create table users (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text,
  display_name text,
  streak       integer default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Records every answer attempt by a user
create table user_attempts (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references users(id) on delete cascade,
  question_id        uuid not null references questions(id) on delete cascade,
  selected_option_id uuid references options(id) on delete set null,
  is_correct         boolean,
  attempted_at       timestamptz default now()
);

-- Questions a user has bookmarked
create table bookmarks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  created_at  timestamptz default now(),
  unique(user_id, question_id)
);


-- ── 3. Row Level Security ─────────────────────────────────────
-- Content tables: anyone can read; only authenticated admins write (add later)
-- User tables: each user can only see and modify their own rows

alter table exams         enable row level security;
alter table papers        enable row level security;
alter table subjects      enable row level security;
alter table topics        enable row level security;
alter table questions     enable row level security;
alter table options       enable row level security;
alter table users         enable row level security;
alter table user_attempts enable row level security;
alter table bookmarks     enable row level security;

-- Public read access for content
create policy "public_read_exams"     on exams     for select using (true);
create policy "public_read_papers"    on papers    for select using (true);
create policy "public_read_subjects"  on subjects  for select using (true);
create policy "public_read_topics"    on topics    for select using (true);
create policy "public_read_options"   on options   for select using (true);
create policy "public_read_approved_questions"
  on questions for select using (status = 'approved');

-- Users — own row only
create policy "users_read_own"   on users for select using (auth.uid() = id);
create policy "users_insert_own" on users for insert with check (auth.uid() = id);
create policy "users_update_own" on users for update using (auth.uid() = id);

-- Attempts — own rows only
create policy "attempts_read_own"   on user_attempts for select using (auth.uid() = user_id);
create policy "attempts_insert_own" on user_attempts for insert with check (auth.uid() = user_id);

-- Bookmarks — own rows only
create policy "bookmarks_read_own"   on bookmarks for select using (auth.uid() = user_id);
create policy "bookmarks_insert_own" on bookmarks for insert with check (auth.uid() = user_id);
create policy "bookmarks_delete_own" on bookmarks for delete using (auth.uid() = user_id);


-- ── 4. Auto-update updated_at on questions ───────────────────

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger questions_updated_at
  before update on questions
  for each row execute procedure set_updated_at();
