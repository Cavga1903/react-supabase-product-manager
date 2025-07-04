import { createClient } from '@supabase/supabase-js'

// Use environment variables for production, fallback to hardcoded values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cgrgxqrgowevvjpjbjkk.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNncmd4cXJnb3dldnZqcGpiamtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NDIxMTQsImV4cCI6MjA2NzIxODExNH0.3NnolMMDm2RzTwFo85ztRB-XEngpkaQgPNMLHYZ3Jts'

export const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase 