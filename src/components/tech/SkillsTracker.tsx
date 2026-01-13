import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, ArrowLeft, Sparkles, Edit2, Trash2, X,
  Code, Server, Cloud, Shield, Brain, Smartphone, 
  Globe, Database, Terminal, Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SkillDomainCard } from "./SkillDomainCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Skill {
  id: string;
  name: string;
  proficiency: "beginner" | "intermediate" | "advanced" | "expert";
  notes?: string;
  lastUpdated: string;
}

interface SkillDomain {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  skills: Skill[];
}

const iconMap: Record<string, React.ReactNode> = {
  Code: <Code className="w-5 h-5" />,
  Server: <Server className="w-5 h-5" />,
  Cloud: <Cloud className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  Brain: <Brain className="w-5 h-5" />,
  Smartphone: <Smartphone className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />,
  Terminal: <Terminal className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
};

const defaultDomains: SkillDomain[] = [
  { id: "frontend", name: "Frontend", icon: <Code className="w-5 h-5" />, color: "tech", skills: [
    { id: "1", name: "React", proficiency: "advanced", lastUpdated: "2025-01-10" },
    { id: "2", name: "TypeScript", proficiency: "advanced", lastUpdated: "2025-01-08" },
    { id: "3", name: "Next.js", proficiency: "intermediate", lastUpdated: "2025-01-05" },
  ]},
  { id: "backend", name: "Backend", icon: <Server className="w-5 h-5" />, color: "finance", skills: [
    { id: "4", name: "Node.js", proficiency: "intermediate", lastUpdated: "2025-01-07" },
    { id: "5", name: "Python", proficiency: "intermediate", lastUpdated: "2025-01-03" },
  ]},
  { id: "cloud", name: "Cloud & DevOps", icon: <Cloud className="w-5 h-5" />, color: "trading", skills: [
    { id: "6", name: "AWS", proficiency: "beginner", lastUpdated: "2025-01-01" },
    { id: "7", name: "Docker", proficiency: "intermediate", lastUpdated: "2024-12-28" },
  ]},
  { id: "ai", name: "AI & Machine Learning", icon: <Brain className="w-5 h-5" />, color: "spiritual", skills: [
    { id: "8", name: "LangChain", proficiency: "beginner", lastUpdated: "2025-01-09" },
  ]},
  { id: "mobile", name: "Mobile Development", icon: <Smartphone className="w-5 h-5" />, color: "music", skills: []},
  { id: "security", name: "Security", icon: <Shield className="w-5 h-5" />, color: "content", skills: []},
];

const proficiencyLevels = [
  { value: "beginner", label: "Beginner", color: "bg-muted text-muted-foreground" },
  { value: "intermediate", label: "Intermediate", color: "bg-tech/20 text-tech" },
  { value: "advanced", label: "Advanced", color: "bg-finance/20 text-finance" },
  { value: "expert", label: "Expert", color: "bg-trading/20 text-trading" },
];

