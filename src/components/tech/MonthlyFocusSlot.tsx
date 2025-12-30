import { useState } from "react";
import { Plus, Flame, CheckCircle2, ExternalLink, Play, BookOpen, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface Video {
  id: string;
  title: string;
  url: string;
  completed: boolean;
}

export interface FocusTopic {
  id: string;
  name: string;
  videos: Video[];
  dailyPractice: string[];
  streak: number;
}

interface MonthlyFocusSlotProps {
  slot: number;
  topic: FocusTopic | null;
  availableTopics: string[];
  onSelectTopic: (name: string) => void;
  onAddVideo: (topicId: string, url: string, title: string) => void;
  onToggleVideo: (topicId: string, videoId: string) => void;
  onLogPractice: (topicId: string) => void;
  hasPracticedToday: boolean;
}

const slotGradients = [
  "from-tech/20 via-tech/5 to-transparent",
  "from-spiritual/20 via-spiritual/5 to-transparent",
];

const slotAccents = ["tech", "spiritual"];

export function MonthlyFocusSlot({
  slot,
  topic,
  availableTopics,
  onSelectTopic,
  onAddVideo,
  onToggleVideo,
  onLogPractice,
  hasPracticedToday,
}: MonthlyFocusSlotProps) {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [customTopic, setCustomTopic] = useState("");

  const gradient = slotGradients[slot - 1] || slotGradients[0];
  const accent = slotAccents[slot - 1] || slotAccents[0];

  const handleAddVideo = () => {
    if (!topic || !videoUrl.trim()) return;
    onAddVideo(topic.id, videoUrl.trim(), videoTitle.trim() || "Untitled Video");
    setVideoUrl("");
    setVideoTitle("");
    setIsAddVideoOpen(false);
  };

  const handleSelectTopic = (name: string) => {
    onSelectTopic(name);
    setIsSelectOpen(false);
    setCustomTopic("");
  };

  const completedVideos = topic?.videos.filter(v => v.completed).length ?? 0;
  const totalVideos = topic?.videos.length ?? 0;

  // Empty State
  if (!topic) {
    return (
      <>
        <motion.button
          onClick={() => setIsSelectOpen(true)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={cn(
            "relative h-64 w-full rounded-2xl border border-dashed border-border/80 overflow-hidden",
            "hover:border-muted-foreground/50 transition-all duration-300 group"
          )}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--muted-foreground) / 0.15) 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }} />
          </div>
          
          {/* Gradient Overlay on Hover */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            gradient
          )} />

          <div className="relative h-full flex flex-col items-center justify-center gap-4 p-6">
            <motion.div 
              className="w-16 h-16 rounded-2xl bg-muted/80 flex items-center justify-center group-hover:bg-muted transition-colors"
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <Plus className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
            </motion.div>
            <div className="text-center">
              <p className="font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                Focus Slot {slot}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Pick a technology to master
              </p>
            </div>
          </div>
        </motion.button>

        <Dialog open={isSelectOpen} onOpenChange={setIsSelectOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Choose Your Focus</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 mt-2">
              {availableTopics.map((name) => (
                <motion.button
                  key={name}
                  onClick={() => handleSelectTopic(name)}
                  whileHover={{ x: 4 }}
                  className="w-full text-left px-4 py-3 rounded-xl bg-muted/30 hover:bg-muted transition-colors flex items-center justify-between group"
                >
                  <span>{name}</span>
                  <Sparkles className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
              <div className="pt-3 border-t border-border">
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Or type something else..."
                  className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border focus:outline-none focus:ring-2 focus:ring-tech/30"
                  onKeyDown={(e) => e.key === "Enter" && customTopic.trim() && handleSelectTopic(customTopic.trim())}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Filled State
  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative rounded-2xl border border-border/50 overflow-hidden",
          "bg-gradient-to-br from-card to-card/50"
        )}
      >
        {/* Top Gradient */}
        <div className={cn("absolute top-0 inset-x-0 h-24 bg-gradient-to-b", gradient)} />

        <div className="relative p-5 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  accent === "tech" ? "bg-tech" : "bg-spiritual"
                )} />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Focus {slot}</span>
              </div>
              <h3 className="font-semibold text-xl">{topic.name}</h3>
            </div>
            {topic.streak > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-trading/10 text-trading text-sm font-medium">
                <Flame className="w-4 h-4" />
                {topic.streak}
              </div>
            )}
          </div>

          {/* Progress Ring */}
          {totalVideos > 0 && (
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 -rotate-90">
                  <circle
                    cx="24" cy="24" r="20"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="4"
                  />
                  <motion.circle
                    cx="24" cy="24" r="20"
                    fill="none"
                    stroke={accent === "tech" ? "hsl(var(--tech))" : "hsl(var(--spiritual))"}
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 126" }}
                    animate={{ 
                      strokeDasharray: `${(completedVideos / totalVideos) * 126} 126` 
                    }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                  {Math.round((completedVideos / totalVideos) * 100)}%
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{completedVideos}/{totalVideos} videos</p>
                <p className="text-xs text-muted-foreground">Keep going!</p>
              </div>
            </div>
          )}

          {/* Daily Practice Button */}
          <motion.button
            onClick={() => onLogPractice(topic.id)}
            disabled={hasPracticedToday}
            whileHover={!hasPracticedToday ? { scale: 1.02 } : {}}
            whileTap={!hasPracticedToday ? { scale: 0.98 } : {}}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all",
              hasPracticedToday
                ? "bg-finance/10 text-finance border border-finance/20"
                : "bg-foreground text-background hover:opacity-90"
            )}
          >
            {hasPracticedToday ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Practiced Today ✓
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Log Today's Practice
              </>
            )}
          </motion.button>

          {/* Video Queue */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Video Queue</span>
              </div>
              <button
                onClick={() => setIsAddVideoOpen(true)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>

            <div className="space-y-2">
              <AnimatePresence>
                {topic.videos.slice(0, 3).map((video, i) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 group transition-colors"
                  >
                    <button
                      onClick={() => onToggleVideo(topic.id, video.id)}
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                        video.completed
                          ? "bg-finance border-finance"
                          : "border-muted-foreground/50 hover:border-foreground"
                      )}
                    >
                      {video.completed && <CheckCircle2 className="w-3 h-3 text-background" />}
                    </button>
                    <span className={cn(
                      "flex-1 text-sm truncate",
                      video.completed && "text-muted-foreground line-through"
                    )}>
                      {video.title}
                    </span>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                    </a>
                  </motion.div>
                ))}
              </AnimatePresence>

              {topic.videos.length > 3 && (
                <p className="text-xs text-muted-foreground text-center py-1">
                  +{topic.videos.length - 3} more
                </p>
              )}

              {topic.videos.length === 0 && (
                <button
                  onClick={() => setIsAddVideoOpen(true)}
                  className="w-full py-6 rounded-xl border border-dashed border-border/50 hover:border-muted-foreground/50 text-sm text-muted-foreground hover:text-foreground transition-all"
                >
                  + Add your first video
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Add Video Modal */}
      <Dialog open={isAddVideoOpen} onOpenChange={setIsAddVideoOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Video title"
              className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border focus:outline-none focus:ring-2 focus:ring-tech/30"
              autoFocus
            />
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/..."
              className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border focus:outline-none focus:ring-2 focus:ring-tech/30"
              onKeyDown={(e) => e.key === "Enter" && handleAddVideo()}
            />
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setIsAddVideoOpen(false)} 
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddVideo}
                disabled={!videoUrl.trim()}
                className="px-5 py-2 rounded-xl bg-foreground text-background text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                Add Video
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
