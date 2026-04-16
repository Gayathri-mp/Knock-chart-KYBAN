import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap } from 'lucide-react';

interface TournamentSetupProps {
  onStart: (n: number) => void;
  error: string | null;
}

export function TournamentSetup({ onStart, error }: TournamentSetupProps) {
  const [value, setValue] = useState('8');
  const presets = [4, 8, 16, 32];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center"
          >
            <Trophy className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="text-4xl font-heading font-bold tracking-tight">
            Tournament Bracket
          </h1>
          <p className="text-muted-foreground mt-2">
            Create a knockout bracket for your competition
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Quick select
            </label>
            <div className="grid grid-cols-4 gap-2">
              {presets.map((n) => (
                <button
                  key={n}
                  onClick={() => { setValue(String(n)); onStart(n); }}
                  className={`
                    py-2.5 rounded-lg font-heading font-bold text-lg transition-all
                    border border-border hover:border-primary hover:bg-primary/5
                    ${String(n) === value ? 'border-primary bg-primary/10 text-primary' : 'text-foreground'}
                  `}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <div className="h-px flex-1 bg-border" />
            or enter custom
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              min={4}
              max={32}
              className="flex-1 bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground font-heading font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Number of teams"
            />
            <button
              onClick={() => onStart(Number(value))}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-heading font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Zap className="w-4 h-4" />
              Go
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-loser bg-loser/10 rounded-lg px-3 py-2"
            >
              {error}
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
