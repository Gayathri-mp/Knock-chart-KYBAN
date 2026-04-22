import { useTournament } from '@/hooks/useTournament';
import { TournamentSetup } from '@/components/TournamentSetup';
import { BracketView } from '@/components/BracketView';
import { RotateCcw, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const {
    teamCount,
    matches,
    scores,
    availableTeams,
    error,
    started,
    initTournament,
    assignTeam,
    removeTeam,
    playMatch,
    resetTournament,
  } = useTournament();

  if (!started) {
    return <TournamentSetup onStart={initTournament} error={error} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-heading font-bold text-lg leading-none">
              {teamCount}-Team Bracket
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {availableTeams.length} unassigned · Match by match
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/install"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-secondary transition-colors text-muted-foreground"
          >
            Install
          </Link>
          <button
            onClick={resetTournament}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-secondary transition-colors text-muted-foreground"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </header>

      <div className="flex-1 p-4">
        <BracketView
          matches={matches}
          onPlayMatch={playMatch}
          onAssignTeam={assignTeam}
          onRemoveTeam={removeTeam}
          availableTeams={availableTeams}
          teamCount={teamCount}
          scores={scores}
        />
      </div>
    </div>
  );
};

export default Index;
