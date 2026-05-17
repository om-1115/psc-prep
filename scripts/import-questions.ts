/**
 * import-questions.ts
 * One-off script: reads ghatna_chakra_geography_pyq.xlsx and imports
 * all rows from the "Questions" sheet into Supabase.
 *
 * Run:  npx tsx scripts/import-questions.ts
 *
 * XLSX column layout (0-indexed):
 *   0  id (ignored — DB generates its own)
 *   1  exam_name      e.g. "UPSC Prelims"
 *   2  year           e.g. 2009
 *   3  paper_name     e.g. "Prelims"
 *   4  subject        e.g. "Geography"
 *   5  topic          e.g. "Indian Geography - Rivers & Drainage"
 *   6  question_text
 *   7  option_a
 *   8  option_b
 *   9  option_c
 *  10  option_d
 *  11  correct_option  "a" | "b" | "c" | "d"  (empty = skip)
 *  12  explanation
 *  13  difficulty      "easy" | "medium" | "hard"
 *  14  status          (ignored — always import as "pending")
 *  15  source_page
 *  16  source_book
 */

import * as XLSX from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

// ── Config ──────────────────────────────────────────────────────────────────

const XLSX_PATH = path.join(
  process.env.HOME || '~',
  'Downloads/ghatna_chakra_geography_pyq.xlsx'
)

// Load .env.local manually (no dotenv dependency needed)
const envPath = path.join(__dirname, '..', '.env.local')
const envVars: Record<string, string> = {}
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) envVars[match[1].trim()] = match[2].trim()
  }
}

const SUPABASE_URL = envVars['NEXT_PUBLIC_SUPABASE_URL']
const SERVICE_KEY  = envVars['SUPABASE_SERVICE_ROLE_KEY']

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
})

// ── In-memory caches (avoid repeated DB lookups) ─────────────────────────────

const examCache:    Map<string, string> = new Map() // name → id
const paperCache:   Map<string, string> = new Map() // `examId|year|paperName` → id
const subjectCache: Map<string, string> = new Map() // name → id
const topicCache:   Map<string, string> = new Map() // `subjectId|topicName` → id

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

async function findOrCreateExam(name: string): Promise<string> {
  if (examCache.has(name)) return examCache.get(name)!
  // Check DB by name
  const { data } = await supabase
    .from('exams')
    .select('id')
    .eq('name', name)
    .maybeSingle()
  if (data) {
    examCache.set(name, data.id)
    return data.id
  }
  // Create
  const slug = slugify(name)
  const { data: created, error } = await supabase
    .from('exams')
    .insert({ name, slug })
    .select('id')
    .single()
  if (error) {
    // Slug collision (e.g. "UPPCS Mains" vs "UPPCS (Mains)") — fall back to slug lookup
    if (error.code === '23505') {
      const { data: existing } = await supabase
        .from('exams')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()
      if (existing) {
        examCache.set(name, existing.id)
        return existing.id
      }
    }
    throw new Error(`exam insert failed for "${name}": ${error.message}`)
  }
  examCache.set(name, created.id)
  return created.id
}

async function findOrCreatePaper(
  examId: string,
  year: number,
  paperName: string
): Promise<string> {
  const key = `${examId}|${year}|${paperName}`
  if (paperCache.has(key)) return paperCache.get(key)!
  // Check DB
  const { data } = await supabase
    .from('papers')
    .select('id')
    .eq('exam_id', examId)
    .eq('year', year)
    .eq('title', paperName)
    .maybeSingle()
  if (data) {
    paperCache.set(key, data.id)
    return data.id
  }
  // Create
  const { data: created, error } = await supabase
    .from('papers')
    .insert({ exam_id: examId, year, title: paperName })
    .select('id')
    .single()
  if (error) throw new Error(`paper insert failed: ${error.message}`)
  paperCache.set(key, created.id)
  return created.id
}

async function findOrCreateSubject(name: string): Promise<string> {
  if (subjectCache.has(name)) return subjectCache.get(name)!
  const { data } = await supabase
    .from('subjects')
    .select('id')
    .eq('name', name)
    .maybeSingle()
  if (data) {
    subjectCache.set(name, data.id)
    return data.id
  }
  const { data: created, error } = await supabase
    .from('subjects')
    .insert({ name, slug: slugify(name), color: '#4B7BE5' })
    .select('id')
    .single()
  if (error) throw new Error(`subject insert failed for "${name}": ${error.message}`)
  subjectCache.set(name, created.id)
  return created.id
}

