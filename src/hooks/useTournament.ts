import { useState, useCallback, useMemo } from 'react';
import {
  Team,
  MatchMap,
  generateTeams,
  generateBracket,
  setWinnerAndCascade,
  isPowerOfTwo,
} from '@/lib/tournament';

export function useTournament() {
  const [teamCount, setTeamCount] = useState<number>(8);
  const [teams, setTeams] = useState<Team[]>(() => generateTeams(8));
  const [matches, setMatches] = useState<MatchMap>(() => generateBracket(8));
  const [assignedTeamIds, setAssignedTeamIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  const availableTeams = useMemo(
    () => teams.filter((t) => !assignedTeamIds.has(t.id)),
    [teams, assignedTeamIds]
  );

  const initTournament = useCallback((n: number) => {
    if (!isPowerOfTwo(n)) {
      setError(`${n} is not a power of 2. Please enter 4, 8, 16, or 32.`);
      return;
    }
    if (n < 4) {
      setError('Minimum 4 teams required.');
      return;
    }
    if (n > 32) {
      setError('Maximum 32 teams supported.');
      return;
    }
    setError(null);
    setTeamCount(n);
    setTeams(generateTeams(n));
    setMatches(generateBracket(n));
    setAssignedTeamIds(new Set());
    setStarted(true);
  }, []);

  const assignTeam = useCallback(
    (matchId: string, slot: 'teamA' | 'teamB', team: Team) => {
      setMatches((prev) => {
        const updated = { ...prev };
        const match = { ...updated[matchId] };
        const oldTeam = match[slot];
        match[slot] = team;
        updated[matchId] = match;
        return updated;
      });
      setAssignedTeamIds((prev) => {
        const next = new Set(prev);
        next.add(team.id);
        return next;
      });
    },
    []
  );

  const removeTeam = useCallback(
    (matchId: string, slot: 'teamA' | 'teamB') => {
      setMatches((prev) => {
        const updated = { ...prev };
        const match = { ...updated[matchId] };
        const team = match[slot];
        if (team) {
          match[slot] = null;
          if (match.winner?.id === team.id) {
            match.winner = null;
          }
          updated[matchId] = match;
        }
        return updated;
      });
      setAssignedTeamIds((prev) => {
        const next = new Set(prev);
        const match = matches[matchId];
        const team = match[slot];
        if (team) next.delete(team.id);
        return next;
      });
    },
    [matches]
  );

  const selectWinner = useCallback(
    (matchId: string, winner: Team) => {
      setMatches((prev) => setWinnerAndCascade(prev, matchId, winner));
    },
    []
  );

  const resetTournament = useCallback(() => {
    setMatches(generateBracket(teamCount));
    setAssignedTeamIds(new Set());
  }, [teamCount]);

  return {
    teamCount,
    teams,
    matches,
    availableTeams,
    assignedTeamIds,
    error,
    started,
    initTournament,
    assignTeam,
    removeTeam,
    selectWinner,
    resetTournament,
  };
}
