import { Match, Team } from '@/lib/tournament';
import { motion } from 'framer-motion';
import { Trophy, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface MatchNodeProps {
  match: Match;
  onSelectWinner: (matchId: string, winner: Team) => void;
  onAssignTeam?: (matchId: string, slot: 'teamA' | 'teamB', team: Team) => void;
  onRemoveTeam?: (matchId: string, slot: 'teamA' | 'teamB') => void;
  availableTeams?: Team[];
  isFirstRound?: boolean;
  compact?: boolean;
}

function TeamSlot({
  team,
  isWinner,
  isLoser,
  onClick,
  showDropdown,
  availableTeams,
  onSelectTeam,
  onRemove,
  isFirstRound,
}: {
  team: Team | null;
  isWinner: boolean;
  isLoser: boolean;
  onClick: () => void;
  showDropdown: boolean;
  availableTeams?: Team[];
  onSelectTeam?: (team: Team) => void;
  onRemove?: () => void;
  isFirstRound?: boolean;
}) {
  return (
    <div className="relative">
      <motion.button
        onClick={onClick}
        className={`
          w-full flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all rounded
          ${isWinner ? 'bg-winner/15 text-winner border-l-2 border-winner' : ''}
          ${isLoser ? 'bg-loser/10 text-loser/60 border-l-2 border-loser/30' : ''}
          ${!isWinner && !isLoser ? 'hover:bg-match-hover text-foreground' : ''}
          ${!team ? 'text-muted-foreground italic' : ''}
        `}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {team ? (
          <>
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
              style={{ backgroundColor: team.color + '33', color: team.color }}
            >
              {team.logo}
            </span>
            <span className="truncate flex-1 text-left">{team.name}</span>
            {isWinner && <Trophy className="w-3.5 h-3.5 text-winner flex-shrink-0" />}
          </>
        ) : (
          <>
            <User className="w-4 h-4 flex-shrink-0 opacity-40" />
            <span className="flex-1 text-left text-xs">
              {isFirstRound ? 'Select team' : 'TBD'}
            </span>
            {isFirstRound && <ChevronDown className="w-3 h-3 opacity-40" />}
          </>
        )}
      </motion.button>

      {showDropdown && availableTeams && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-50 top-full left-0 mt-1 w-52 max-h-48 overflow-y-auto bg-popover border border-border rounded-lg shadow-xl"
        >
          {team && onRemove && (
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="w-full px-3 py-2 text-left text-sm text-loser hover:bg-loser/10 border-b border-border"
            >
              Remove {team.name}
            </button>
          )}
          {availableTeams.length === 0 && !team ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">No teams available</div>
          ) : (
            availableTeams.map((t) => (
              <button
                key={t.id}
                onClick={(e) => { e.stopPropagation(); onSelectTeam?.(t); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                  style={{ backgroundColor: t.color + '33', color: t.color }}
                >
                  {t.logo}
                </span>
                {t.name}
              </button>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}

export function MatchNode({
  match,
  onSelectWinner,
  onAssignTeam,
  onRemoveTeam,
  availableTeams,
  isFirstRound,
  compact,
}: MatchNodeProps) {
  const [dropdownSlot, setDropdownSlot] = useState<'teamA' | 'teamB' | null>(null);

  const handleTeamClick = (slot: 'teamA' | 'teamB') => {
    const team = slot === 'teamA' ? match.teamA : match.teamB;

    if (isFirstRound && (!team || dropdownSlot === slot)) {
      setDropdownSlot(dropdownSlot === slot ? null : slot);
      return;
    }

    // If both teams exist and no winner yet, clicking selects winner
    if (match.teamA && match.teamB && team) {
      onSelectWinner(match.matchId, team);
    }
  };

  return (
    <motion.div
      className={`
        bg-match border border-match-border rounded-lg overflow-hidden
        ${compact ? 'w-36' : 'w-44'}
        ${match.isThirdPlace ? 'border-highlight/30' : ''}
      `}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onClick={() => setDropdownSlot(null)}
    >
      {match.isThirdPlace && (
        <div className="px-2 py-0.5 text-[10px] font-heading font-bold text-highlight bg-highlight/10 text-center uppercase tracking-wider">
          3rd Place
        </div>
      )}
      {match.matchId === 'final' && (
        <div className="px-2 py-0.5 text-[10px] font-heading font-bold text-accent bg-accent/10 text-center uppercase tracking-wider">
          🏆 Final
        </div>
      )}
      <div className="divide-y divide-match-border" onClick={(e) => e.stopPropagation()}>
        <TeamSlot
          team={match.teamA}
          isWinner={!!match.winner && match.winner.id === match.teamA?.id}
          isLoser={!!match.winner && match.teamA !== null && match.winner.id !== match.teamA?.id}
          onClick={() => handleTeamClick('teamA')}
          showDropdown={dropdownSlot === 'teamA'}
          availableTeams={availableTeams}
          onSelectTeam={(t) => { onAssignTeam?.(match.matchId, 'teamA', t); setDropdownSlot(null); }}
          onRemove={() => { onRemoveTeam?.(match.matchId, 'teamA'); setDropdownSlot(null); }}
          isFirstRound={isFirstRound}
        />
        <TeamSlot
          team={match.teamB}
          isWinner={!!match.winner && match.winner.id === match.teamB?.id}
          isLoser={!!match.winner && match.teamB !== null && match.winner.id !== match.teamB?.id}
          onClick={() => handleTeamClick('teamB')}
          showDropdown={dropdownSlot === 'teamB'}
          availableTeams={availableTeams}
          onSelectTeam={(t) => { onAssignTeam?.(match.matchId, 'teamB', t); setDropdownSlot(null); }}
          onRemove={() => { onRemoveTeam?.(match.matchId, 'teamB'); setDropdownSlot(null); }}
          isFirstRound={isFirstRound}
        />
      </div>
    </motion.div>
  );
}