export function SkillsTracker() {
  const [domains, setDomains] = useState<SkillDomain[]>(defaultDomains);
  const [selectedDomain, setSelectedDomain] = useState<SkillDomain | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isAddDomainOpen, setIsAddDomainOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  
  const [newSkill, setNewSkill] = useState({
    name: "",
    proficiency: "beginner" as Skill["proficiency"],
    notes: "",
  });

  const [newDomain, setNewDomain] = useState({
    name: "",
    icon: "Code",
  });

  const filteredDomains = domains.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.skills.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddSkill = () => {
    if (!selectedDomain || !newSkill.name.trim()) return;
    
    const skill: Skill = {
      id: Date.now().toString(),
      name: newSkill.name.trim(),
      proficiency: newSkill.proficiency,
      notes: newSkill.notes.trim() || undefined,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setDomains(domains.map(d => 
      d.id === selectedDomain.id 
        ? { ...d, skills: [...d.skills, skill] }
        : d
    ));
    setSelectedDomain(prev => prev ? { ...prev, skills: [...prev.skills, skill] } : null);
    setNewSkill({ name: "", proficiency: "beginner", notes: "" });
    setIsAddSkillOpen(false);
  };

  const handleUpdateSkill = () => {
    if (!selectedDomain || !editingSkill) return;
    
    const updatedSkill = {
      ...editingSkill,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setDomains(domains.map(d => 
      d.id === selectedDomain.id 
        ? { ...d, skills: d.skills.map(s => s.id === editingSkill.id ? updatedSkill : s) }
        : d
    ));
    setSelectedDomain(prev => prev 
      ? { ...prev, skills: prev.skills.map(s => s.id === editingSkill.id ? updatedSkill : s) }
      : null
    );
    setEditingSkill(null);
  };

  const handleDeleteSkill = (skillId: string) => {
    if (!selectedDomain) return;
    
    setDomains(domains.map(d => 
      d.id === selectedDomain.id 
        ? { ...d, skills: d.skills.filter(s => s.id !== skillId) }
        : d
    ));
    setSelectedDomain(prev => prev 
      ? { ...prev, skills: prev.skills.filter(s => s.id !== skillId) }
      : null
    );
  };

  const handleAddDomain = () => {
    if (!newDomain.name.trim()) return;
    
    const domain: SkillDomain = {
      id: Date.now().toString(),
      name: newDomain.name.trim(),
      icon: iconMap[newDomain.icon] || <Code className="w-5 h-5" />,
      color: "tech",
      skills: [],
    };

    setDomains([...domains, domain]);
    setNewDomain({ name: "", icon: "Code" });
    setIsAddDomainOpen(false);
  };

  if (selectedDomain) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSelectedDomain(null)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                "bg-tech/10 text-tech border border-tech/20"
              )}>
                {selectedDomain.icon}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{selectedDomain.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedDomain.skills.length} skills tracked
                </p>
              </div>
            </div>
          </div>
          <Button onClick={() => setIsAddSkillOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Skill
          </Button>
        </div>

        {/* Skills list */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {selectedDomain.skills.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 border border-dashed border-border rounded-xl"
              >
                <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No skills added yet</p>
                <Button 
                  variant="link" 
                  onClick={() => setIsAddSkillOpen(true)}
                  className="text-tech"
                >
                  Add your first skill
                </Button>
              </motion.div>
            ) : (
              selectedDomain.skills.map((skill, index) => {
                const profLevel = proficiencyLevels.find(p => p.value === skill.proficiency);
                
                return (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "group flex items-center justify-between p-4",
                      "rounded-xl border border-border/50 bg-card/80",
                      "hover:border-border transition-colors"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <span className="text-lg font-semibold text-muted-foreground">
                          {skill.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{skill.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium",
                            profLevel?.color
                          )}>
                            {profLevel?.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Updated {new Date(skill.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setEditingSkill(skill)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Add Skill Dialog */}
        <Dialog open={isAddSkillOpen} onOpenChange={setIsAddSkillOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Skill to {selectedDomain.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Skill Name</label>
                <Input
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  placeholder="e.g., React, Python, AWS"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Proficiency Level</label>
                <Select 
                  value={newSkill.proficiency}
                  onValueChange={(v) => setNewSkill({ ...newSkill, proficiency: v as Skill["proficiency"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {proficiencyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Notes (optional)</label>
                <Textarea
                  value={newSkill.notes}
                  onChange={(e) => setNewSkill({ ...newSkill, notes: e.target.value })}
                  placeholder="Any notes about your experience..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => setIsAddSkillOpen(false)}>Cancel</Button>
                <Button onClick={handleAddSkill} disabled={!newSkill.name.trim()}>Add Skill</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Skill Dialog */}
        <Dialog open={!!editingSkill} onOpenChange={() => setEditingSkill(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Skill</DialogTitle>
            </DialogHeader>
            {editingSkill && (
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Skill Name</label>
                  <Input
                    value={editingSkill.name}
                    onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Proficiency Level</label>
                  <Select 
                    value={editingSkill.proficiency}
                    onValueChange={(v) => setEditingSkill({ ...editingSkill, proficiency: v as Skill["proficiency"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {proficiencyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Notes</label>
                  <Textarea
                    value={editingSkill.notes || ""}
                    onChange={(e) => setEditingSkill({ ...editingSkill, notes: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="ghost" onClick={() => setEditingSkill(null)}>Cancel</Button>
                  <Button onClick={handleUpdateSkill}>Save Changes</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search domains or skills..."
            className="pl-9"
          />
        </div>
        <Button onClick={() => setIsAddDomainOpen(true)} variant="outline" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Domain
        </Button>
      </div>

      {/* Domain Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDomains.map((domain, index) => (
          <motion.div
            key={domain.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <SkillDomainCard 
              domain={domain} 
              onSelect={() => setSelectedDomain(domain)} 
            />
          </motion.div>
        ))}
      </div>

      {/* Add Domain Dialog */}
      <Dialog open={isAddDomainOpen} onOpenChange={setIsAddDomainOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Skill Domain</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Domain Name</label>
              <Input
                value={newDomain.name}
                onChange={(e) => setNewDomain({ ...newDomain, name: e.target.value })}
                placeholder="e.g., Data Science, Web3"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Icon</label>
              <Select 
                value={newDomain.icon}
                onValueChange={(v) => setNewDomain({ ...newDomain, icon: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(iconMap).map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      <div className="flex items-center gap-2">
                        {iconMap[icon]}
                        {icon}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setIsAddDomainOpen(false)}>Cancel</Button>
              <Button onClick={handleAddDomain} disabled={!newDomain.name.trim()}>Add Domain</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
