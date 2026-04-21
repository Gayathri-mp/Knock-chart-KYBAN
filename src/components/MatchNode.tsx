import { Match, Team, TeamScores } from '@/lib/tournament';
import { motion } from 'framer-motion';
import { Trophy, User, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

interface MatchNodeProps {
  match: Match;
  onSelectWinner: (matchId: string, winner: Team) => void;
  onAssignTeam?: (matchId: string, slot: 'teamA' | 'teamB', team: Team) => void;
  onRemoveTeam?: (matchId: string, slot: 'teamA' | 'teamB') => void;
  availableTeams?: Team[];
  isFirstRound?: boolean;
  compact?: boolean;
  scores?: TeamScores;
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
  onClose,
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
  onClose?: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!showDropdown || !buttonRef.current) return;
    const update = () => {
      const rect = buttonRef.current!.getBoundingClientRect();
      const dropdownWidth = 240;
      const viewportW = window.innerWidth;
      let left = rect.left;
      if (left + dropdownWidth > viewportW - 8) left = viewportW - dropdownWidth - 8;
      if (left < 8) left = 8;
      setCoords({ top: rect.bottom + 4, left });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [showDropdown]);

  useEffect(() => {
    if (!showDropdown) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target)) return;
      const dd = document.getElementById('teamslot-dropdown-portal');
      if (dd?.contains(target)) return;
      onClose?.();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showDropdown, onClose]);

  return (
    <>
      <motion.button
        ref={buttonRef}
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

      {showDropdown && availableTeams && coords && createPortal(
        <motion.div
          id="teamslot-dropdown-portal"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed z-[9999] bg-popover border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col"
          style={{ top: coords.top, left: coords.left, width: 240, minHeight: 220, maxHeight: '50vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          {team && onRemove && (
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="w-full px-3 py-2.5 text-left text-sm font-medium text-loser hover:bg-loser/10 border-b border-border flex-shrink-0"
            >
              ✕ Remove {team.name}
            </button>
          )}
          <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-heading font-bold border-b border-border/50 flex-shrink-0">
            {team ? 'Replace with' : 'Available Teams'} ({availableTeams.length})
          </div>
          <div className="overflow-y-auto flex-1">
            {availableTeams.length === 0 && !team ? (
              <div className="px-3 py-4 text-sm text-muted-foreground text-center">No teams available</div>
            ) : (
              availableTeams.map((t) => (
                <button
                  key={t.id}
                  onClick={(e) => { e.stopPropagation(); onSelectTeam?.(t); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-secondary transition-colors border-b border-border/30 last:border-b-0"
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                    style={{ backgroundColor: t.color + '33', color: t.color }}
                  >
                    {t.logo}
                  </span>
                  <span className="truncate text-left">{t.name}</span>
                </button>
              ))
            )}
          </div>
        </motion.div>,
        document.body
      )}
    </>
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

    if (isFirstRound) {
      setDropdownSlot(dropdownSlot === slot ? null : slot);
      return;
    }

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
      <div className="divide-y divide-match-border">
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
          onClose={() => setDropdownSlot(null)}
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
          onClose={() => setDropdownSlot(null)}
        />
      </div>
    </motion.div>
  );
}
