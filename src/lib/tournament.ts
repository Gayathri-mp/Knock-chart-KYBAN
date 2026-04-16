export interface Team {
  id: string;
  name: string;
  logo: string;
  color: string;
}

export interface Match {
  matchId: string;
  round: number;
  position: number;
  teamA: Team | null;
  teamB: Team | null;
  winner: Team | null;
  nextMatchId: string | null;
  side: 'left' | 'right';
  isThirdPlace?: boolean;
}

export type MatchMap = Record<string, Match>;

const TEAM_COLORS = [
  '#E63946', '#457B9D', '#2A9D8F', '#E9C46A',
  '#F4A261', '#264653', '#6A4C93', '#1982C4',
  '#FF595E', '#8AC926', '#FFCA3A', '#6A0572',
  '#AB83A1', '#3A86FF', '#FB5607', '#FF006E',
  '#8338EC', '#3A0CA3', '#4361EE', '#4CC9F0',
  '#06D6A0', '#118AB2', '#073B4C', '#EF476F',
  '#FFD166', '#F77F00', '#FCBF49', '#D62828',
  '#023E8A', '#0077B6', '#00B4D8', '#90E0EF',
];

export function generateTeams(n: number): Team[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `team-${i + 1}`,
    name: `Team ${i + 1}`,
    logo: `⚽`,
    color: TEAM_COLORS[i % TEAM_COLORS.length],
  }));
}

export function isPowerOfTwo(n: number): boolean {
  return n > 1 && (n & (n - 1)) === 0;
}

export function generateBracket(n: number): MatchMap {
  const totalRounds = Math.log2(n);
  const matches: MatchMap = {};

  // Generate left half
  generateHalf(matches, 'left', n / 2, totalRounds);
  // Generate right half
  generateHalf(matches, 'right', n / 2, totalRounds);

  // Final match
  const finalId = 'final';
  matches[finalId] = {
    matchId: finalId,
    round: totalRounds,
    position: 0,
    teamA: null,
    teamB: null,
    winner: null,
    nextMatchId: null,
    side: 'left',
  };

  // Connect semi-finals to final
  const leftSemis = Object.values(matches).filter(
    (m) => m.side === 'left' && m.round === totalRounds - 1
  );
  const rightSemis = Object.values(matches).filter(
    (m) => m.side === 'right' && m.round === totalRounds - 1
  );

  if (leftSemis.length > 0) {
    leftSemis[0].nextMatchId = finalId;
  }
  if (rightSemis.length > 0) {
    rightSemis[0].nextMatchId = finalId;
  }

  // 3rd place match
  const thirdPlaceId = 'third-place';
  matches[thirdPlaceId] = {
    matchId: thirdPlaceId,
    round: totalRounds,
    position: 1,
    teamA: null,
    teamB: null,
    winner: null,
    nextMatchId: null,
    side: 'left',
    isThirdPlace: true,
  };

  return matches;
}

function generateHalf(
  matches: MatchMap,
  side: 'left' | 'right',
  halfTeams: number,
  totalRounds: number
) {
  const halfRounds = totalRounds - 1;
  const firstRoundMatches = halfTeams / 2;

  // Generate matches round by round
  for (let round = 0; round <= halfRounds; round++) {
    const matchesInRound = firstRoundMatches / Math.pow(2, round);
    for (let pos = 0; pos < matchesInRound; pos++) {
      const matchId = `${side}-r${round}-m${pos}`;
      const nextRound = round + 1;
      const nextPos = Math.floor(pos / 2);
      let nextMatchId: string | null = null;

      if (nextRound <= halfRounds) {
        nextMatchId = `${side}-r${nextRound}-m${nextPos}`;
      }
      // If this is the last round of the half, nextMatchId will be set later (to final)

      matches[matchId] = {
        matchId,
        round,
        position: pos,
        teamA: null,
        teamB: null,
        winner: null,
        nextMatchId,
        side,
      };
    }
  }
}

export function getFirstRoundMatches(matches: MatchMap, side: 'left' | 'right'): Match[] {
  return Object.values(matches).filter(
    (m) => m.round === 0 && m.side === side && !m.isThirdPlace && m.matchId !== 'final'
  );
}

