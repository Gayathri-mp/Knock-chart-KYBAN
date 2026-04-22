import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Trophy, Medal, Award, RotateCcw } from 'lucide-react-native';
import { Team } from '../lib/tournament';

interface VictoryModalProps {
  visible: boolean;
  first: Team | null;
  second: Team | null;
  third: Team | null;
  onReset: () => void;
}

const { width } = Dimensions.get('window');

export const VictoryModal = ({ visible, first, second, third, onReset }: VictoryModalProps) => {
  // Animated values
  const overlayOpacity  = useRef(new Animated.Value(0)).current;
  const podium2Y        = useRef(new Animated.Value(120)).current;
  const podium1Y        = useRef(new Animated.Value(160)).current;
  const podium3Y        = useRef(new Animated.Value(80)).current;
  const card1Scale      = useRef(new Animated.Value(0)).current;
  const card2Scale      = useRef(new Animated.Value(0)).current;
  const card3Scale      = useRef(new Animated.Value(0)).current;
  const titleY          = useRef(new Animated.Value(-40)).current;
  const titleOpacity    = useRef(new Animated.Value(0)).current;
  const btnOpacity      = useRef(new Animated.Value(0)).current;
  const sparkle1        = useRef(new Animated.Value(0)).current;
  const sparkle2        = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      // Reset all
      overlayOpacity.setValue(0);
      podium1Y.setValue(160); podium2Y.setValue(120); podium3Y.setValue(80);
      card1Scale.setValue(0); card2Scale.setValue(0); card3Scale.setValue(0);
      titleY.setValue(-40); titleOpacity.setValue(0); btnOpacity.setValue(0);
      sparkle1.setValue(0); sparkle2.setValue(0);
      return;
    }

    // Sequence of animations
    Animated.sequence([
      // Fade in overlay
      Animated.timing(overlayOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      // Title slides in
      Animated.parallel([
        Animated.spring(titleY, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
        Animated.timing(titleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      // Podiums rise up
      Animated.parallel([
        Animated.spring(podium2Y, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.spring(podium1Y, { toValue: 0, tension: 55, friction: 8, useNativeDriver: true }),
        Animated.spring(podium3Y, { toValue: 0, tension: 65, friction: 8, useNativeDriver: true }),
      ]),
      // Team cards pop in
      Animated.stagger(120, [
        Animated.spring(card2Scale, { toValue: 1, tension: 100, friction: 8, useNativeDriver: true }),
        Animated.spring(card1Scale, { toValue: 1, tension: 100, friction: 8, useNativeDriver: true }),
        Animated.spring(card3Scale, { toValue: 1, tension: 100, friction: 8, useNativeDriver: true }),
      ]),
      // Sparkles
      Animated.parallel([
        Animated.sequence([
          Animated.timing(sparkle1, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(sparkle1, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(sparkle2, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(sparkle2, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]),
      ]),
      // Button fades in
      Animated.timing(btnOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [visible]);

  const sparkle1Opacity = sparkle1;
  const sparkle2Opacity = sparkle2;

  const PodiumBlock = ({
    team, rank, podiumAnim, cardAnim, blockH, blockColor, badgeColor, badgeIcon, label
  }: {
    team: Team | null; rank: number; podiumAnim: Animated.Value; cardAnim: Animated.Value;
    blockH: number; blockColor: string; badgeColor: string; badgeIcon: React.ReactNode; label: string;
  }) => (
    <View style={styles.podiumCol}>
      {/* Team card floats above block */}
      <Animated.View style={[styles.teamCard, { transform: [{ scale: cardAnim }] }]}>
        <View style={[styles.teamIconLg, { backgroundColor: team ? team.color + '33' : '#1C2333', borderColor: badgeColor }]}>
          <Text style={{ fontSize: 24, color: team?.color ?? '#555' }}>{team?.logo ?? '?'}</Text>
        </View>
        <Text style={styles.teamCardName} numberOfLines={1}>{team?.name ?? '—'}</Text>
        <View style={[styles.badge, { backgroundColor: badgeColor + '22', borderColor: badgeColor }]}>
          {badgeIcon}
          <Text style={[styles.badgeLabel, { color: badgeColor }]}>{label}</Text>
        </View>
      </Animated.View>

      {/* Podium block slides up */}
      <Animated.View style={[styles.podiumBlock, { height: blockH, backgroundColor: blockColor, transform: [{ translateY: podiumAnim }] }]}>
        <Text style={styles.podiumRank}>{rank}</Text>
      </Animated.View>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        {/* Sparkle decorations */}
        <Animated.Text style={[styles.sparkle, styles.sparkle1, { opacity: sparkle1Opacity }]}>✦</Animated.Text>
        <Animated.Text style={[styles.sparkle, styles.sparkle2, { opacity: sparkle2Opacity }]}>✦</Animated.Text>
        <Animated.Text style={[styles.sparkle, styles.sparkle3, { opacity: sparkle1Opacity }]}>✦</Animated.Text>
        <Animated.Text style={[styles.sparkle, styles.sparkle4, { opacity: sparkle2Opacity }]}>⋆</Animated.Text>
        <Animated.Text style={[styles.sparkle, styles.sparkle5, { opacity: sparkle1Opacity }]}>✦</Animated.Text>

        <View style={styles.modal}>
          {/* Title */}
          <Animated.View style={{ transform: [{ translateY: titleY }], opacity: titleOpacity, alignItems: 'center', marginBottom: 36 }}>
            <Text style={styles.crownEmoji}>👑</Text>
            <Text style={styles.title}>Tournament Over!</Text>
            <Text style={styles.subtitle}>Here are your champions</Text>
          </Animated.View>

          {/* Podium */}
          <View style={styles.podiumRow}>
            {/* 2nd place */}
            <PodiumBlock
              team={second} rank={2} podiumAnim={podium2Y} cardAnim={card2Scale}
              blockH={90} blockColor="#3D3A50"
              badgeColor="#C0C0C0"
              badgeIcon={<Medal size={12} color="#C0C0C0" />}
              label="2nd"
            />
            {/* 1st place */}
            <PodiumBlock
              team={first} rank={1} podiumAnim={podium1Y} cardAnim={card1Scale}
              blockH={130} blockColor="#4A3B10"
              badgeColor="#FFD700"
              badgeIcon={<Trophy size={12} color="#FFD700" />}
              label="1st"
            />
            {/* 3rd place */}
            <PodiumBlock
              team={third} rank={3} podiumAnim={podium3Y} cardAnim={card3Scale}
              blockH={60} blockColor="#2D1F10"
              badgeColor="#CD7F32"
              badgeIcon={<Award size={12} color="#CD7F32" />}
              label="3rd"
            />
          </View>

          {/* Reset button */}
          <Animated.View style={{ opacity: btnOpacity, marginTop: 36 }}>
            <TouchableOpacity style={styles.resetBtn} onPress={onReset}>
              <RotateCcw size={16} color="#0A0D10" />
              <Text style={styles.resetBtnText}>New Tournament</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 14, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: Math.min(width - 48, 480),
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    backgroundColor: '#0F1520',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#1E2738',
    shadowColor: '#00E676',
    shadowOpacity: 0.08,
    shadowRadius: 40,
    elevation: 20,
  },
  crownEmoji: { fontSize: 40, marginBottom: 10 },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#4A5568',
    marginTop: 6,
    textAlign: 'center',
  },

  /* Podium */
  podiumRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    overflow: 'hidden',
  },
  podiumCol: {
    alignItems: 'center',
    width: 110,
  },

  /* Team card above podium */
  teamCard: {
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  teamIconLg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  teamCardName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C8D6E5',
    textAlign: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: '800',
  },

  /* Podium block */
  podiumBlock: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumRank: {
    fontSize: 28,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.15)',
  },

  /* Reset */
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#00E676',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#00E676',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  resetBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0A0D10',
  },

  /* Sparkles */
  sparkle: { position: 'absolute', fontSize: 20, color: '#FFD700' },
  sparkle1: { top: 60,  left:  60 },
  sparkle2: { top: 80,  right: 70 },
  sparkle3: { top: 160, left:  40, fontSize: 14, color: '#00E676' },
  sparkle4: { top: 200, right: 50, fontSize: 24, color: '#C0C0C0' },
  sparkle5: { bottom: 100, left: 80, fontSize: 16, color: '#CD7F32' },
});
