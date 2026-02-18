import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

export function SpiritualDebug() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [logs, setLogs] = useState<string[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

    const runDiagnostics = async () => {
        setStatus("loading");
        setLogs([]);
        addLog("Starting diagnostics...");

        try {
            // 1. Check Auth
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError) throw new Error(`Auth Error: ${authError.message}`);
            if (!user) throw new Error("No authenticated user found.");

            setUserId(user.id);
            addLog(`✅ Auth: User ID ${user.id.slice(0, 8)}...`);

            // 2. Check Table Accessibility via RPC (Bypass Cache)
            addLog("🔍 Running SQL Diagnostics via RPC...");
            const { data: rpcData, error: rpcError } = await supabase.rpc('debug_table_status'); // We use the existing RPC for simple check, but user wants deep analysis so we'd need to run the SQL manually or create a new RPC.
            // Actually, let's keep the debug tool simple for now, as I need to ask the USER to run the SQL in the dashboard for the deep output.

            if (rpcError) {
                addLog(`⚠️ RPC Method Failed: ${rpcError.message}`);
            } else {
                interface DebugStatus { table_exists: boolean }
                const info = rpcData as unknown as DebugStatus;
                addLog(`📊 DB Report: Table Exists: ${info.table_exists ? 'YES' : 'NO'}`);
            }

            // 3. Direct Table Check
            addLog("🔍 Checking table visibility via API...");
            const { data: selectData, error: selectError } = await supabase
                .from("spiritual_characters")
                .select("count", { count: "exact", head: true });

            if (selectError) {
                throw new Error(`Select Failed: ${selectError.message} (Code: ${selectError.code})`);
            }
            addLog(`✅ Table 'spiritual_characters' exists and is readable.`);

            // 3. Test Insert (Constraint Check)
            addLog("📝 Testing INSERT permission...");
            const testChar = {
                name: `Debug_Char_${Math.floor(Math.random() * 1000)}`,
                testament: "Old",
                user_id: user.id // Explicitly providing this to test
            };

            const { data: insertData, error: insertError } = await supabase
                .from("spiritual_characters")
                .insert(testChar)
                .select()
                .single();

            if (insertError) {
                throw new Error(`Insert Failed: ${insertError.message} (Code: ${insertError.code})`);
            }

            addLog(`✅ Insert Successful: Created '${insertData.name}'`);

            // 4. Cleanup (Delete the test char)
            addLog("🧹 Cleaning up test data...");
            const { error: deleteError } = await supabase
                .from("spiritual_characters")
                .delete()
                .eq("id", insertData.id);

            if (deleteError) addLog(`⚠️ Cleanup Warning: ${deleteError.message}`);
            else addLog("✅ Cleanup Successful.");

            setStatus("success");
            addLog("🎉 DIAGNOSTICS PASSED: Backend is healthy.");

        } catch (err) {
            const error = err as Error;
            console.error(error);
            setStatus("error");
            addLog(`❌ CRITICAL FAILURE: ${error.message}`);
            if (error.message.includes("does not exist")) {
                addLog("💡 HINT: The table is missing or RLS is blocking access to it.");
            }
            if (error.message.includes("schema cache")) {
                addLog("💡 HINT: PostgREST schema cache is stale. Run 'NOTIFY pgrst, \"reload schema\"'.");
            }
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto my-8 border-destructive/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <RefreshCw className="w-5 h-5" />
                    Backend Diagnostics
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Alert>
                    <AlertTitle>Debug Mode</AlertTitle>
                    <AlertDescription>
                        Use this to verify the database connection and permissions for the Spiritual Domain.
                    </AlertDescription>
                </Alert>

                <Button
                    onClick={runDiagnostics}
                    disabled={status === "loading"}
                    className="w-full"
                    variant={status === "error" ? "destructive" : "default"}
                >
                    {status === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Run System Check
                </Button>

                <div className="bg-muted p-4 rounded-md font-mono text-xs h-64 overflow-y-auto space-y-1">
                    {logs.length === 0 && <span className="text-muted-foreground">Ready to start...</span>}
                    {logs.map((log, i) => (
                        <div key={i} className={log.includes("❌") ? "text-red-500 font-bold" : log.includes("✅") ? "text-green-600" : ""}>
                            {log}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
