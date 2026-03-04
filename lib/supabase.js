import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://efwffwyslgidrzumarqf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmd2Zmd3lzbGdpZHJ6dW1hcnFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NDM5MjUsImV4cCI6MjA4ODIxOTkyNX0.acdIUlSW6Wp4up6rTlkRqYrVDqi4IWXexXybds8KCgA'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmd2Zmd3lzbGdpZHJ6dW1hcnFmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjY0MzkyNSwiZXhwIjoyMDg4MjE5OTI1fQ.RNs-PNHsh1NI10ZRUO4uDUYWJNX8-lH8JNjLoXSImqA'

// Client for general use
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client for administrative use (bypass RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})
