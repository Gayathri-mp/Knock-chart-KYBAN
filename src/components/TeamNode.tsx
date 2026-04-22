import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { User, Trophy } from 'lucide-react-native';
import { Team } from '../lib/tournament';

interface TeamNodeProps {
  team: Team | null;
  isFirstRound?: boolean;
  onPress?: () => void;
  isWinner?: boolean;
  isLoser?: boolean;
  score?: number;
}

export const TeamNode = ({
  team,
  isFirstRound,
  onPress,
  isWinner,
  isLoser,
  score,
}: TeamNodeProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isWinner && styles.winnerContainer,
        isLoser && styles.loserContainer,
      ]}
      onPress={onPress}
      disabled={!isFirstRound || !!isLoser}
    >
      <View style={styles.content}>
        <View style={[styles.logoContainer, { backgroundColor: team ? team.color + '22' : '#1A1D23' }]}>
          {team ? (
            <Text style={[styles.logoText, { color: team.color }]}>{team.logo}</Text>
          ) : (
            <User size={14} color="#495057" />
          )}
        </View>
        
        <Text
          style={[
            styles.teamName,
            !team && styles.placeholderText,
            isWinner && styles.winnerText,
            isLoser && styles.loserText,
          ]}
          numberOfLines={1}
        >
          {team ? team.name : (isFirstRound ? 'Select Team' : 'Winner')}
        </Text>

        {team && (
          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreText, isWinner && styles.winnerScoreText]}>
              {score ?? Math.floor(Math.random() * 50) + 50}
            </Text>
          </View>
        )}

        {isWinner && (
          <View style={styles.winnerIndicator}>
            <Trophy size={12} color="#00FF88" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1D23',
    borderRadius: 8,
    width: 160,
    height: 44,
    borderWidth: 1,
    borderColor: '#2A2F35',
    justifyContent: 'center',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  winnerContainer: {
    borderColor: '#00FF88',
    backgroundColor: 'rgba(0, 255, 136, 0.05)',
    borderWidth: 1.5,
  },
  loserContainer: {
    opacity: 0.4,
    borderColor: '#FF444433',
  },
  content: {
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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  logoText: {
    fontSize: 14,
  },
  teamName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#E9ECEF',
    letterSpacing: -0.2,
  },
  placeholderText: {
    color: '#495057',
    fontWeight: '400',
    fontStyle: 'italic',
  },
  winnerText: {
    color: '#FFFFFF',
  },
  loserText: {
    color: '#ADB5BD',
  },
  scoreContainer: {
    marginLeft: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 4,
  },
  scoreText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#495057',
    fontFamily: 'monospace',
  },
  winnerScoreText: {
    color: '#00FF88',
  },
  winnerIndicator: {
    marginLeft: 4,
  },
});
