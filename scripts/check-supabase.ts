/**
 * Simple Supabase connectivity check script.
 * Usage (local):
 *   setx SUPABASE_URL "https://xxxx.supabase.co"
 *   setx SUPABASE_ANON_KEY "your_anon_key"
 *   node ./dist/scripts/check-supabase.js
 *
 * Note: This file is a TypeScript source. Compile/run in your environment; do NOT commit real secrets.
 */

import { createClient } from '@supabase/supabase-js'

async function main() {
  const url = process.env.SUPABASE_URL
  const anon = process.env.SUPABASE_ANON_KEY

  if (!url || !anon) {
    console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY in your environment')
    process.exit(1)
  }

  const supabase = createClient(url, anon)

  try {
    const { data, error } = await supabase.from('test_table').select('*').limit(1)
    console.log('data:', data)
    if (error) console.error('supabase error:', error)
  } catch (err) {
    console.error('unexpected error:', err)
  }
}

main()
