import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PracticeSession } from "@/components/music/PracticeTracker";
import type { Song } from "@/components/music/RepertoireCard";

interface MusicSessionApi {
  id: string;
  focus: string;
  instrument: string;
  duration: number;
  dateLabel: string;
  notes: string;
  rating: number;
}

interface MusicSongApi {
  id: string;
  title: string;
  artist: string;
  difficulty: Song["difficulty"];
  status: Song["status"];
  progress: number;
}

interface MusicResponse {
  sessions: MusicSessionApi[];
  repertoire: MusicSongApi[];
}

export interface MusicOverview {
  sessions: PracticeSession[];
  repertoire: Song[];
}

function normalizeMusicOverview(data: MusicResponse): MusicOverview {
  return {
    sessions: data.sessions.map((session) => ({
      id: session.id,
      focus: session.focus,
      instrument: session.instrument,
      duration: session.duration,
      date: session.dateLabel,
      notes: session.notes,
      rating: session.rating,
    })),
    repertoire: data.repertoire.map((song) => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      difficulty: song.difficulty,
      status: song.status,
      progress: song.progress,
    })),
  };
}

export function useMusicOverview() {
  return useQuery({
    queryKey: ["music"],
    queryFn: async () => {
      const response = await api.get<MusicResponse>("/api/music");
      return normalizeMusicOverview(response);
    },
  });
}

export function useCreatePracticeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      focus,
      instrument,
      duration,
      dateLabel,
      notes,
      rating,
    }: {
      focus: string;
      instrument: string;
      duration: number;
      dateLabel?: string;
      notes?: string;
      rating?: number;
    }) =>
      api.post<MusicSessionApi>("/api/music/practice-sessions", {
        focus,
        instrument,
        duration,
        dateLabel,
        notes,
        rating,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["music"] });
    },
  });
}

export function useCreateRepertoireItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      title,
      artist,
      difficulty,
      status,
      progress,
    }: {
      title: string;
      artist: string;
      difficulty: Song["difficulty"];
      status: Song["status"];
      progress?: number;
    }) =>
      api.post<MusicSongApi>("/api/music/repertoire", {
        title,
        artist,
        difficulty,
        status,
        progress,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["music"] });
    },
  });
}
