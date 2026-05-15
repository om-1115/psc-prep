-- ============================================================
-- Prepyq — Seed Data
-- Run AFTER schema.sql in Supabase → SQL Editor → New Query
-- ============================================================

-- ── Exams ────────────────────────────────────────────────────
insert into exams (id, name, slug) values
  ('11000000-0000-0000-0000-000000000001', 'UPSC Prelims',  'upsc-prelims'),
  ('11000000-0000-0000-0000-000000000002', 'CGPSC Prelims', 'cgpsc-prelims');


-- ── Papers ───────────────────────────────────────────────────
insert into papers (id, exam_id, year, title, paper_code, total_questions, total_marks) values
  ('22000000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000001', 2023, 'UPSC Prelims 2023',  'GS Paper I',                  100, 200),
  ('22000000-0000-0000-0000-000000000002', '11000000-0000-0000-0000-000000000001', 2022, 'UPSC Prelims 2022',  'GS Paper I',                  100, 200),
  ('22000000-0000-0000-0000-000000000003', '11000000-0000-0000-0000-000000000001', 2021, 'UPSC Prelims 2021',  'GS Paper I',                  100, 200),
  ('22000000-0000-0000-0000-000000000004', '11000000-0000-0000-0000-000000000002', 2023, 'CGPSC Prelims 2023', 'Paper I · General Studies',   100, 200),
  ('22000000-0000-0000-0000-000000000005', '11000000-0000-0000-0000-000000000002', 2022, 'CGPSC Prelims 2022', 'Paper I · General Studies',   100, 200);


-- ── Subjects ─────────────────────────────────────────────────
insert into subjects (id, name, slug, color) values
  ('33000000-0000-0000-0000-000000000001', 'Polity',          'polity',          '#3b5ba0'),
  ('33000000-0000-0000-0000-000000000002', 'History',         'history',         '#a04a3b'),
  ('33000000-0000-0000-0000-000000000003', 'Geography',       'geography',       '#3b8a5e'),
  ('33000000-0000-0000-0000-000000000004', 'Economy',         'economy',         '#a07a3b'),
  ('33000000-0000-0000-0000-000000000005', 'Environment',     'environment',     '#3ba07a'),
  ('33000000-0000-0000-0000-000000000006', 'Current Affairs', 'current-affairs', '#7a3ba0');


-- ── Topics (sub-topics within each subject) ──────────────────
insert into topics (id, subject_id, name, slug) values
  -- Polity
  ('44000000-0000-0000-0000-000000000001', '33000000-0000-0000-0000-000000000001', 'Constitutional Framework', 'constitutional-framework'),
  ('44000000-0000-0000-0000-000000000002', '33000000-0000-0000-0000-000000000001', 'Parliament',               'parliament'),
  ('44000000-0000-0000-0000-000000000003', '33000000-0000-0000-0000-000000000001', 'Executive',                'executive'),
  ('44000000-0000-0000-0000-000000000004', '33000000-0000-0000-0000-000000000001', 'Fundamental Rights',       'fundamental-rights'),
  ('44000000-0000-0000-0000-000000000005', '33000000-0000-0000-0000-000000000001', 'Judiciary',                'judiciary'),
  -- History
  ('44000000-0000-0000-0000-000000000006', '33000000-0000-0000-0000-000000000002', 'Ancient India',            'ancient-india'),
  ('44000000-0000-0000-0000-000000000007', '33000000-0000-0000-0000-000000000002', 'Modern India',             'modern-india'),
  ('44000000-0000-0000-0000-000000000008', '33000000-0000-0000-0000-000000000002', 'Post-Independence',        'post-independence'),
  -- Geography
  ('44000000-0000-0000-0000-000000000009', '33000000-0000-0000-0000-000000000003', 'Indian Geography',         'indian-geography'),
  ('44000000-0000-0000-0000-000000000010', '33000000-0000-0000-0000-000000000003', 'Physical Geography',       'physical-geography'),
  ('44000000-0000-0000-0000-000000000011', '33000000-0000-0000-0000-000000000003', 'World Geography',          'world-geography'),
  -- Economy
  ('44000000-0000-0000-0000-000000000012', '33000000-0000-0000-0000-000000000004', 'Monetary Policy',          'monetary-policy'),
  ('44000000-0000-0000-0000-000000000013', '33000000-0000-0000-0000-000000000004', 'Fiscal Policy',            'fiscal-policy'),
  ('44000000-0000-0000-0000-000000000014', '33000000-0000-0000-0000-000000000004', 'Economic Development',     'economic-development'),
  -- Environment
  ('44000000-0000-0000-0000-000000000015', '33000000-0000-0000-0000-000000000005', 'Ecology & Biodiversity',   'ecology-biodiversity'),
  ('44000000-0000-0000-0000-000000000016', '33000000-0000-0000-0000-000000000005', 'Biosphere Reserves',       'biosphere-reserves'),
  ('44000000-0000-0000-0000-000000000017', '33000000-0000-0000-0000-000000000005', 'Climate Change',           'climate-change'),
  -- Current Affairs
  ('44000000-0000-0000-0000-000000000018', '33000000-0000-0000-0000-000000000006', 'Government Schemes',       'government-schemes'),
  ('44000000-0000-0000-0000-000000000019', '33000000-0000-0000-0000-000000000006', 'Science & Technology',     'science-technology'),
  ('44000000-0000-0000-0000-000000000020', '33000000-0000-0000-0000-000000000006', 'International Relations',  'international-relations');


