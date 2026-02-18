
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env to avoid dependency issues
function getEnv() {
    try {
        const envPath = path.resolve(__dirname, '.env');
        const content = fs.readFileSync(envPath, 'utf8');
        const env = {};
        content.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, ''); // strip quotes
                env[key] = val;
            }
        });
        return env;
    } catch (err) {
        console.error("Could not read .env file");
        return {};
    }
}

const env = getEnv();
const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;

console.log("--- ROBUST DIAGNOSTIC ---");
console.log("Target URL:", url);

if (!url || !key) {
    console.error("Missing URL or Key in .env");
    process.exit(1);
}

const supabase = createClient(url, key);

async function check() {
    console.log("\n1. Connectivity Check (Public Table)...");
    // Try to query a public table or just check health
    // tailored to what we know exists: daily_focus
    try {
        const { data, error } = await supabase.from('daily_focus').select('count', { count: 'exact', head: true });

        if (error) {
            console.log("❌ READ FAILED:");
            console.log("   Code:", error.code);
            console.log("   Message:", error.message);

            if (error.code === '42501') {
                console.log("   -> RLS DENIED READ ACCESS. (Policies might require auth)");
            }
        } else {
            console.log("✅ READ SUCCESS (Table exists and is readable)");
        }
    } catch (err) {
        console.log("❌ NETWORK ERROR:", err.message);
    }

    console.log("\n2. Write Check (Date Handling & RLS)...");
    const today = new Date().toISOString().split('T')[0];

    // Attempt Insert (Anonymous)
    const { error: insertError } = await supabase.from('daily_focus').insert({
        date: today,
        reference: "DIAGNOSTIC",
        content: "TEST",
        completed: false
        // Note: 'user_id' is missing. 
        // If DB enforces Not Null on user_id, we expect code 23502.
        // If RLS blocks it, we expect 42501.
    });

    if (insertError) {
        console.log("❌ WRITE FAILED (As Expected for Anon):");
        console.log("   Code:", insertError.code);
        console.log("   Message:", insertError.message);

        if (insertError.code === '23502') {
            console.log("   -> CONCLUSION: Table exists, connection good. Stopped by 'user_id' constraint. AUTH NEEDED.");
        } else if (insertError.code === '42501') {
            console.log("   -> CONCLUSION: RLS Policies are Active and Blocking Anon. AUTH NEEDED.");
        } else if (insertError.code === '404') {
            console.log("   -> CONCLUSION: TABLE MISSING (404).");
        }
    } else {
        console.log("⚠️ Write Succeeded (Unexpected for Anon User - Check Security!)");
    }

    console.log("--- END ---");
}

check();
