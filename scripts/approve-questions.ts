import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const envPath = path.join(__dirname, '..', '.env.local')
const envVars: Record<string, string> = {}
for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) envVars[match[1].trim()] = match[2].trim()
}

const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['SUPABASE_SERVICE_ROLE_KEY'], { auth: { persistSession: false } })

async function main() {
  const { data, error } = await supabase
    .from('questions')
    .update({ status: 'approved' })
    .eq('status', 'pending')
    .select('id')
  if (error) { console.error('Error:', error.message); process.exit(1) }
  console.log('Approved', data?.length, 'questions')
}

main()