-- ── Questions (correct_option_id set below, after options) ───
insert into questions (id, question_text, paper_id, topic_id, explanation, difficulty, status) values

  -- Q1 · Polity / Executive · UPSC 2023
  (
    '55000000-0000-0000-0000-000000000001',
    'Consider the following statements regarding the office of the Vice-President of India:' || chr(10) ||
    '1. The Vice-President is the ex-officio Chairman of the Rajya Sabha.' || chr(10) ||
    '2. The Vice-President is elected by an electoral college consisting of members of both Houses of Parliament and the elected members of State Legislative Assemblies.' || chr(10) ||
    'Which of the statements given above is/are correct?',
    '22000000-0000-0000-0000-000000000001',   -- UPSC 2023
    '44000000-0000-0000-0000-000000000003',   -- Executive
    'The electoral college for the Vice-President consists only of members of both Houses of Parliament (elected and nominated). State Legislative Assemblies do not participate — so Statement 2 is incorrect. Only Statement 1 is correct.',
    'medium', 'approved'
  ),

  -- Q2 · History / Modern India · CGPSC 2022
  (
    '55000000-0000-0000-0000-000000000002',
    'The "Doctrine of Lapse" associated with British expansion in India was introduced by which Governor-General?',
    '22000000-0000-0000-0000-000000000005',   -- CGPSC 2022
    '44000000-0000-0000-0000-000000000007',   -- Modern India
    'Lord Dalhousie (1848–1856) introduced the Doctrine of Lapse, by which princely states without a natural heir would lapse to the British. Satara was the first state annexed under this doctrine in 1848.',
    'easy', 'approved'
  ),

  -- Q3 · Geography / Indian Geography · CGPSC 2023
  (
    '55000000-0000-0000-0000-000000000003',
    'Which of the following rivers does NOT originate in Chhattisgarh?',
    '22000000-0000-0000-0000-000000000004',   -- CGPSC 2023
    '44000000-0000-0000-0000-000000000009',   -- Indian Geography
    'The Narmada originates at Amarkantak in Madhya Pradesh, not Chhattisgarh. The Mahanadi, Indravati and Shivnath all originate within Chhattisgarh.',
    'easy', 'approved'
  ),

  -- Q4 · Economy / Monetary Policy · UPSC 2021
  (
    '55000000-0000-0000-0000-000000000004',
    'With reference to the "Repo Rate" in India, which of the following statements is correct?',
    '22000000-0000-0000-0000-000000000003',   -- UPSC 2021
    '44000000-0000-0000-0000-000000000012',   -- Monetary Policy
    'The repo rate is the rate at which the RBI lends short-term funds to commercial banks against the collateral of government securities. The reverse direction (banks parking money with RBI) is called the reverse repo rate.',
    'medium', 'approved'
  ),

  -- Q5 · Polity / Fundamental Rights · UPSC 2022
  (
    '55000000-0000-0000-0000-000000000005',
    'Article 32 of the Indian Constitution, which Dr. B.R. Ambedkar described as the "heart and soul" of the Constitution, deals with:',
    '22000000-0000-0000-0000-000000000002',   -- UPSC 2022
    '44000000-0000-0000-0000-000000000004',   -- Fundamental Rights
    'Article 32 provides the Right to Constitutional Remedies — the right to approach the Supreme Court directly for enforcement of Fundamental Rights through constitutional writs (habeas corpus, mandamus, prohibition, certiorari, quo warranto).',
    'easy', 'approved'
  );


