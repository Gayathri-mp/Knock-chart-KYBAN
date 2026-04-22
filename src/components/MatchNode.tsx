import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Trophy, User, ChevronRight, Swords } from 'lucide-react-native';
import { Team, Match, TeamScores } from '../lib/tournament';

interface TeamSlotProps {
  team: Team | null;
  isWinner: boolean;
  isLoser: boolean;
  onAssign?: () => void;
  isFirstRound?: boolean;
}

const TeamSlot = ({
  team,
  isWinner,
  isLoser,
  onAssign,
  isFirstRound,
}: TeamSlotProps) => {
  return (
    <View
      style={[
        styles.teamSlot,
        isWinner && styles.winnerSlot,
        isLoser && styles.loserSlot,
      ]}
    >
      {team ? (
        <View style={styles.teamContent}>
          <View style={[styles.logoContainer, { backgroundColor: team.color + '22' }]}>
            <Text style={[styles.logoText, { color: team.color }]}>{team.logo}</Text>
          </View>
          <Text
            style={[
              styles.teamName,
              isWinner && styles.winnerText,
              isLoser && styles.loserText,
            ]}
            numberOfLines={1}
          >
            {team.name}
          </Text>
          {isWinner && <Trophy size={14} color="#40C057" />}
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.teamContent} 
          onPress={onAssign}
          disabled={!isFirstRound}
        >
          {isFirstRound ? (
            <>
              <User size={14} color="#fbfbfbff" />
              <Text style={styles.placeholderText}>Select team</Text>
            </>
          ) : (
            <Text style={styles.emptySlot}>TBD</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

interface MatchNodeProps {
  match: Match;
  onOpenWinnerSelection: (match: Match) => void;
  onOpenTeamSelection: (matchId: string, slot: 'teamA' | 'teamB') => void;
  isFirstRound?: boolean;
}

export const MatchNode = ({
  match,
  onOpenWinnerSelection,
  onOpenTeamSelection,
  isFirstRound,
}: MatchNodeProps) => {
  const hasTeams = match.teamA && match.teamB;
  const hasWinner = !!match.winner;

  return (
    <View style={styles.container}>
      {/* Team Slots */}
      <View style={[styles.slotsCard, hasWinner && styles.cardWithWinner]}>
        <TeamSlot
          team={match.teamA}
          isWinner={hasWinner && match.winner?.id === match.teamA?.id}
          isLoser={hasWinner && match.teamA !== null && match.winner?.id !== match.teamA?.id}
          onAssign={() => onOpenTeamSelection(match.matchId, 'teamA')}
          isFirstRound={isFirstRound}
        />
        <View style={styles.divider} />
        <TeamSlot
          team={match.teamB}
          isWinner={hasWinner && match.winner?.id === match.teamB?.id}
          isLoser={hasWinner && match.teamB !== null && match.winner?.id !== match.teamB?.id}
          onAssign={() => onOpenTeamSelection(match.matchId, 'teamB')}
          isFirstRound={isFirstRound}
        />
      </View>

      {/* Match Selection Button (The "Connection Point") */}
      <TouchableOpacity
        style={[
          styles.matchButton,
          hasWinner && styles.matchButtonActive,
          !hasTeams && styles.matchButtonDisabled
        ]}
        onPress={() => hasTeams && onOpenWinnerSelection(match)}
        disabled={!hasTeams}
      >
        <Swords size={16} color={hasWinner ? '#FFF' : (hasTeams ? '#339AF0' : '#ADB5BD')} />
      </TouchableOpacity>

      {/* Round/Type Label */}
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>
          {match.isThirdPlace ? '3rd Place Match' : (match.matchId === 'final' ? '🏆 Grand Final' : `Match ${match.matchId.split('-').pop()}`)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 180,
    alignItems: 'center',
    marginVertical: 10,
  },
  slotsCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#E9ECEF',
    // Removed overflow: 'hidden' to allow match button interaction
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardWithWinner: {
    borderColor: '#40C057',
    shadowColor: '#40C057',
    shadowOpacity: 0.15,
  },
  teamSlot: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 44,
  },
  winnerSlot: {
    backgroundColor: '#F2FBF2',
  },
  loserSlot: {
    backgroundColor: '#FFF5F5',
    opacity: 0.7,
  },
  teamContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 14,
  },
  teamName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
  },
  winnerText: {
    color: '#2B8A3E',
  },
  loserText: {
    color: '#868E96',
    textDecorationLine: 'line-through',
  },
  placeholderText: {
    fontSize: 12,
    color: '#ADB5BD',
    fontWeight: '500',
  },
  emptySlot: {
    fontSize: 12,
    color: '#DEE2E6',
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F3F5',
  },
  matchButton: {
    position: 'absolute',
    right: -20,
    top: '50%',
    marginTop: -15, // Center vertically (36/2 - some offset for label)
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 3,
    borderColor: '#339AF0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    shadowColor: '#339AF0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  matchButtonActive: {
    backgroundColor: '#40C057',
    borderColor: '#40C057',
    shadowColor: '#40C057',
  },
  matchButtonDisabled: {
    borderColor: '#DEE2E6',
    shadowOpacity: 0,
    elevation: 0,
  },
  labelContainer: {
    marginTop: 8,
  },
  labelText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ADB5BD',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
