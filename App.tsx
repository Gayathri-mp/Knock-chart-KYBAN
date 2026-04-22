import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StatusBar as RNStatusBar,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RotateCcw, ChevronLeft } from 'lucide-react-native';
import { useTournament } from './src/hooks/useTournament';
import { TournamentSetup } from './src/components/TournamentSetup';
import { BracketView } from './src/components/BracketView';
import { TeamSelectionModal } from './src/components/TeamSelectionModal';
import { VictoryModal } from './src/components/VictoryModal';
import { Team, Match } from './src/lib/tournament';

export default function App() {
  const {
    teamCount,
    matches,
    availableTeams,
    error,
    started,
    initTournament,
    assignTeam,
    removeTeam,
    selectWinner,
    resetTournament,
    exitTournament,
  } = useTournament();

  const [selection, setSelection] = useState<{ matchId: string; slot: 'teamA' | 'teamB' } | null>(null);
  const [winnerSelectionMatch, setWinnerSelectionMatch] = useState<Match | null>(null);

  // Derive podium teams
  const finalMatch      = matches['final'];
  const thirdPlaceMatch = matches['third-place'];
  const isComplete = !!(finalMatch?.winner && thirdPlaceMatch?.winner);

  const firstPlace  = finalMatch?.winner ?? null;
  const secondPlace = useMemo(() => {
    if (!finalMatch?.winner) return null;
    return finalMatch.teamA?.id === finalMatch.winner.id ? finalMatch.teamB : finalMatch.teamA;
  }, [finalMatch]);
  const thirdPlace = thirdPlaceMatch?.winner ?? null;

  if (!started) {
    return (
      <>
        <TournamentSetup onStart={initTournament} error={error} />
        <StatusBar style="light" />
      </>
    );
  }

  const currentMatch = selection ? matches[selection.matchId] : null;
  const currentTeam  = selection ? currentMatch?.[selection.slot] : null;

  const competingTeams = winnerSelectionMatch
    ? [winnerSelectionMatch.teamA, winnerSelectionMatch.teamB].filter((t): t is Team => !!t)
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <RNStatusBar barStyle="light-content" backgroundColor="#0A0D10" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={exitTournament} style={styles.backButton}>
            <ChevronLeft size={22} color="#C8D6E5" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>{teamCount} Teams Knockout</Text>
            <Text style={styles.headerSubtitle}>
              {availableTeams.length > 0
                ? `${availableTeams.length} teams remaining`
                : '⚡ All teams assigned'}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={resetTournament} style={styles.resetButton}>
          <RotateCcw size={16} color="#C8D6E5" />
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Bracket */}
      <View style={styles.content}>
        <BracketView
          matches={matches}
          onOpenSelection={(matchId, slot) => setSelection({ matchId, slot })}
          onOpenWinnerSelection={(match) => setWinnerSelectionMatch(match)}
        />
      </View>

      {/* Team assignment modal (first round) */}
      <TeamSelectionModal
        visible={!!selection}
        onClose={() => setSelection(null)}
        teams={availableTeams}
        currentTeam={currentTeam}
        title="Assign Team"
        onSelect={(team) => {
          if (selection) {
            assignTeam(selection.matchId, selection.slot, team);
            setSelection(null);
          }
        }}
        onRemove={() => {
          if (selection) {
            removeTeam(selection.matchId, selection.slot);
            setSelection(null);
          }
        }}
      />

      {/* Winner selection modal */}
      <TeamSelectionModal
        visible={!!winnerSelectionMatch}
        onClose={() => setWinnerSelectionMatch(null)}
        teams={competingTeams}
        title="Select Winner"
        currentTeam={winnerSelectionMatch?.winner}
        onSelect={(team) => {
          if (winnerSelectionMatch) {
            selectWinner(winnerSelectionMatch.matchId, team);
            setWinnerSelectionMatch(null);
          }
        }}
      />

      {/* Victory podium modal */}
      <VictoryModal
        visible={isComplete}
        first={firstPlace}
        second={secondPlace}
        third={thirdPlace}
        onReset={exitTournament}
      />

      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D10',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#0F1520',
    borderBottomWidth: 1,
    borderBottomColor: '#1E2738',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: { elevation: 6 },
      web: { boxShadow: '0 2px 12px rgba(0,0,0,0.4)' },
    }),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#3A5A7C',
    fontWeight: '500',
    marginTop: 2,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2738',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#2A3A50',
  },
  resetText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C8D6E5',
  },
  content: {
    flex: 1,
    backgroundColor: '#0A0D10',
  },
});