export function getMatchesByRound(matches: MatchMap, side: 'left' | 'right'): Match[][] {
  const sideMatches = Object.values(matches).filter(
    (m) => m.side === side && !m.isThirdPlace && m.matchId !== 'final'
  );
  const maxRound = Math.max(...sideMatches.map((m) => m.round), 0);
  const rounds: Match[][] = [];
  for (let r = 0; r <= maxRound; r++) {
    rounds.push(
      sideMatches
        .filter((m) => m.round === r)
        .sort((a, b) => a.position - b.position)
    );
  }
  return rounds;
}

export function propagateWinner(
  matches: MatchMap,
  matchId: string,
  winner: Team
): MatchMap {
  const updated = { ...matches };
  const match = { ...updated[matchId], winner };
  updated[matchId] = match;

  if (match.nextMatchId && updated[match.nextMatchId]) {
    const next = { ...updated[match.nextMatchId] };
    // Determine if this match feeds into teamA or teamB
    const isTopSlot = match.position % 2 === 0;
    if (isTopSlot) {
      next.teamA = winner;
    } else {
      next.teamB = winner;
    }
    // If winner changed, reset next match winner and downstream
    if (next.winner && next.winner.id !== winner.id) {
      // Only reset if the changed team was the previous winner
      if (
        (isTopSlot && next.winner.id === match.winner?.id) ||
        (!isTopSlot && next.winner.id === match.winner?.id)
      ) {
        next.winner = null;
        updated[next.matchId] = next;
        if (next.nextMatchId) {
          resetDownstream(updated, next.matchId);
        }
        return updated;
      }
    }
    updated[next.matchId] = next;
  }

  // Handle 3rd place match - feed losers of semi-finals
  updateThirdPlaceMatch(updated);

  return updated;
}

function updateThirdPlaceMatch(matches: MatchMap) {
  const thirdPlace = matches['third-place'];
  if (!thirdPlace) return;

  const finalMatch = matches['final'];
  if (!finalMatch) return;

  // Find semi-final matches (matches that feed into final)
  const semiFinals = Object.values(matches).filter(
    (m) => m.nextMatchId === 'final'
  );

  const updated = { ...thirdPlace };
  semiFinals.forEach((sf, i) => {
    if (sf.winner && sf.teamA && sf.teamB) {
      const loser = sf.winner.id === sf.teamA.id ? sf.teamB : sf.teamA;
      if (i === 0) updated.teamA = loser;
      else updated.teamB = loser;
    }
  });

  matches['third-place'] = updated;
}

export function resetDownstream(matches: MatchMap, matchId: string) {
  const match = matches[matchId];
  if (!match) return;

  if (match.winner) {
    matches[matchId] = { ...match, winner: null };
  }

  if (match.nextMatchId && matches[match.nextMatchId]) {
    const next = { ...matches[match.nextMatchId] };
    const isTopSlot = match.position % 2 === 0;
    if (isTopSlot) {
      next.teamA = null;
    } else {
      next.teamB = null;
    }
    next.winner = null;
    matches[next.matchId] = next;
    resetDownstream(matches, next.matchId);
  }
}

export function setWinnerAndCascade(
  matches: MatchMap,
  matchId: string,
  winner: Team
): MatchMap {
  const updated = JSON.parse(JSON.stringify(matches)) as MatchMap;
  const match = updated[matchId];
  
  const oldWinner = match.winner;
  match.winner = winner;

  // If winner changed and there's a next match, we need to update
  if (match.nextMatchId && updated[match.nextMatchId]) {
    const next = updated[match.nextMatchId];
    const isTopSlot = match.position % 2 === 0;

    if (isTopSlot) {
      // If old winner was propagated, reset downstream first
      if (oldWinner && next.teamA?.id === oldWinner.id) {
        next.teamA = winner;
        if (next.winner?.id === oldWinner.id) {
          next.winner = null;
          resetDownstream(updated, next.matchId);
        }
      } else {
        next.teamA = winner;
      }
    } else {
      if (oldWinner && next.teamB?.id === oldWinner.id) {
        next.teamB = winner;
        if (next.winner?.id === oldWinner.id) {
          next.winner = null;
          resetDownstream(updated, next.matchId);
        }
      } else {
        next.teamB = winner;
      }
    }
  }

  updateThirdPlaceMatch(updated);
  return updated;
}
