import { Music, Clock, Guitar, Flame } from "lucide-react";
import { DomainPageTemplate } from "@/components/shared/DomainPageTemplate";
import { PracticeTracker, PracticeSession } from "@/components/music/PracticeTracker";
import { RepertoireCard, Song } from "@/components/music/RepertoireCard";
import { AriaChat } from "@/components/music/AriaChat";

// Mock data for Music domain
const mockPracticeSessions: PracticeSession[] = [
  { id: 1, focus: "Chord progressions", instrument: "Guitar", duration: 45, date: "Today", notes: "Working on I-IV-V-I transitions", rating: 4 },
  { id: 2, focus: "Scales practice", instrument: "Guitar", duration: 30, date: "Yesterday", notes: "Pentatonic minor in all positions", rating: 3 },
  { id: 3, focus: "Hotel California", instrument: "Guitar", duration: 60, date: "Dec 27", notes: "Intro solo almost down", rating: 5 },
  { id: 4, focus: "Fingerpicking patterns", instrument: "Guitar", duration: 20, date: "Dec 26", notes: "Travis picking exercises", rating: 3 },
  { id: 5, focus: "Music theory", instrument: "General", duration: 45, date: "Dec 25", notes: "Circle of fifths review", rating: 4 },
];

const mockRepertoire: Song[] = [
  { id: 1, title: "Wonderwall", artist: "Oasis", difficulty: "Beginner", status: "mastered", progress: 100 },
  { id: 2, title: "Hotel California", artist: "Eagles", difficulty: "Intermediate", status: "learning", progress: 75 },
  { id: 3, title: "Stairway to Heaven", artist: "Led Zeppelin", difficulty: "Intermediate", status: "learning", progress: 40 },
  { id: 4, title: "Blackbird", artist: "The Beatles", difficulty: "Intermediate", status: "queued", progress: 0 },
  { id: 5, title: "Classical Gas", artist: "Mason Williams", difficulty: "Advanced", status: "queued", progress: 0 },
];

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
        notesDomain: "music",
      }}
      stats={stats}
      tabs={[
        { value: "practice", label: "Practice", component: <PracticeTracker sessions={mockPracticeSessions} /> },
        { value: "repertoire", label: "Repertoire", component: <RepertoireCard repertoire={mockRepertoire} /> },
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