async function findOrCreateTopic(subjectId: string, name: string): Promise<string> {
  const key = `${subjectId}|${name}`
  if (topicCache.has(key)) return topicCache.get(key)!
  const { data } = await supabase
    .from('topics')
    .select('id')
    .eq('subject_id', subjectId)
    .eq('name', name)
    .maybeSingle()
  if (data) {
    topicCache.set(key, data.id)
    return data.id
  }
  const { data: created, error } = await supabase
    .from('topics')
    .insert({ subject_id: subjectId, name, slug: slugify(name) })
    .select('id')
    .single()
  if (error) throw new Error(`topic insert failed for "${name}": ${error.message}`)
  topicCache.set(key, created.id)
  return created.id
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Reading XLSX from ${XLSX_PATH}`)
  const workbook = XLSX.readFile(XLSX_PATH)
  const ws = workbook.Sheets['Questions']
  if (!ws) {
    console.error('Sheet "Questions" not found in XLSX')
    process.exit(1)
  }

  // Convert to array-of-arrays (raw values, no header parsing)
  const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })

  // Skip header row
  const dataRows = rows.slice(1).filter(r => r[0] !== '' && r[0] != null)
  const total = dataRows.length
  console.log(`Found ${total} data rows\n`)

  let inserted = 0
  let skipped  = 0
  let errors   = 0

  for (let i = 0; i < dataRows.length; i++) {
    const r = dataRows[i]

    const examName    = String(r[1] || '').trim()
    const year        = Number(r[2]) || 0
    const paperName   = String(r[3] || 'Prelims').trim()
    const subjectName = String(r[4] || 'Geography').trim()
    const topicName   = String(r[5] || '').trim()
    const questionText = String(r[6] || '').trim()
    const optA        = String(r[7]  || '').trim()
    const optB        = String(r[8]  || '').trim()
    const optC        = String(r[9]  || '').trim()
    const optD        = String(r[10] || '').trim()
    const correctKey  = String(r[11] || '').trim().toLowerCase()
    const explanation = String(r[12] || '').trim()
    const difficulty  = (['easy','medium','hard'].includes(String(r[13]).toLowerCase())
      ? String(r[13]).toLowerCase()
      : 'medium') as 'easy' | 'medium' | 'hard'

    // Skip rows with no correct answer (disputed in source)
    if (!correctKey || !['a','b','c','d'].includes(correctKey)) {
      skipped++
      continue
    }

    // Skip rows missing essential fields
    if (!examName || !questionText || !optA || !optB || !optC || !optD) {
      skipped++
      continue
    }

    try {
      // 1. Exam
      const examId = await findOrCreateExam(examName)

      // 2. Paper
      const paperId = await findOrCreatePaper(examId, year, paperName)

      // 3. Subject
      const subjectId = await findOrCreateSubject(subjectName)

      // 4. Topic
      const topicId = await findOrCreateTopic(subjectId, topicName || subjectName)

      // 4b. Skip if already imported (idempotent re-run)
      const { data: existing } = await supabase
        .from('questions')
        .select('id')
        .eq('paper_id', paperId)
        .eq('question_text', questionText)
        .maybeSingle()
      if (existing) { skipped++; continue }

      // 5. Insert question (without correct_option_id yet)
      const { data: question, error: qErr } = await supabase
        .from('questions')
        .insert({
          question_text: questionText,
          paper_id:      paperId,
          topic_id:      topicId,
          explanation:   explanation || null,
          difficulty,
          status:        'pending',
        })
        .select('id')
        .single()
      if (qErr) throw new Error(`question insert: ${qErr.message}`)

      // 6. Insert 4 options
      const optionRows = [
        { question_id: question.id, option_key: 'A', option_text: optA },
        { question_id: question.id, option_key: 'B', option_text: optB },
        { question_id: question.id, option_key: 'C', option_text: optC },
        { question_id: question.id, option_key: 'D', option_text: optD },
      ]
      const { data: options, error: optsErr } = await supabase
        .from('options')
        .insert(optionRows)
        .select('id, option_key')
      if (optsErr) throw new Error(`options insert: ${optsErr.message}`)

      // 7. Update correct_option_id
      const correctKeyUpper = correctKey.toUpperCase() // 'A' | 'B' | 'C' | 'D'
      const correctOption = options!.find(o => o.option_key === correctKeyUpper)
      if (!correctOption) throw new Error(`Correct option "${correctKey}" not found in inserted options`)

      const { error: updateErr } = await supabase
        .from('questions')
        .update({ correct_option_id: correctOption.id })
        .eq('id', question.id)
      if (updateErr) throw new Error(`correct_option update: ${updateErr.message}`)

      inserted++
      if (inserted % 50 === 0) {
        console.log(`  Imported ${inserted}/${total - skipped} (row ${i + 1}/${total})...`)
      }
    } catch (err: any) {
      errors++
      console.error(`  ERROR at row ${i + 2} (Q: "${questionText.slice(0, 60)}"): ${err.message}`)
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`✓ Done`)
  console.log(`  Total rows in sheet : ${total}`)
  console.log(`  Inserted            : ${inserted}`)
  console.log(`  Skipped             : ${skipped}`)
  console.log(`  Errors              : ${errors}`)
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
