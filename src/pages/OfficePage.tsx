import { useState } from "react";
import { Building2, CheckSquare, FileText, Sparkles, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageTransition } from "@/components/layout/PageTransition";
import { TaskManager } from "@/components/office/TaskManager";
import { NotesPanel } from "@/components/office/NotesPanel";
import { EveChat } from "@/components/office/EveChat";
import { Button } from "@/components/ui/button";

export default function OfficePage() {
  const [view, setView] = useState<"dashboard" | "notes">("dashboard");

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 ml-16">
        <PageTransition>
          <AnimatePresence mode="wait">
            {view === "notes" ? (
              <motion.div
                key="notes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-screen flex flex-col"
              >
                {/* Minimal header for notes view */}
                <header className="border-b border-border px-4 py-2 flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setView("dashboard")}
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Office
                  </Button>
                </header>
                
                {/* Full-screen Notes */}
                <div className="flex-1 overflow-hidden">
                  <NotesPanel />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-screen flex flex-col"
              >
                {/* Header */}
                <header className="border-b border-border px-8 py-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-semibold">Office</h1>
                      <p className="text-sm text-muted-foreground">Professional workspace & notes</p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckSquare className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Tasks Today:</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Notes:</span>
                      <span className="font-medium">0</span>
                    </div>
                  </div>
                </header>

                {/* Main Content */}
                <div className="flex-1 flex overflow-hidden">
                  {/* Left Panel - Quick Access Cards */}
                  <div className="flex-1 border-r border-border p-6 overflow-auto">
                    <div className="grid grid-cols-2 gap-4 max-w-2xl">
                      {/* Notes Card - Opens full Notion view */}
                      <button
                        onClick={() => setView("notes")}
                        className="group p-6 rounded-xl border border-border bg-card hover:bg-muted/50 transition-all text-left hover:border-amber-500/30"
                      >
                        <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <FileText className="w-6 h-6 text-amber-500" />
                        </div>
                        <h3 className="font-semibold mb-1">Notes</h3>
                        <p className="text-sm text-muted-foreground">
                          Full Notion-like editor for documents and notes
                        </p>
                      </button>

                      {/* Tasks Card */}
                      <div className="p-6 rounded-xl border border-border bg-card">
                        <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                          <CheckSquare className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="font-semibold mb-3">Tasks</h3>
                        <div className="h-[200px] overflow-hidden">
                          <TaskManager compact />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Panel - Eve Chat */}
                  <div className="w-[400px] flex flex-col">
                    <div className="border-b border-border px-4 h-12 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span className="font-medium text-sm">Eve - Executive Assistant</span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <EveChat />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </PageTransition>
      </main>
    </div>
  );
}
