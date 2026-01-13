import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Award, BookOpen, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CertificationCard, Certification } from "./CertificationCard";
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

const providers = ["AWS", "Google", "Azure", "CompTIA", "Meta", "Cisco", "Other"];

const defaultCertifications: Certification[] = [
  {
    id: "1",
    name: "Solutions Architect Associate",
    provider: "AWS",
    status: "preparing",
    targetDate: "2025-03-15",
    progress: 45,
  },
  {
    id: "2",
    name: "Professional Cloud Architect",
    provider: "Google",
    status: "preparing",
    targetDate: "2025-06-01",
    progress: 20,
  },
  {
    id: "3",
    name: "Developer Associate",
    provider: "AWS",
    status: "earned",
    earnedDate: "2024-08-20",
    credentialUrl: "https://aws.amazon.com/verification",
  },
  {
    id: "4",
    name: "React Developer Certificate",
    provider: "Meta",
    status: "earned",
    earnedDate: "2024-05-10",
  },
];

type FilterType = "all" | "preparing" | "earned";

export function CertificationsHub() {
  const [certifications, setCertifications] = useState<Certification[]>(defaultCertifications);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  
  const [newCert, setNewCert] = useState({
    name: "",
    provider: "AWS",
    status: "preparing" as Certification["status"],
    targetDate: "",
    earnedDate: "",
    credentialUrl: "",
    progress: 0,
  });

  const filteredCerts = certifications
    .filter(c => filter === "all" || c.status === filter)
    .filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.provider.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const preparingCerts = filteredCerts.filter(c => c.status === "preparing");
  const earnedCerts = filteredCerts.filter(c => c.status === "earned");

  const handleAdd = () => {
    if (!newCert.name.trim()) return;
    
    const cert: Certification = {
      id: Date.now().toString(),
      name: newCert.name.trim(),
      provider: newCert.provider,
      status: newCert.status,
      targetDate: newCert.status === "preparing" ? newCert.targetDate : undefined,
      earnedDate: newCert.status === "earned" ? newCert.earnedDate : undefined,
      credentialUrl: newCert.credentialUrl || undefined,
      progress: newCert.status === "preparing" ? newCert.progress : undefined,
    };

    setCertifications([cert, ...certifications]);
    setNewCert({
      name: "",
      provider: "AWS",
      status: "preparing",
      targetDate: "",
      earnedDate: "",
      credentialUrl: "",
      progress: 0,
    });
    setIsAddOpen(false);
  };

  const handleEdit = (cert: Certification) => {
    setEditingCert(cert);
  };

  const handleUpdate = () => {
    if (!editingCert) return;
    
    setCertifications(certifications.map(c => 
      c.id === editingCert.id ? editingCert : c
    ));
    setEditingCert(null);
  };

  const handleDelete = (id: string) => {
    setCertifications(certifications.filter(c => c.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search certifications..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter pills */}
          <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
            {(["all", "preparing", "earned"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize",
                  filter === f
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          
          <Button onClick={() => setIsAddOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Certification
          </Button>
        </div>
      </div>

      {/* In Progress Section */}
      {preparingCerts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-tech" />
            In Progress
            <span className="text-sm font-normal text-muted-foreground">
              ({preparingCerts.length})
            </span>
          </h3>
          
          {/* Featured card for first preparing cert */}
          {preparingCerts[0] && (
            <div className="mb-4">
              <CertificationCard 
                certification={preparingCerts[0]} 
                variant="featured"
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          )}
          
          {/* List for remaining */}
          {preparingCerts.length > 1 && (
            <div className="space-y-3">
              {preparingCerts.slice(1).map((cert) => (
                <CertificationCard 
                  key={cert.id} 
                  certification={cert}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Earned Section */}
      {earnedCerts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-finance" />
            Earned
            <span className="text-sm font-normal text-muted-foreground">
              ({earnedCerts.length})
            </span>
          </h3>
          <div className="space-y-3">
            {earnedCerts.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CertificationCard 
                  certification={cert}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredCerts.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 border border-dashed border-border rounded-xl"
        >
          <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No certifications found</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            {searchQuery 
              ? "Try adjusting your search terms"
              : "Start tracking your certifications to monitor your progress"
            }
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsAddOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Certification
            </Button>
          )}
        </motion.div>
      )}

      {/* Add Certification Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Certification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Certification Name</label>
              <Input
                value={newCert.name}
                onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                placeholder="e.g., Solutions Architect Associate"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Provider</label>
              <Select 
                value={newCert.provider}
                onValueChange={(v) => setNewCert({ ...newCert, provider: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select 
                value={newCert.status}
                onValueChange={(v) => setNewCert({ ...newCert, status: v as Certification["status"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="earned">Earned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newCert.status === "preparing" && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">Target Exam Date</label>
                  <Input
                    type="date"
                    value={newCert.targetDate}
                    onChange={(e) => setNewCert({ ...newCert, targetDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Progress (%)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={newCert.progress}
                    onChange={(e) => setNewCert({ ...newCert, progress: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </>
            )}

            {newCert.status === "earned" && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">Date Earned</label>
                  <Input
                    type="date"
                    value={newCert.earnedDate}
                    onChange={(e) => setNewCert({ ...newCert, earnedDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Credential URL (optional)</label>
                  <Input
                    value={newCert.credentialUrl}
                    onChange={(e) => setNewCert({ ...newCert, credentialUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={!newCert.name.trim()}>Add Certification</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Certification Dialog */}
      <Dialog open={!!editingCert} onOpenChange={() => setEditingCert(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Certification</DialogTitle>
          </DialogHeader>
          {editingCert && (
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Certification Name</label>
                <Input
                  value={editingCert.name}
                  onChange={(e) => setEditingCert({ ...editingCert, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Provider</label>
                <Select 
                  value={editingCert.provider}
                  onValueChange={(v) => setEditingCert({ ...editingCert, provider: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {editingCert.status === "preparing" && (
                <>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Target Exam Date</label>
                    <Input
                      type="date"
                      value={editingCert.targetDate || ""}
                      onChange={(e) => setEditingCert({ ...editingCert, targetDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Progress (%)</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={editingCert.progress || 0}
                      onChange={(e) => setEditingCert({ ...editingCert, progress: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => setEditingCert(null)}>Cancel</Button>
                <Button onClick={handleUpdate}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
