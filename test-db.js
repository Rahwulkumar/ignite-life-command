
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://syqciavofhmztjwerpdx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5cWNpYXZvZmhtenRqd2VycGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNTM5MTQsImV4cCI6MjA4MjYyOTkxNH0.U_QT5Lok72Kwpu4bmcQ5srBww8ct0EjRhD_1u4eoJIk'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
    console.log("Testing connection to:", supabaseUrl)

    // 1. Try to select from daily_focus
    const { data, error } = await supabase
        .from('daily_focus')
        .select('*')
        .limit(1)

    if (error) {
        console.error("❌ Error accessing daily_focus:", error.message)
        console.error("Error Code:", error.code)
        console.error("Hint:", error.hint)
    } else {
        console.log("✅ Success! daily_focus table exists.")
        console.log("Data found:", data)
    }

    // 2. Try to access bible_reading_plans to check for columns
    const { data: bibleData, error: bibleError } = await supabase
        .from('bible_reading_plans')
        .select('current_verse')
        .limit(1)

    if (bibleError) {
        console.error("❌ Error accessing bible_reading_plans:", bibleError.message)
    } else {
        console.log("✅ Success! bible_reading_plans has current_verse column.")
    }
}

testConnection()
