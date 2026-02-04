import { Music, Clock, Guitar, Flame } from "lucide-react";
import { DomainPageTemplate } from "@/components/shared/DomainPageTemplate";
import { PracticeTracker } from "@/components/music/PracticeTracker";
import { RepertoireCard } from "@/components/music/RepertoireCard";
import { AriaChat } from "@/components/music/AriaChat";

const stats = [
  { icon: Clock, label: "Weekly", value: "3.5", suffix: "hours", color: "text-music" },
  { icon: Guitar, label: "Focus", value: "Guitar", color: "text-muted-foreground" },
  { icon: Flame, label: "Sessions", value: "5", suffix: "this week", color: "text-trading" },
  { icon: Music, label: "Pieces", value: "12", suffix: "learning", color: "text-music" },
];

const MusicPage = () => {
  return (
    <DomainPageTemplate
      domain={{
        icon: Music,
        title: "Music",
        subtitle: "Practice sessions, repertoire, and technique",
        color: "music",
      }}
      stats={stats}
      tabs={[
        { value: "practice", label: "Practice", component: <PracticeTracker /> },
        { value: "repertoire", label: "Repertoire", component: <RepertoireCard /> },
      ]}
      aiCoach={{
        name: "Aria",
        role: "Music Instructor",
        component: <AriaChat />,
      }}
    />
  );
};

export default MusicPage;
