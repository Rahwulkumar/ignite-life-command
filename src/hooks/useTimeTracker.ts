import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Domain = 'spiritual' | 'tech' | 'trading' | 'finance' | 'music' | 'office' | 'content' | 'projects';

export interface TimeSession {
  id: string;
  domain: Domain;
  activity: string;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number | null;
  notes: string | null;
}

export interface ActiveTimer {
  id: string;
  domain: Domain;
  activity: string;
  startedAt: Date;
}

const DOMAIN_ACTIVITIES: Record<Domain, string[]> = {
  spiritual: ['Bible Reading', 'Prayer', 'Devotional', 'Scripture Memory', 'Sermon Notes', 'Journal'],
  tech: ['DSA Practice', 'System Design', 'AI Study', 'Coding', 'Learning', 'Project Work'],
  trading: ['Market Analysis', 'Trade Journaling', 'Research', 'Chart Study', 'Strategy Review'],
  finance: ['Budget Review', 'Expense Tracking', 'Investment Research', 'Financial Planning'],
  music: ['Piano Practice', 'Theory Study', 'Ear Training', 'Composition', 'Listening'],
  office: ['Deep Work', 'Meetings', 'Admin', 'Planning', 'Writing', 'Email'],
  content: ['Reading', 'Research', 'Curation', 'Note-taking'],
  projects: ['Development', 'Design', 'Planning', 'Review', 'Documentation'],
};

export function useTimeTracker() {
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [todaySessions, setTodaySessions] = useState<TimeSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch active timer on mount
  useEffect(() => {
    const fetchActiveTimer = async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('time_sessions')
        .select('*')
        .is('ended_at', null)
        .order('started_at', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        const session = data[0];
        setActiveTimer({
          id: session.id,
          domain: session.domain as Domain,
          activity: session.activity,
          startedAt: new Date(session.started_at),
        });
      }
      setIsLoading(false);
    };

    fetchActiveTimer();
    fetchTodaySessions();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('time_sessions_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'time_sessions' },
        () => {
          fetchTodaySessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTodaySessions = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('time_sessions')
      .select('*')
      .gte('started_at', today.toISOString())
      .order('started_at', { ascending: false });

    if (!error && data) {
      setTodaySessions(data as TimeSession[]);
    }
  };

  const startTimer = useCallback(async (domain: Domain, activity: string) => {
    // Stop any existing timer first
    if (activeTimer) {
      await stopTimer();
    }

    const { data, error } = await supabase
      .from('time_sessions')
      .insert({
        domain,
        activity,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (!error && data) {
      setActiveTimer({
        id: data.id,
        domain: data.domain as Domain,
        activity: data.activity,
        startedAt: new Date(data.started_at),
      });
      return data;
    }
    return null;
  }, [activeTimer]);

  const stopTimer = useCallback(async () => {
    if (!activeTimer) return null;

    const endedAt = new Date();
    const durationMinutes = Math.round(
      (endedAt.getTime() - activeTimer.startedAt.getTime()) / 60000
    );

    const { data, error } = await supabase
      .from('time_sessions')
      .update({
        ended_at: endedAt.toISOString(),
        duration_minutes: durationMinutes,
      })
      .eq('id', activeTimer.id)
      .select()
      .single();

    if (!error) {
      setActiveTimer(null);
      await fetchTodaySessions();
      return data;
    }
    return null;
  }, [activeTimer]);

  const getTodayStats = useCallback(() => {
    const domainBreakdown: Record<Domain, number> = {
      spiritual: 0,
      tech: 0,
      trading: 0,
      finance: 0,
      music: 0,
      office: 0,
      content: 0,
      projects: 0,
    };

    let totalMinutes = 0;

    todaySessions.forEach((session) => {
      if (session.duration_minutes) {
        domainBreakdown[session.domain as Domain] += session.duration_minutes;
        totalMinutes += session.duration_minutes;
      }
    });

    return { domainBreakdown, totalMinutes };
  }, [todaySessions]);

  const getElapsedTime = useCallback(() => {
    if (!activeTimer) return 0;
    return Math.floor((Date.now() - activeTimer.startedAt.getTime()) / 1000);
  }, [activeTimer]);

  return {
    activeTimer,
    todaySessions,
    isLoading,
    startTimer,
    stopTimer,
    getTodayStats,
    getElapsedTime,
    domainActivities: DOMAIN_ACTIVITIES,
    refetch: fetchTodaySessions,
  };
}
