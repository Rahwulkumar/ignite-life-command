import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { 
  Code2, Plus, ChevronRight, Layers, Brain, Server, 
  Cloud, CheckCircle2, Circle, ArrowRight, Sparkles,
  BookOpen, Target, MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { AtlasChat } from "@/components/tech/AtlasChat";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Topic {
  id: string;
  name: string;
  completed: boolean;
}

interface TechTrack {
  id: string;
  name: string;
  icon: string;
  topics: Topic[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  layers: Layers,
  brain: Brain,
  server: Server,
  cloud: Cloud,
};

const defaultTracks: TechTrack[] = [
  { 
    id: "1", 
    name: "Frontend", 
    icon: "layers",
    topics: [
      { id: "1", name: "React Hooks", completed: true },
      { id: "2", name: "State Management", completed: true },
      { id: "3", name: "TypeScript", completed: false },
      { id: "4", name: "Testing", completed: false },
    ]
  },
  { 
    id: "2", 
    name: "AI/ML", 
    icon: "brain",
    topics: [
      { id: "1", name: "Neural Networks", completed: true },
      { id: "2", name: "Transformers", completed: false },
      { id: "3", name: "Fine-tuning LLMs", completed: false },
    ]
  },
  { 
    id: "3", 
    name: "Backend", 
    icon: "server",
    topics: [
      { id: "1", name: "REST APIs", completed: true },
      { id: "2", name: "Authentication", completed: true },
      { id: "3", name: "Caching", completed: true },
      { id: "4", name: "Message Queues", completed: false },
    ]
  },
  { 
    id: "4", 
    name: "System Design", 
    icon: "cloud",
    topics: [
      { id: "1", name: "Load Balancing", completed: true },
      { id: "2", name: "Sharding", completed: false },
    ]
  },
];

const TechPage = () => {
  const [tracks, setTracks] = useState<TechTrack[]>(defaultTracks);
  const [activeTrack, setActiveTrack] = useState<string>(tracks[0]?.id);
  const [isAddTrackOpen, setIsAddTrackOpen] = useState(false);
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
  const [newTrackName, setNewTrackName] = useState("");
  const [newTopicName, setNewTopicName] = useState("");
  const [showAtlas, setShowAtlas] = useState(false);

  const currentTrack = tracks.find(t => t.id === activeTrack);
  
  const totalTopics = tracks.reduce((sum, t) => sum + t.topics.length, 0);
  const completedTopics = tracks.reduce((sum, t) => sum + t.topics.filter(tp => tp.completed).length, 0);

  const handleAddTrack = () => {
    if (!newTrackName.trim()) return;
    const newTrack: TechTrack = {
      id: Date.now().toString(),
      name: newTrackName.trim(),
      icon: "layers",
      topics: [],
    };
    setTracks([...tracks, newTrack]);
    setActiveTrack(newTrack.id);
    setNewTrackName("");
    setIsAddTrackOpen(false);
  };

  const handleAddTopic = () => {
    if (!newTopicName.trim() || !currentTrack) return;
    setTracks(tracks.map(t => 
      t.id === activeTrack 
        ? { ...t, topics: [...t.topics, { id: Date.now().toString(), name: newTopicName.trim(), completed: false }] }
        : t
    ));
    setNewTopicName("");
    setIsAddTopicOpen(false);
  };

  const toggleTopic = (topicId: string) => {
    setTracks(tracks.map(t => 
      t.id === activeTrack 
        ? { ...t, topics: t.topics.map(tp => tp.id === topicId ? { ...tp, completed: !tp.completed } : tp) }
        : t
    ));
  };

  if (showAtlas) {
    return (
      <MainLayout>
        <PageTransition>
          <div className="h-[calc(100vh-2rem)] flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <button 
                onClick={() => setShowAtlas(false)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to Learning
              </button>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">Atlas</span>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <AtlasChat />
            </div>
          </div>
        </PageTransition>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageTransition>
        <div className="min-h-screen">
          {/* Hero Section */}
          <div className="px-8 pt-12 pb-8 border-b border-border">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <Code2 className="w-4 h-4" />
                    <span className="text-sm">Learning</span>
                  </div>
                  <h1 className="text-3xl font-medium tracking-tight mb-2">Tech & Engineering</h1>
                  <p className="text-muted-foreground">
                    {completedTopics} of {totalTopics} topics completed across {tracks.length} tracks
                  </p>
                </div>
                <button
                  onClick={() => setShowAtlas(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">Ask Atlas</span>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="relative h-1 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-foreground rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto px-8 py-8">
            <div className="grid grid-cols-12 gap-8">
              {/* Left: Track Navigation */}
              <div className="col-span-4 space-y-2">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Tracks</p>
                  <button
                    onClick={() => setIsAddTrackOpen(true)}
                    className="p-1 rounded hover:bg-muted transition-colors"
                  >
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                {tracks.map((track) => {
                  const Icon = iconMap[track.icon] || Layers;
                  const completed = track.topics.filter(t => t.completed).length;
                  const total = track.topics.length;
                  const isActive = track.id === activeTrack;

                  return (
                    <button
                      key={track.id}
                      onClick={() => setActiveTrack(track.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all",
                        isActive 
                          ? "bg-foreground text-background" 
                          : "hover:bg-muted"
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{track.name}</p>
                        <p className={cn(
                          "text-xs",
                          isActive ? "text-background/70" : "text-muted-foreground"
                        )}>
                          {completed}/{total}
                        </p>
                      </div>
                      {total > 0 && (
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                          isActive ? "bg-background/20" : "bg-muted"
                        )}>
                          {Math.round((completed / total) * 100)}%
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Right: Topics */}
              <div className="col-span-8">
                <AnimatePresence mode="wait">
                  {currentTrack && (
                    <motion.div
                      key={currentTrack.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-medium">{currentTrack.name}</h2>
                        <button
                          onClick={() => setIsAddTopicOpen(true)}
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="w-3 h-3" />
                          Add topic
                        </button>
                      </div>

                      {currentTrack.topics.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Target className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <p className="text-muted-foreground mb-4">No topics yet</p>
                          <button
                            onClick={() => setIsAddTopicOpen(true)}
                            className="text-sm font-medium hover:underline"
                          >
                            Add your first topic →
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {currentTrack.topics.map((topic, index) => (
                            <motion.button
                              key={topic.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => toggleTopic(topic.id)}
                              className={cn(
                                "w-full flex items-center gap-4 p-4 rounded-lg text-left transition-all group",
                                topic.completed 
                                  ? "bg-muted/30" 
                                  : "hover:bg-muted/50"
                              )}
                            >
                              <div className={cn(
                                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                topic.completed 
                                  ? "bg-foreground border-foreground" 
                                  : "border-muted-foreground group-hover:border-foreground"
                              )}>
                                {topic.completed && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                  >
                                    <CheckCircle2 className="w-3 h-3 text-background" />
                                  </motion.div>
                                )}
                              </div>
                              <span className={cn(
                                "flex-1 transition-colors",
                                topic.completed && "text-muted-foreground line-through"
                              )}>
                                {topic.name}
                              </span>
                              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Add Track Modal */}
        <Dialog open={isAddTrackOpen} onOpenChange={setIsAddTrackOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>New Track</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <input
                type="text"
                value={newTrackName}
                onChange={(e) => setNewTrackName(e.target.value)}
                placeholder="e.g., DevOps, Blockchain, Mobile"
                className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20"
                maxLength={30}
                onKeyDown={(e) => e.key === "Enter" && handleAddTrack()}
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setIsAddTrackOpen(false)} className="px-4 py-2 text-sm text-muted-foreground">
                  Cancel
                </button>
                <button
                  onClick={handleAddTrack}
                  disabled={!newTrackName.trim()}
                  className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Topic Modal */}
        <Dialog open={isAddTopicOpen} onOpenChange={setIsAddTopicOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Add Topic to {currentTrack?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <input
                type="text"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="e.g., React Server Components"
                className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20"
                maxLength={50}
                onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setIsAddTopicOpen(false)} className="px-4 py-2 text-sm text-muted-foreground">
                  Cancel
                </button>
                <button
                  onClick={handleAddTopic}
                  disabled={!newTopicName.trim()}
                  className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </PageTransition>
    </MainLayout>
  );
};

export default TechPage;