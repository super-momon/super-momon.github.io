import { supabase } from './supabase';
import type { GameMode } from '@/types/quiz';
import type { LeaderboardEntry, SubmitScorePayload } from '@/types/leaderboard';

export async function submitScore(payload: SubmitScorePayload): Promise<LeaderboardEntry> {
  const { data, error } = await supabase
    .from('leaderboard')
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as LeaderboardEntry;
}

export async function fetchLeaderboard(mode: GameMode): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('id, nickname, score, mode, correct_count, total_answered, avg_time_per_question, created_at')
    .eq('mode', mode)
    .order('score', { ascending: false })
    .limit(15);

  if (error) throw new Error(error.message);
  return (data ?? []) as LeaderboardEntry[];
}
