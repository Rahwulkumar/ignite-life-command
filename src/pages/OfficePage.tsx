import { useState } from "react";
import { Building2, CheckSquare, FileText, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageTransition } from "@/components/layout/PageTransition";
import { TaskManager } from "@/components/office/TaskManager";
import { NotesPanel } from "@/components/office/NotesPanel";
import { EveChat } from "@/components/office/EveChat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function OfficePage() {
  const [activeTab, setActiveTab] = useState("notes");

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 ml-16">
        <PageTransition>
          <div className="h-screen flex flex-col">
            {/* Header */}
            <header className="border-b border-border px-8 py-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-office/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-office" />
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
              {/* Left Panel - Tabs for Notes/Tasks */}
              <div className="flex-1 border-r border-border flex flex-col">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                  <div className="border-b border-border px-4">
                    <TabsList className="bg-transparent h-12">
                      <TabsTrigger 
                        value="notes" 
                        className="data-[state=active]:bg-muted data-[state=active]:text-foreground"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Notes
                      </TabsTrigger>
                      <TabsTrigger 
                        value="tasks"
                        className="data-[state=active]:bg-muted data-[state=active]:text-foreground"
                      >
                        <CheckSquare className="w-4 h-4 mr-2" />
                        Tasks
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="notes" className="flex-1 m-0 overflow-hidden">
                    <NotesPanel />
                  </TabsContent>
                  
                  <TabsContent value="tasks" className="flex-1 m-0 overflow-hidden">
                    <TaskManager />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Panel - Eve Chat */}
              <div className="w-[400px] flex flex-col">
                <div className="border-b border-border px-4 h-12 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-office" />
                  <span className="font-medium text-sm">Eve - Executive Assistant</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <EveChat />
                </div>
              </div>
            </div>
          </div>
        </PageTransition>
      </main>
    </div>
  );
}
