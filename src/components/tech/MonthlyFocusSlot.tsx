import { useState } from "react";
import { Plus, Flame, Play, CheckCircle2, ExternalLink, X } from "lucide-react";
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
  dailyPractice: string[]; // dates practiced
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

  if (!topic) {
    return (
      <>
        <button
          onClick={() => setIsSelectOpen(true)}
          className="h-48 w-full rounded-xl border-2 border-dashed border-border hover:border-muted-foreground/50 transition-colors flex flex-col items-center justify-center gap-3 group"
        >
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-muted-foreground/20 transition-colors">
            <Plus className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">Focus Slot {slot}</p>
            <p className="text-xs text-muted-foreground/70">Select a technology</p>
          </div>
        </button>

        <Dialog open={isSelectOpen} onOpenChange={setIsSelectOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Select Focus Topic</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {availableTopics.map((name) => (
                <button
                  key={name}
                  onClick={() => handleSelectTopic(name)}
                  className="w-full text-left px-4 py-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  {name}
                </button>
              ))}
              <div className="pt-2 border-t border-border">
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Or type a custom topic..."
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20"
                  onKeyDown={(e) => e.key === "Enter" && customTopic.trim() && handleSelectTopic(customTopic.trim())}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-lg">{topic.name}</h3>
            <p className="text-sm text-muted-foreground">
              {completedVideos}/{totalVideos} videos
            </p>
          </div>
          {topic.streak > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-trading/10 text-trading text-sm font-medium">
              <Flame className="w-3.5 h-3.5" />
              {topic.streak}
            </div>
          )}
        </div>

        {/* Progress */}
        {totalVideos > 0 && (
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-tech rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedVideos / totalVideos) * 100}%` }}
            />
          </div>
        )}

        {/* Daily Practice */}
        <button
          onClick={() => onLogPractice(topic.id)}
          disabled={hasPracticedToday}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors",
            hasPracticedToday
              ? "bg-finance/10 text-finance cursor-default"
              : "bg-foreground text-background hover:bg-foreground/90"
          )}
        >
          {hasPracticedToday ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Practiced Today
            </>
          ) : (
            "Log Today's Practice"
          )}
        </button>

        {/* Videos */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Video Queue</p>
            <button
              onClick={() => setIsAddVideoOpen(true)}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Add
            </button>
          </div>

          <AnimatePresence>
            {topic.videos.slice(0, 3).map((video) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 group"
              >
                <button
                  onClick={() => onToggleVideo(topic.id, video.id)}
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                    video.completed
                      ? "bg-finance border-finance"
                      : "border-muted-foreground hover:border-foreground"
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
            <p className="text-xs text-muted-foreground text-center pt-1">
              +{topic.videos.length - 3} more videos
            </p>
          )}

          {topic.videos.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-3">
              No videos yet
            </p>
          )}
        </div>
      </div>

      {/* Add Video Modal */}
      <Dialog open={isAddVideoOpen} onOpenChange={setIsAddVideoOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Video title"
              className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20"
              autoFocus
            />
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/..."
              className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20"
              onKeyDown={(e) => e.key === "Enter" && handleAddVideo()}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsAddVideoOpen(false)} className="px-4 py-2 text-sm text-muted-foreground">
                Cancel
              </button>
              <button
                onClick={handleAddVideo}
                disabled={!videoUrl.trim()}
                className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