-- ── Options ──────────────────────────────────────────────────
insert into options (id, question_id, option_key, option_text) values

  -- Q1 options (correct = A · "1 only")
  ('66000000-0000-0000-0000-000000000001', '55000000-0000-0000-0000-000000000001', 'A', '1 only'),
  ('66000000-0000-0000-0000-000000000002', '55000000-0000-0000-0000-000000000001', 'B', '2 only'),
  ('66000000-0000-0000-0000-000000000003', '55000000-0000-0000-0000-000000000001', 'C', 'Both 1 and 2'),
  ('66000000-0000-0000-0000-000000000004', '55000000-0000-0000-0000-000000000001', 'D', 'Neither 1 nor 2'),

  -- Q2 options (correct = B · "Lord Dalhousie")
  ('66000000-0000-0000-0000-000000000005', '55000000-0000-0000-0000-000000000002', 'A', 'Lord Wellesley'),
  ('66000000-0000-0000-0000-000000000006', '55000000-0000-0000-0000-000000000002', 'B', 'Lord Dalhousie'),
  ('66000000-0000-0000-0000-000000000007', '55000000-0000-0000-0000-000000000002', 'C', 'Lord Curzon'),
  ('66000000-0000-0000-0000-000000000008', '55000000-0000-0000-0000-000000000002', 'D', 'Lord Bentinck'),

  -- Q3 options (correct = C · "Narmada")
  ('66000000-0000-0000-0000-000000000009', '55000000-0000-0000-0000-000000000003', 'A', 'Mahanadi'),
  ('66000000-0000-0000-0000-000000000010', '55000000-0000-0000-0000-000000000003', 'B', 'Indravati'),
  ('66000000-0000-0000-0000-000000000011', '55000000-0000-0000-0000-000000000003', 'C', 'Narmada'),
  ('66000000-0000-0000-0000-000000000012', '55000000-0000-0000-0000-000000000003', 'D', 'Shivnath'),

  -- Q4 options (correct = B)
  ('66000000-0000-0000-0000-000000000013', '55000000-0000-0000-0000-000000000004', 'A', 'It is the rate at which commercial banks lend to the RBI.'),
  ('66000000-0000-0000-0000-000000000014', '55000000-0000-0000-0000-000000000004', 'B', 'It is the rate at which the RBI lends short-term funds to commercial banks against government securities.'),
  ('66000000-0000-0000-0000-000000000015', '55000000-0000-0000-0000-000000000004', 'C', 'It is the rate at which commercial banks lend to one another in the call money market.'),
  ('66000000-0000-0000-0000-000000000016', '55000000-0000-0000-0000-000000000004', 'D', 'It is the rate at which the RBI buys government bonds from the open market.'),

  -- Q5 options (correct = B · "Right to Constitutional Remedies")
  ('66000000-0000-0000-0000-000000000017', '55000000-0000-0000-0000-000000000005', 'A', 'Right to Property'),
  ('66000000-0000-0000-0000-000000000018', '55000000-0000-0000-0000-000000000005', 'B', 'Right to Constitutional Remedies'),
  ('66000000-0000-0000-0000-000000000019', '55000000-0000-0000-0000-000000000005', 'C', 'Right to Education'),
  ('66000000-0000-0000-0000-000000000020', '55000000-0000-0000-0000-000000000005', 'D', 'Cultural and Educational Rights');


-- ── Set correct_option_id on each question ───────────────────
update questions set correct_option_id = '66000000-0000-0000-0000-000000000001'
  where id = '55000000-0000-0000-0000-000000000001';   -- Q1 correct: A

update questions set correct_option_id = '66000000-0000-0000-0000-000000000006'
  where id = '55000000-0000-0000-0000-000000000002';   -- Q2 correct: B

update questions set correct_option_id = '66000000-0000-0000-0000-000000000011'
  where id = '55000000-0000-0000-0000-000000000003';   -- Q3 correct: C

update questions set correct_option_id = '66000000-0000-0000-0000-000000000014'
  where id = '55000000-0000-0000-0000-000000000004';   -- Q4 correct: B

update questions set correct_option_id = '66000000-0000-0000-0000-000000000018'
  where id = '55000000-0000-0000-0000-000000000005';   -- Q5 correct: B
