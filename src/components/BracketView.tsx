import { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { MatchMap, Team, TeamScores, getMatchesByRound } from '@/lib/tournament';
import { MatchNode } from './MatchNode';
import { motion } from 'framer-motion';

interface BracketViewProps {
  matches: MatchMap;
  onSelectWinner: (matchId: string, winner: Team) => void;
  onAssignTeam: (matchId: string, slot: 'teamA' | 'teamB', team: Team) => void;
  onRemoveTeam: (matchId: string, slot: 'teamA' | 'teamB') => void;
  availableTeams: Team[];
  teamCount: number;
  scores?: TeamScores;
}

const NODE_W = 176;
const NODE_H = 72;
const H_GAP = 48;
const V_GAP_BASE = 16;

interface NodePos {
  matchId: string;
  x: number;
  y: number;
}

export function BracketView({
  matches,
  onSelectWinner,
  onAssignTeam,
  onRemoveTeam,
  availableTeams,
  teamCount,
}: BracketViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<NodePos[]>([]);

  const leftRounds = useMemo(() => getMatchesByRound(matches, 'left'), [matches]);
  const rightRounds = useMemo(() => getMatchesByRound(matches, 'right'), [matches]);
  const finalMatch = matches['final'];
  const thirdPlaceMatch = matches['third-place'];

  const totalRounds = leftRounds.length + 1 + rightRounds.length; // left + final + right
  const firstRoundMatches = leftRounds[0]?.length || 1;

  const calcPositions = useCallback(() => {
    const nodePositions: NodePos[] = [];
    const totalHeight = firstRoundMatches * (NODE_H + V_GAP_BASE) * 2;

    // Left side (left to right, round 0 is leftmost)
    leftRounds.forEach((round, ri) => {
      const matchesInRound = round.length;
      const spacing = totalHeight / matchesInRound;
      round.forEach((m, mi) => {
        nodePositions.push({
          matchId: m.matchId,
          x: ri * (NODE_W + H_GAP),
          y: mi * spacing + spacing / 2 - NODE_H / 2,
        });
      });
    });

    // Center x for final
    const centerX = leftRounds.length * (NODE_W + H_GAP);
    const centerY = totalHeight / 2 - NODE_H / 2;

    if (finalMatch) {
      nodePositions.push({
        matchId: 'final',
        x: centerX,
        y: centerY - 40,
      });
    }

    if (thirdPlaceMatch) {
      nodePositions.push({
        matchId: 'third-place',
        x: centerX,
        y: centerY + 60,
      });
    }

    // Right side (right to left, round 0 is rightmost)
    rightRounds.forEach((round, ri) => {
      const matchesInRound = round.length;
      const spacing = totalHeight / matchesInRound;
      round.forEach((m, mi) => {
        nodePositions.push({
          matchId: m.matchId,
          x: (leftRounds.length + 1 + (rightRounds.length - 1 - ri)) * (NODE_W + H_GAP),
          y: mi * spacing + spacing / 2 - NODE_H / 2,
        });
      });
    });

    setPositions(nodePositions);
  }, [leftRounds, rightRounds, finalMatch, thirdPlaceMatch, firstRoundMatches]);

  useEffect(() => {
    calcPositions();
  }, [calcPositions]);

  const posMap = useMemo(() => {
    const map: Record<string, NodePos> = {};
    positions.forEach((p) => (map[p.matchId] = p));
    return map;
  }, [positions]);

  // Generate connector lines
  const lines = useMemo(() => {
    const result: { x1: number; y1: number; x2: number; y2: number; matchId: string; isWinner: boolean; isLoser: boolean }[] = [];

    Object.values(matches).forEach((m) => {
      if (!m.nextMatchId || !posMap[m.matchId] || !posMap[m.nextMatchId]) return;
      if (m.isThirdPlace) return;

      const from = posMap[m.matchId];
      const to = posMap[m.nextMatchId];

      const fromSide = m.side;
      const x1 = fromSide === 'left' ? from.x + NODE_W : from.x;
      const y1 = from.y + NODE_H / 2;
      const x2 = fromSide === 'left' ? to.x : to.x + NODE_W;
      const y2 = to.y + NODE_H / 2;

      result.push({
        x1, y1, x2, y2,
        matchId: m.matchId,
        isWinner: !!m.winner,
        isLoser: false,
      });
    });

    return result;
  }, [matches, posMap]);

  const totalWidth = totalRounds * (NODE_W + H_GAP) + 40;
  const totalHeight = firstRoundMatches * (NODE_H + V_GAP_BASE) * 2 + 40;

  return (
    <div
      ref={containerRef}
      className="w-full overflow-auto bg-background"
      style={{ maxHeight: '85vh' }}
    >
      <div className="relative" style={{ width: totalWidth, height: totalHeight, minWidth: totalWidth }}>
        {/* SVG Connector Lines */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={totalWidth}
          height={totalHeight}
        >
          {lines.map((line, i) => {
            const midX = (line.x1 + line.x2) / 2;
            return (
              <motion.path
                key={i}
                d={`M${line.x1},${line.y1} C${midX},${line.y1} ${midX},${line.y2} ${line.x2},${line.y2}`}
                fill="none"
                className={
                  line.isWinner ? 'line-winner' : 'line-neutral'
                }
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
              />
            );
          })}
        </svg>

        {/* Match Nodes */}
        {positions.map((pos) => {
          const match = matches[pos.matchId];
          if (!match) return null;
          const isFirstRound = match.round === 0 && !match.isThirdPlace && match.matchId !== 'final';

          return (
            <div
              key={pos.matchId}
              className="absolute"
              style={{ left: pos.x, top: pos.y }}
            >
              <MatchNode
                match={match}
                onSelectWinner={onSelectWinner}
                onAssignTeam={isFirstRound ? onAssignTeam : undefined}
                onRemoveTeam={isFirstRound ? onRemoveTeam : undefined}
                availableTeams={isFirstRound ? availableTeams : undefined}
                isFirstRound={isFirstRound}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
